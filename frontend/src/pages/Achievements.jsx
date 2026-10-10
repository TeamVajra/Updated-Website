import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FadeIn from '../components/FadeIn';
import SectionTitle from '../components/ui/SectionTitle';
import Grid from '../components/ui/Grid';
import Card from '../components/ui/Card';
import './Achievements.css';

const achievementsData = [
  // 2026
  {
    year: '2026',
    src: '/assets/Drone -1 Zonals.jpg',
    alt: 'Technoxian 10.0 Zonals - Drone Rescue Rank - 1',
    title: 'Technoxian 10.0 Zonals - Drone Rescue Rank - 1',
  },
  {
    year: '2026',
    src: '/assets/Drone -2 Zonals.jpg',
    alt: 'Technoxian 10.0 Zonals - Drone Rescue Rank - 3',
    title: 'Technoxian 10.0 Zonals - Drone Rescue Rank - 3',
  },
  {
    year: '2026',
    src: '/assets/LFR Zonals.jpg',
    alt: 'Technoxian 10.0 Zonals - Fastest Line Following Robot Rank - 2',
    title: 'Technoxian 10.0 Zonals - Fastest Line Following Robot Rank - 2',
    imgStyle: { objectPosition: '15% 75%' },
    description: "Team Vajra participated in the Fastest Line Follower Robot competition at TechnoXian Pune Zonal 10.0's , fielding an autonomous robot against strong competition from institutions. One of the two robots advanced to the zonal round, where it delivered a strong performance to clinch Second Place, a result that highlights the team's expertise in embedded systems, sensor-based navigation, and precision control engineering.",
  },
  {
    year: '2026',
    src: '/assets/AIT Achievement.jpeg',
    alt: 'AIT Drone Drag Wartech 4.0',
    title: 'AIT Drone Drag Wartech 4.0',
  },
  {
    year: '2026',
    src: '/assets/COEP Mindspark Achievmanet.jpeg',
    alt: 'COEP Mindspark - ROBO FALCONARY Rank - 1',
    title: 'COEP Mindspark - ROBO FALCONARY Rank - 1',
  },
  // 2025
  {
    year: '2025',
    src: '/assets/vajra-onstage.jpg',
    alt: 'Technoxian 2025',
    title: 'Technoxian 2025 - World Rank 3 / All India Rank 2',
  },
  // 2024
  {
    year: '2024',
    src: '/assets/technoxian-24.jpg',
    alt: 'Technoxian Championship 2024',
    title: 'Technoxian 2024 - World Rank 4 / All India Rank 3',
  },
  // Upcoming
  {
    year: 'Upcoming',
    src: '/assets/tech.png',
    alt: 'Technoxian World Cup',
    title: "Technoxian World Cup'26",
    noWatermark: true,
  },
];

const Achievements = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const isOpen = activeIndex !== null;

  const openLightbox = (index) => setActiveIndex(index);
  const closeLightbox = () => setActiveIndex(null);

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % achievementsData.length);
  }, []);

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + achievementsData.length) % achievementsData.length);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, goNext, goPrev]);

  // Lock body scroll while lightbox is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const currentItem = activeIndex !== null ? achievementsData[activeIndex] : null;

  return (
    <div className="page-container">
      <FadeIn>
        <SectionTitle>Our Achievements 🏆</SectionTitle>
        <p className="achievements-intro">
          A timeline of our victories, podium finishes, and technical breakthroughs across national and international robotics championships.
        </p>
      </FadeIn>

      <div className="timeline-container">
        {/* ===== 2026 SECTION ===== */}
        <div className="timeline-year-section">
          <FadeIn delay={0.1}>
            <div className="timeline-year-header">
              <div className="timeline-node"></div>
              <div className="timeline-year-pill">
                <span className="pill-dot"></span>
                2026
              </div>
              <span className="timeline-year-title">Technoxian 10.0 Zonals & Wartech</span>
            </div>
          </FadeIn>

          <Grid>
            <FadeIn delay={0.15} style={{ width: '100%' }}>
              <div
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && openLightbox(0)}
                aria-label="Enlarge Technoxian 10.0 Zonals - Drone Rescue Rank - 1"
                style={{ display: 'block', width: '100%', outline: 'none' }}
              >
                <Card
                  imageSrc="/assets/Drone -1 Zonals.jpg"
                  imageAlt="Technoxian 10.0 Zonals - Drone Rescue Rank - 1"
                  className="achievement-card"
                  onClick={() => openLightbox(0)}
                >
                  <div className="ui-card-caption">Technoxian 10.0 Zonals - Drone Rescue Rank - 1</div>
                </Card>
              </div>
            </FadeIn>

            <FadeIn delay={0.2} style={{ width: '100%' }}>
              <div
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && openLightbox(1)}
                aria-label="Enlarge Technoxian 10.0 Zonals - Drone Rescue Rank - 3"
                style={{ display: 'block', width: '100%', outline: 'none' }}
              >
                <Card
                  imageSrc="/assets/Drone -2 Zonals.jpg"
                  imageAlt="Technoxian 10.0 Zonals - Drone Rescue Rank - 3"
                  className="achievement-card"
                  onClick={() => openLightbox(1)}
                >
                  <div className="ui-card-caption">Technoxian 10.0 Zonals - Drone Rescue Rank - 3</div>
                </Card>
              </div>
            </FadeIn>

            <FadeIn delay={0.25} style={{ width: '100%' }}>
              <div
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && openLightbox(2)}
                aria-label="Enlarge Technoxian 10.0 Zonals - Fastest Line Following Robot Rank - 2"
                style={{ display: 'block', width: '100%', outline: 'none' }}
              >
                <Card
                  imageSrc="/assets/LFR Zonals.jpg"
                  imageAlt="Technoxian 10.0 Zonals - Fastest Line Following Robot Rank - 2"
                  className="achievement-card"
                  imgStyle={{ objectPosition: '15% 75%' }}
                  onClick={() => openLightbox(2)}
                >
                  <div className="ui-card-caption">Technoxian 10.0 Zonals - Fastest Line Following Robot Rank - 2</div>
                </Card>
              </div>
            </FadeIn>

            <FadeIn delay={0.3} style={{ width: '100%' }}>
              <div
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && openLightbox(3)}
                aria-label="Enlarge AIT Drone Drag Wartech 4.0"
                style={{ display: 'block', width: '100%', outline: 'none' }}
              >
                <Card
                  imageSrc="/assets/AIT Achievement.jpeg"
                  imageAlt="AIT Drone Drag Wartech 4.0"
                  className="achievement-card"
                  onClick={() => openLightbox(3)}
                >
                  <div className="ui-card-caption">AIT Drone Drag Wartech 4.0</div>
                </Card>
              </div>
            </FadeIn>

            <FadeIn delay={0.35} style={{ width: '100%' }}>
              <div
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && openLightbox(4)}
                aria-label="Enlarge COEP Mindspark - ROBO FALCONARY Rank - 1"
                style={{ display: 'block', width: '100%', outline: 'none' }}
              >
                <Card
                  imageSrc="/assets/COEP Mindspark Achievmanet.jpeg"
                  imageAlt="COEP Mindspark - ROBO FALCONARY Rank - 1"
                  className="achievement-card"
                  onClick={() => openLightbox(4)}
                >
                  <div className="ui-card-caption">COEP Mindspark - ROBO FALCONARY Rank - 1</div>
                </Card>
              </div>
            </FadeIn>
          </Grid>
        </div>

        {/* ===== 2025 SECTION ===== */}
        <div className="timeline-year-section">
          <FadeIn delay={0.1}>
            <div className="timeline-year-header">
              <div className="timeline-node"></div>
              <div className="timeline-year-pill">
                <span className="pill-dot"></span>
                2025
              </div>
              <span className="timeline-year-title">World & All-India Podium</span>
            </div>
          </FadeIn>

          <Grid>
            <FadeIn delay={0.2} style={{ width: '100%' }}>
              <div
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && openLightbox(5)}
                aria-label="Enlarge Technoxian 2025 - World Rank 3 / All India Rank 2"
                style={{ display: 'block', width: '100%', outline: 'none' }}
              >
                <Card
                  imageSrc="/assets/vajra-onstage.jpg"
                  imageAlt="Technoxian 2025"
                  className="achievement-card"
                  onClick={() => openLightbox(5)}
                >
                  <div className="ui-card-caption">Technoxian 2025 - World Rank 3 / All India Rank 2</div>
                </Card>
              </div>
            </FadeIn>
          </Grid>
        </div>

        {/* ===== 2024 SECTION ===== */}
        <div className="timeline-year-section">
          <FadeIn delay={0.1}>
            <div className="timeline-year-header">
              <div className="timeline-node"></div>
              <div className="timeline-year-pill">
                <span className="pill-dot"></span>
                2024
              </div>
              <span className="timeline-year-title">Technoxian Championship</span>
            </div>
          </FadeIn>

          <Grid>
            <FadeIn delay={0.2} style={{ width: '100%' }}>
              <div
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && openLightbox(6)}
                aria-label="Enlarge Technoxian 2024 - World Rank 4 / All India Rank 3"
                style={{ display: 'block', width: '100%', outline: 'none' }}
              >
                <Card
                  imageSrc="/assets/technoxian-24.jpg"
                  imageAlt="Technoxian Championship 2024"
                  className="achievement-card"
                  onClick={() => openLightbox(6)}
                >
                  <div className="ui-card-caption">Technoxian 2024 - World Rank 4 / All India Rank 3</div>
                </Card>
              </div>
            </FadeIn>
          </Grid>
        </div>

        {/* ===== UPCOMING EVENTS SECTION ===== */}
        <div className="timeline-year-section">
          <FadeIn delay={0.1}>
            <div className="timeline-year-header">
              <div className="timeline-node"></div>
              <div className="timeline-year-pill upcoming">
                <span className="pill-dot"></span>
                Upcoming
              </div>
              <span className="timeline-year-title">Next Horizons & Challenges</span>
            </div>
          </FadeIn>

          <Grid>
            <FadeIn delay={0.15} style={{ width: '100%' }}>
              <div
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && openLightbox(7)}
                aria-label="Enlarge Technoxian World Cup'26"
                style={{ display: 'block', width: '100%', outline: 'none' }}
              >
                <Card
                  imageSrc="/assets/tech.png"
                  imageAlt="Technoxian World Cup"
                  className="achievement-card no-watermark"
                  onClick={() => openLightbox(7)}
                >
                  <div className="ui-card-caption">Technoxian World Cup'26</div>
                </Card>
              </div>
            </FadeIn>
          </Grid>
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isOpen && currentItem && (
          <motion.div
            className="lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeLightbox}
          >
            {/* Close button with SVG icon */}
            <button
              className="lightbox-close"
              onClick={closeLightbox}
              aria-label="Close lightbox"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {/* Prev button with SVG icon */}
            <button
              className="lightbox-nav lightbox-prev"
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              aria-label="Previous image"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>

            {/* Lightbox Content */}
            <motion.div
              className={`lightbox-content ${currentItem.noWatermark ? 'no-watermark' : ''}`}
              onClick={(e) => e.stopPropagation()}
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.88, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <img
                src={currentItem.src}
                alt={currentItem.alt}
              />
              <div className="lightbox-info">
                <p className="lightbox-caption">
                  {currentItem.title} &nbsp;·&nbsp; {activeIndex + 1} / {achievementsData.length}
                </p>
                {currentItem.description && (
                  <div className="lightbox-description-box">
                    <p>{currentItem.description}</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Next button with SVG icon */}
            <button
              className="lightbox-nav lightbox-next"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              aria-label="Next image"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Achievements;
