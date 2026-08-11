import React, { useEffect, useRef, useCallback, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import './Simulator.css';

/* ══════════════════════════════════════════════════════
   Joystick Component
   springBack=false  → throttle behaviour (knob stays)
   springBack=true   → pitch/roll behaviour (snaps centre)
══════════════════════════════════════════════════════ */
const Joystick = ({
  color = '#f7c275',
  onValue,
  springBackX = true,
  springBackY = true,
  initialY = 0,
  isThrottle = false
}) => {
  const outerRef   = useRef(null);
  const knobRef    = useRef(null);
  const isActive   = useRef(false);
  const padCenter  = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: initialY });
  const RADIUS     = 50;

  // Position knob at initial position on mount
  useEffect(() => {
    if (knobRef.current && initialY !== 0) {
      knobRef.current.style.transform = `translate(0px, ${initialY}px)`;
    }
  }, [initialY]);

  const clamp = (dx, dy) => {
    const d = Math.sqrt(dx * dx + dy * dy);
    const f = d > RADIUS ? RADIUS / d : 1;
    return { x: dx * f, y: dy * f };
  };

  const apply = useCallback((cx, cy) => {
    currentPos.current = { x: cx, y: cy };
    if (knobRef.current) {
      knobRef.current.style.transition = 'none';
      knobRef.current.style.transform  = `translate(${cx}px,${cy}px)`;
    }
    const valX = cx / RADIUS;
    const valY = isThrottle ? (RADIUS - cy) / (2 * RADIUS) : -(cy / RADIUS);
    onValue(valX, valY);
  }, [onValue, isThrottle]);

  const getXY = (e) => {
    const s = e.touches ? e.touches[0] : e;
    return { x: s.clientX, y: s.clientY };
  };

  const onStart = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    isActive.current = true;
    const r = outerRef.current.getBoundingClientRect();
    padCenter.current = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    const { x, y } = getXY(e);
    const { x: cx, y: cy } = clamp(x - padCenter.current.x, y - padCenter.current.y);
    apply(cx, cy);
  }, [apply]);

  const onMove = useCallback((e) => {
    if (!isActive.current) return;
    const { x, y } = getXY(e);
    const { x: cx, y: cy } = clamp(x - padCenter.current.x, y - padCenter.current.y);
    apply(cx, cy);
  }, [apply]);

  const onEnd = useCallback(() => {
    if (!isActive.current) return;
    isActive.current = false;

    let targetX = currentPos.current.x;
    let targetY = currentPos.current.y;

    if (springBackX) targetX = 0;
    if (springBackY) targetY = 0;

    currentPos.current = { x: targetX, y: targetY };

    if (knobRef.current) {
      knobRef.current.style.transition = 'transform 0.3s cubic-bezier(0.22,1,0.36,1)';
      knobRef.current.style.transform  = `translate(${targetX}px,${targetY}px)`;
    }

    const valX = targetX / RADIUS;
    const valY = isThrottle ? (RADIUS - targetY) / (2 * RADIUS) : -(targetY / RADIUS);
    onValue(valX, valY);
  }, [springBackX, springBackY, isThrottle, onValue]);

  useEffect(() => {
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup',   onEnd);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend',  onEnd);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup',   onEnd);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend',  onEnd);
    };
  }, [onMove, onEnd]);

  return (
    <div
      ref={outerRef}
      className="tx-stick-pad"
      style={{ '--sc': color }}
      onMouseDown={onStart}
      onTouchStart={onStart}
    >
      <span className="s-guide s-guide-h" />
      <span className="s-guide s-guide-v" />
      <span className="s-ring s-ring-outer" />
      <span className="s-ring s-ring-inner" />
      <div
        ref={knobRef}
        className="s-knob"
        style={{
          background: `radial-gradient(circle at 38% 33%,
            color-mix(in srgb, ${color} 50%, #fff),
            ${color} 55%,
            color-mix(in srgb, ${color} 60%, #000))`
        }}
      />
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   Main Simulator Page
══════════════════════════════════════════════════════ */
const Simulator = () => {
  const mountRef = useRef(null);

  /* Joystick live values (refs → no re-render in RAF) */
  const lx = useRef(0);   // Yaw
  const ly = useRef(0);   // Throttle (0..1)
  const rx = useRef(0);   // Roll
  const ry = useRef(0);   // Pitch

  /* Drone derived state & refs */
  const droneAlt   = useRef(0);
  const droneYaw   = useRef(0);
  const droneRef   = useRef(null);

  /* Camera orbit */
  const azimuth    = useRef(0.5);
  const elevation  = useRef(0.55);
  const camDrag    = useRef(false);
  const camPrev    = useRef({ x: 0, y: 0 });

  /* LCD display state (80 ms poll) */
  const [lcd, setLcd] = useState({ thr: 0, yaw: 0, ptch: 0, roll: 0, heading: 0 });

  /* Re-center drone function */
  const recenterDrone = useCallback(() => {
    droneYaw.current  = 0;
    droneAlt.current  = 0;
    azimuth.current   = 0;
    elevation.current = 0.35;
    rx.current        = 0;
    ry.current        = 0;
    lx.current        = 0;
    droneYaw.current  = 0;
    if (droneRef.current) {
      droneRef.current.position.set(0, 0, 0);
      // Reset to base orientation: header faces opposite to user (Math.PI), level
      droneRef.current.rotation.set(0, Math.PI, 0);
    }
  }, []);

  /* ARM / DISARM with Safety Checks */
  const [isArmed, setIsArmed]       = useState(false);
  const [armWarning, setArmWarning] = useState('');
  const isArmedRef                  = useRef(false); // ref so RAF can read it without stale closure

  const toggleArm = useCallback(() => {
    if (isArmedRef.current) {
      // Disarm immediately
      isArmedRef.current = false;
      setIsArmed(false);
      setArmWarning('');
      return;
    }

    // Safety Check 1: Throttle must be zero / low
    if (ly.current > 0.05) {
      setArmWarning('⚠️ CANNOT ARM: THROTTLE IS HIGH! LOWER THROTTLE TO ZERO');
      setTimeout(() => setArmWarning(''), 3500);
      return;
    }

    // Safety Check 2: Pitch, Roll & Yaw axes must be centered / level
    if (Math.abs(rx.current) > 0.1 || Math.abs(ry.current) > 0.1 || Math.abs(lx.current) > 0.1) {
      setArmWarning('⚠️ CANNOT ARM: STICKS NOT CENTERED / DRONE NOT LEVEL!');
      setTimeout(() => setArmWarning(''), 3500);
      return;
    }

    // All safety checks passed -> ARM
    isArmedRef.current = true;
    setIsArmed(true);
    setArmWarning('');
  }, []);

  /* ── Three.js setup ── */
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let rafId, lcdTimer;
    let cleanupFns = [];

    // Defer init by one frame so the DOM has real layout dimensions
    const initId = requestAnimationFrame(() => {
      const W = mount.clientWidth  || 920;
      const H = mount.clientHeight || 420;

      // Renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(W, H);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x06080c, 1);   // solid dark bg — no transparent black
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type    = THREE.PCFSoftShadowMap;
      mount.appendChild(renderer.domElement);

    // Scene
    const scene = new THREE.Scene();
    scene.fog   = new THREE.FogExp2(0x060810, 0.038);

    // Camera
    const camera = new THREE.PerspectiveCamera(52, W / H, 0.1, 100);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 3));

    const sun = new THREE.DirectionalLight(0xffffff, 4);
    sun.position.set(5, 10, 7);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    scene.add(sun);

    const rim = new THREE.DirectionalLight(0xf7c275, 2.5);
    rim.position.set(-5, 3, -5);
    scene.add(rim);

    const fill = new THREE.PointLight(0x4488ff, 1.5, 12);
    fill.position.set(0, -4, 0);
    scene.add(fill);

    // Grid ground
    const grid = new THREE.GridHelper(28, 28, 0x2a2a4a, 0x191928);
    grid.position.y = -3.8;
    scene.add(grid);

    /* ── Root Drone Group ── */
    const drone = new THREE.Group();
    droneRef.current = drone;
    scene.add(drone);

    const propMeshes = [];
    const mProp = [
      new THREE.MeshStandardMaterial({ color: 0xddeeff, transparent: true, opacity: 0.85, side: THREE.DoubleSide }),
      new THREE.MeshStandardMaterial({ color: 0xbbccdd, transparent: true, opacity: 0.85, side: THREE.DoubleSide }),
    ];
    const mRing = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, transparent: true, opacity: 0.2 });

    /* ── Load Custom Drone GLB ── */
    const loader = new GLTFLoader();
    loader.load(
      '/Drone.glb',
      (gltf) => {
        const model = gltf.scene;

        // 1. Rotate Z-up GLB model -90° around X
        model.rotation.x = -Math.PI / 2;

        // 2. Container object for scaled model
        const modelContainer = new THREE.Group();
        modelContainer.add(model);

        // 3. Center model in container after rotation
        const bbox = new THREE.Box3().setFromObject(modelContainer);
        const center = bbox.getCenter(new THREE.Vector3());
        model.position.sub(center);

        // 4. Scale modelContainer to standard simulator size (~2.4 units wide)
        const size = bbox.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.z);
        const scale = 2.4 / maxDim;
        modelContainer.scale.set(scale, scale, scale);

        // Enable shadows & refine materials
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material) {
              child.material.roughness = 0.35;
              child.material.metalness = 0.65;
              // Disable GLB vertex colors if any are affecting shading
              child.material.vertexColors = false;
            }
          }
        });

        drone.add(modelContainer);

        // Rotate root drone group 180° so FPV camera header faces opposite to user
        drone.rotation.y = Math.PI;

        /* ── Realistic 3-Blade FPV Propellers ── */
        // Create 3-blade propeller geometry (central hub + 3 pitched aerodynamic blades)
        const createRealisticPropeller = (color) => {
          const propRoot = new THREE.Group();

          // 1. Central Motor Shaft / Prop Nut Hub
          const hubMat = new THREE.MeshStandardMaterial({ color: 0x111118, metalness: 0.9, roughness: 0.2 });
          const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.12, 16), hubMat);
          hub.position.y = 0.06;
          propRoot.add(hub);

          const nut = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.05, 12), hubMat);
          nut.position.y = 0.13;
          propRoot.add(nut);

          // 2. 3 Tapered & Pitched Blades spaced 120° apart
          const bladeMat = new THREE.MeshStandardMaterial({
            color: color,
            metalness: 0.2,
            roughness: 0.3,
            side: THREE.DoubleSide
          });

          for (let b = 0; b < 3; b++) {
            const angle = (b * Math.PI * 2) / 3;
            const bladeGroup = new THREE.Group();
            bladeGroup.rotation.y = angle;

            // Blade arm (tapered box)
            const bladeGeom = new THREE.BoxGeometry(0.48, 0.015, 0.09);
            // Translate geometry so origin is at the hub edge
            bladeGeom.translate(0.24, 0, 0);

            const bladeMesh = new THREE.Mesh(bladeGeom, bladeMat);
            bladeMesh.position.y = 0.06;
            // Pitch twist for realistic aerofoil
            bladeMesh.rotation.x = 0.25;
            bladeMesh.castShadow = true;

            bladeGroup.add(bladeMesh);
            propRoot.add(bladeGroup);
          }

          // 3. Motion Blur Ring (transparent overlay during flight)
          const blurMat = new THREE.MeshStandardMaterial({
            color: color,
            transparent: true,
            opacity: 0.22,
            side: THREE.DoubleSide
          });
          const blurDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.01, 24), blurMat);
          blurDisc.position.y = 0.06;
          propRoot.add(blurDisc);

          return propRoot;
        };

        // Motor positions aligned to exact frame motor mounts
        const armX = 1.078;
        const armZ = 1.078;
        const propY = 0.07;

        // ALL 4 PROPELLERS ARE ELECTRIC BLUE (0x1d4ed8)
        const PROP_COLOR = 0x1d4ed8;

        const motorLocs = [
          { x:  armX, z: -armZ, color: PROP_COLOR }, // Front-Right
          { x: -armX, z: -armZ, color: PROP_COLOR }, // Front-Left
          { x: -armX, z:  armZ, color: PROP_COLOR }, // Rear-Left
          { x:  armX, z:  armZ, color: PROP_COLOR }, // Rear-Right
        ];

        motorLocs.forEach(({ x, z, color }, i) => {
          const prop = createRealisticPropeller(color);
          prop.position.set(x, propY, z);
          drone.add(prop);
          propMeshes.push({ mesh: prop, dir: i % 2 === 0 ? 1 : -1 });
        });
      },
      undefined,
      (err) => console.error('Failed to load Drone.glb:', err)
    );

    /* ── Canvas drag → camera orbit ── */
    const onMD  = (e) => { camDrag.current = true;  camPrev.current = { x: e.clientX, y: e.clientY }; };
    const onMM  = (e) => {
      if (!camDrag.current) return;
      azimuth.current   += (e.clientX - camPrev.current.x) * 0.007;
      elevation.current  = Math.max(0.08, Math.min(1.45, elevation.current - (e.clientY - camPrev.current.y) * 0.007));
      camPrev.current    = { x: e.clientX, y: e.clientY };
    };
    const onMU  = () => { camDrag.current = false; };

    mount.addEventListener('mousedown', onMD);
    window.addEventListener('mousemove', onMM);
    window.addEventListener('mouseup',   onMU);

    /* ── Animation loop ── */
    let t = 0;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      t += 0.004;

      // Spin propellers — ONLY spin when ARMED
      if (isArmedRef.current) {
        const spd = 0.28 + Math.max(0, ly.current) * 0.25;
        propMeshes.forEach(({ mesh, dir }) => { mesh.rotation.y += dir * spd; });
      } else {
        // Slowly decelerate to a stop when disarmed
        propMeshes.forEach(({ mesh, dir }) => { mesh.rotation.y += dir * 0.005; });
      }

      // Camera
      const R = 7;
      camera.position.set(
        Math.sin(azimuth.current)  * Math.cos(elevation.current) * R,
        Math.sin(elevation.current) * R,
        Math.cos(azimuth.current)  * Math.cos(elevation.current) * R
      );
      camera.lookAt(0, drone.position.y, 0);

      // Drone rotations — only when armed
      // Use quaternion composition so pitch/roll are always relative to the drone's yawed heading.
      if (isArmedRef.current) {
        droneYaw.current -= lx.current * 0.028; // accumulate yaw

        // Target pitch & roll angles (lerp toward stick targets)
        const targetPitch = THREE.MathUtils.lerp(
          drone.userData.curPitch ?? 0,
          -ry.current * (Math.PI / 5.5),
          0.08
        );
        const targetRoll = THREE.MathUtils.lerp(
          drone.userData.curRoll ?? 0,
          rx.current * (Math.PI / 5.5),
          0.08
        );
        drone.userData.curPitch = targetPitch;
        drone.userData.curRoll  = targetRoll;

        // Build quaternion: yaw (world-Y) → pitch (local X) → roll (local Z)
        const qYaw   = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI + droneYaw.current);
        const qPitch = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), targetPitch);
        const qRoll  = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), targetRoll);
        drone.quaternion.copy(qYaw).multiply(qPitch).multiply(qRoll);

        // Throttle altitude + hover bob
        droneAlt.current = THREE.MathUtils.lerp(droneAlt.current, Math.max(0, ly.current) * 1.8, 0.04);
        const bob = ly.current > 0.05 ? Math.sin(t * 1.5) * 0.07 : 0;
        drone.position.y = THREE.MathUtils.lerp(drone.position.y, droneAlt.current + bob, 0.05);
      } else {
        // Return to level & land when disarmed; restore base heading (header opposite to user)
        drone.userData.curPitch = THREE.MathUtils.lerp(drone.userData.curPitch ?? 0, 0, 0.05);
        drone.userData.curRoll  = THREE.MathUtils.lerp(drone.userData.curRoll  ?? 0, 0, 0.05);

        const qYaw   = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI + droneYaw.current);
        const qPitch = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), drone.userData.curPitch);
        const qRoll  = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), drone.userData.curRoll);
        drone.quaternion.copy(qYaw).multiply(qPitch).multiply(qRoll);

        droneAlt.current = THREE.MathUtils.lerp(droneAlt.current, 0, 0.03);
        drone.position.y = THREE.MathUtils.lerp(drone.position.y, 0, 0.03);
      }

      renderer.render(scene, camera);
    };
    animate();

    // LCD poll — heading: 0° = home (header opposite user), increases with yaw
    lcdTimer = setInterval(() => {
      const deg = Math.round(((-droneYaw.current * 180 / Math.PI) % 360 + 360) % 360);
      setLcd({
        thr:     Math.round(Math.max(0, ly.current) * 100),
        yaw:     Math.round(lx.current  * 100),
        ptch:    Math.round(ry.current  * 100),
        roll:    Math.round(rx.current  * 100),
        heading: deg,
      });
    }, 80);

    // Resize
    const onResize = () => {
      const w = mount.clientWidth  || mount.offsetWidth;
      const h = mount.clientHeight || mount.offsetHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    cleanupFns = [
      () => { cancelAnimationFrame(rafId); },
      () => { clearInterval(lcdTimer); },
      () => { window.removeEventListener('resize',     onResize); },
      () => { window.removeEventListener('mousemove',  onMM); },
      () => { window.removeEventListener('mouseup',    onMU); },
      () => { mount.removeEventListener('mousedown',   onMD); },
      () => { renderer.dispose(); },
      () => { if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement); },
    ];
    }); // end requestAnimationFrame

    return () => {
      cancelAnimationFrame(initId);
      cleanupFns.forEach(fn => fn());
    };
  }, []);

  const onLeft  = useCallback((x, y) => {
    lx.current = x; ly.current = y;
  }, []);
  const onRight = useCallback((x, y) => {
    rx.current = x; ry.current = y; // Inverted flight response relative to stick displacement
  }, []);

  /* ── Render ── */
  return (
    <div className="sim-page">
      <div className="sim-hdr">
        <h1 className="sim-title">Drone Flight Simulator</h1>
        <p className="sim-sub">Drag the transmitter sticks to fly · Drag the 3D view to orbit</p>
      </div>

      {/* 3D Canvas with overlay HUD & Re-center control */}
      <div className="sim-canvas-wrap">
        <button className="sim-btn-recenter" onClick={recenterDrone} title="Re-center drone position & align header front">
          🎯 RE-CENTER DRONE
        </button>

        <div className="sim-heading-hud">
          <div className="hud-compass">
            <span className="compass-pointer" style={{ transform: `rotate(${lcd.heading || 0}deg)` }}>▲</span>
          </div>
          <div className="hud-info">
            <span className="hud-label">HEADER DIR</span>
            <span className="hud-val">{lcd.heading || 0}°</span>
          </div>
        </div>

        <div className="sim-canvas" ref={mountRef} />
      </div>

      {/* ══ RC Transmitter ══ */}
      <div className="tx-perspective">
        <div className="tx-body">

          {/* Antennas + brand strip */}
          <div className="tx-top-strip">
            <div className="tx-ant tx-ant-l"><div className="ant-base" /></div>
            <div className="tx-brand-strip">
              <span className="tx-brand-name">TEAM VAJRA</span>
              <span className="tx-brand-model">FPV·TX·V2</span>
            </div>
            <div className="tx-ant tx-ant-r"><div className="ant-base" /></div>
          </div>

          {/* Main stick panel */}
          <div className="tx-panel">

            {/* LEFT STICK — Throttle / Yaw */}
            <div className="tx-stick-zone">
              <div className="tx-axis-label tx-axis-top">THROTTLE ↑↓</div>
              <Joystick
                color="#f7c275"
                onValue={onLeft}
                springBackX={true}
                springBackY={false}
                initialY={50}
                isThrottle={true}
              />
              <div className="tx-axis-label tx-axis-bot">← YAW →</div>
            </div>

            {/* CENTER — LCD + ARM switch */}
            <div className="tx-center-col">
              {/* LCD screen */}
              <div className="tx-lcd-frame">
                <div className="tx-lcd-bezel">
                  <div className="lcd-header">
                    <span className="lcd-title-text">FLIGHT DATA</span>
                    <div className="lcd-sig">
                      <span className="sig-bar h1" /><span className="sig-bar h2" />
                      <span className="sig-bar h3" /><span className="sig-bar h4" />
                    </div>
                  </div>
                  <div className="lcd-rows">
                    <div className="lcd-row">
                      <span className="lcd-k" style={{ color: '#f7c275' }}>THR</span>
                      <div className="lcd-bar-wrap">
                        <div className="lcd-bar" style={{ width: `${lcd.thr}%`, background: '#f7c275' }} />
                      </div>
                      <span className="lcd-v" style={{ color: '#f7c275' }}>{lcd.thr}%</span>
                    </div>
                    <div className="lcd-row">
                      <span className="lcd-k" style={{ color: '#f7c275' }}>YAW</span>
                      <div className="lcd-bar-wrap lcd-bar-center">
                        <div className="lcd-bar lcd-bar-signed" style={{ width: `${Math.abs(lcd.yaw)}%`, left: lcd.yaw >= 0 ? '50%' : `${50 - Math.abs(lcd.yaw)}%`, background: '#f7c275' }} />
                      </div>
                      <span className="lcd-v" style={{ color: '#f7c275' }}>{lcd.yaw > 0 ? '+' : ''}{lcd.yaw}%</span>
                    </div>
                    <div className="lcd-row">
                      <span className="lcd-k" style={{ color: '#7dd3fc' }}>PCH</span>
                      <div className="lcd-bar-wrap lcd-bar-center">
                        <div className="lcd-bar lcd-bar-signed" style={{ width: `${Math.abs(lcd.ptch)}%`, left: lcd.ptch >= 0 ? '50%' : `${50 - Math.abs(lcd.ptch)}%`, background: '#7dd3fc' }} />
                      </div>
                      <span className="lcd-v" style={{ color: '#7dd3fc' }}>{lcd.ptch > 0 ? '+' : ''}{lcd.ptch}%</span>
                    </div>
                    <div className="lcd-row">
                      <span className="lcd-k" style={{ color: '#7dd3fc' }}>ROL</span>
                      <div className="lcd-bar-wrap lcd-bar-center">
                        <div className="lcd-bar lcd-bar-signed" style={{ width: `${Math.abs(lcd.roll)}%`, left: lcd.roll >= 0 ? '50%' : `${50 - Math.abs(lcd.roll)}%`, background: '#7dd3fc' }} />
                      </div>
                      <span className="lcd-v" style={{ color: '#7dd3fc' }}>{lcd.roll > 0 ? '+' : ''}{lcd.roll}%</span>
                    </div>
                  </div>
                  <div className="lcd-footer">
                    <span className={isArmed ? 'lcd-linked' : 'lcd-disarmed'}>
                      {isArmed ? '● ARMED' : '○ DISARMED'}
                    </span>
                    <span className="lcd-mode">MODE 2</span>
                  </div>
                </div>
              </div>

              {/* Single ARM toggle switch */}
              <div className="tx-switches" style={{ justifyContent: 'center' }}>
                <div className="tx-sw" onClick={toggleArm} style={{ cursor: 'pointer' }} title="Click to ARM / DISARM">
                  <div className="sw-label" style={{ color: isArmed ? '#4ade80' : 'rgba(255,255,255,0.3)', fontWeight: 'bold' }}>ARM</div>
                  <div className={`sw-body ${isArmed ? 'sw-body--on' : ''}`}>
                    <div className={`sw-lever ${isArmed ? 'sw-lever--on' : ''}`} />
                  </div>
                </div>
              </div>

              {/* Arming safety warning banner */}
              {armWarning && (
                <div className="arm-warning-banner">
                  {armWarning}
                </div>
              )}
            </div>

            {/* RIGHT STICK — Pitch / Roll */}
            <div className="tx-stick-zone">
              <div className="tx-axis-label tx-axis-top">PITCH ↑↓</div>
              <Joystick
                color="#7dd3fc"
                onValue={onRight}
                springBackX={true}
                springBackY={true}
                initialY={0}
                isThrottle={false}
              />
              <div className="tx-axis-label tx-axis-bot">← ROLL →</div>
            </div>

          </div>{/* /tx-panel */}

          {/* Grip section */}
          <div className="tx-grips">
            <div className="tx-grip tx-grip-l">
              <div className="grip-tex" />
              <div className="grip-accent" />
            </div>
            <div className="tx-bottom-bar">
              <div className="tx-bottom-btn" />
              <div className="tx-bottom-btn tx-bottom-btn--led" />
              <div className="tx-bottom-btn" />
            </div>
            <div className="tx-grip tx-grip-r">
              <div className="grip-tex" />
              <div className="grip-accent" />
            </div>
          </div>

        </div>{/* /tx-body */}
      </div>{/* /tx-perspective */}

      {/* Mode legend */}
      <div className="sim-legend">
        <div className="legend-item">
          <span className="legend-dot" style={{ background: '#f7c275' }} />
          <span><strong>Left stick</strong> — Throttle (hold) + Yaw</span>
        </div>
        <div className="legend-sep" />
        <div className="legend-item">
          <span className="legend-dot" style={{ background: '#7dd3fc' }} />
          <span><strong>Right stick</strong> — Pitch + Roll (self-centres)</span>
        </div>
        <div className="legend-sep" />
        <div className="legend-item">
          <span className="legend-dot" style={{ background: isArmed ? '#4ade80' : '#ef4444' }} />
          <span><strong>ARM switch</strong> — Click to {isArmed ? 'disarm (stops drone)' : 'arm (enables controls)'}</span>
        </div>
      </div>

    </div>
  );
};

export default Simulator;
