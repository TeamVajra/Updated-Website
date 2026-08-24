import React from 'react';
import FadeIn from '../components/FadeIn';
import ScrollReveal from '../components/ScrollReveal';
import SectionTitle from '../components/ui/SectionTitle';
import Grid from '../components/ui/Grid';
import Card from '../components/ui/Card';
import './Team.css';

const alumniMembers = [
  {
    name: "Aditya Shinde",
    href: "https://www.linkedin.com/in/adityashinde9",
    src: "/assets/MEMBER POST/Aditya Shinde.png",
    alt: "Aditya Shinde"
  },
  {
    name: "Atharva Kanawade",
    href: "https://www.linkedin.com/in/atharvakanawade",
    src: "/assets/MEMBER POST/Atharva Kanawade.png",
    alt: "Atharva Kanawade"
  },
  {
    name: "Prathamesh Patil",
    href: "https://www.linkedin.com/in/prathmesh-patil-7a093a2a1",
    src: "/assets/MEMBER POST/Prathamesh Patil.png",
    alt: "Prathamesh Patil"
  },
  {
    name: "Aarav Thigale",
    href: "https://www.linkedin.com/in/aarav-thigale-a64b63266",
    src: "/assets/MEMBER POST/Aarav Thigale.png",
    alt: "Aarav Thigale"
  },
];

const teamMembers = [
  {
    name: "Omkar Bedekar",
    href: "https://www.linkedin.com/in/omkar-bedekar-0021922ba?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    src: "/assets/MEMBER POST/Omkar Bedekar.png",
    alt: "Omkar Bedekar"
  },
  {
    name: "Vishwajit Deshmukh",
    href: "https://www.linkedin.com/in/vishwajit-deshmukh-ab5225429?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    src: "/assets/MEMBER POST/Vishwajit.png",
    alt: "Vishwajit Deshmukh"
  },
  {
    name: "Anushk Nanaware",
    href: "https://www.linkedin.com/in/anushk-nanaware-60915a334?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    src: "/assets/MEMBER POST/Anushk.png",
    alt: "Anushk Nanaware"
  },
  {
    name: "Tanisha Kasliwal",
    href: "https://www.linkedin.com/in/tanishakasliwal",
    src: "/assets/MEMBER POST/Tanisha.png",
    alt: "Tanisha Kasliwal"
  },
  {
    name: "Avani Soman",
    href: "https://www.linkedin.com/in/avani-soman-1aa913316",
    src: "/assets/MEMBER POST/Avani.png",
    alt: "Avani Soman"
  },
  {
    name: "Ameya Walvekar",
    href: "https://www.linkedin.com/in/ameya-walvekar-b52aa8233?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
    src: "/assets/MEMBER POST/Ameya.png",
    alt: "Ameya Walvekar"
  },
  {
    name: "Soham Bhoir",
    href: "https://www.linkedin.com/in/soham-bhoir-488152334?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    src: "/assets/MEMBER POST/Soham.png",
    alt: "Soham Bhoir"
  },
  {
    name: "Sammrudhi Kulkarni",
    href: "https://www.linkedin.com/in/sammrudhikulkarni?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    src: "/assets/MEMBER POST/sammrudhi.png",
    alt: "Sammrudhi Kulkarni"
  },
  {
    name: "Rajat Mamluskar",
    href: "https://www.linkedin.com/in/rajat-mamluskar",
    src: "/assets/MEMBER POST/Rajat.png",
    alt: "Rajat Mamluskar"
  },
  {
    name: "Mohit Umardand",
    href: "https://www.linkedin.com/in/mohitumardand21?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    src: "/assets/MEMBER POST/Mohit.png",
    alt: "Mohit Umardand"
  },
  {
    name: "Sidhant Bachal",
    href: "https://www.linkedin.com/in/siddhant-bachal-01318b336?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    src: "/assets/MEMBER POST/Siddhant.png",
    alt: "Sidhant Bachal"
  },
  {
    name: "Pranav Motale",
    href: "https://www.linkedin.com/in/pranav-motale-7a922b2a5?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    src: "/assets/MEMBER POST/Pranav.png",
    alt: "Pranav Motale"
  },
  {
    name: "Nayan Patel",
    href: "https://www.linkedin.com/in/nayan-patel-5a9b14329?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    src: "/assets/MEMBER POST/Nayan.png",
    alt: "Nayan Patel"
  },
  {
    name: "Sidhi Changale",
    href: "https://www.linkedin.com/in/siddhi-changale-41b60532a",
    src: "/assets/MEMBER POST/Siddhi.png",
    alt: "Sidhi Changale"
  },
  {
    name: "Shambhavi Shastri",
    href: "https://www.linkedin.com/in/shambhavi-shastri-6995b3337/",
    src: "/assets/MEMBER POST/Shambhavi.png",
    alt: "Shambhavi Shastri"
  },
  {
    name: "Sakshi Sapkal",
    href: "https://www.linkedin.com/in/sakshisapkal?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    src: "/assets/MEMBER POST/Sakshi.png",
    alt: "Sakshi Sapkal"
  },
  {
    name: "Nupur Shingvekar",
    href: "https://www.linkedin.com/in/nupur-shingvekar-a14708338?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    src: "/assets/MEMBER POST/Nupur.png",
    alt: "Nupur Shingvekar"
  },
  {
    name: "Sudhanshu Patil",
    href: "https://www.linkedin.com/in/sudhanshupatil28/",
    src: "/assets/MEMBER POST/Sudhanshu.png",
    alt: "Sudhanshu Patil"
  },
  {
    name: "Yash Pradhan",
    href: "https://www.linkedin.com/in/yash-pradhan-ba483239a?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    src: "/assets/MEMBER POST/Yash.png",
    alt: "Yash Pradhan"
  },
  {
    name: "Sarthak Naik",
    href: "https://www.linkedin.com/in/sarthak-naik-337583395/",
    src: "/assets/MEMBER POST/Sarthak Naik.png",
    alt: "Sarthak Naik"
  },
  {
    name: "Urvi Shivalkar",
    href: "https://www.linkedin.com/in/urvi-shivalkar-b87437374",
    src: "/assets/MEMBER POST/Urvi.png",
    alt: "Urvi Shivalkar"
  },
  {
    name: "Sarthak Joshi",
    href: "https://www.linkedin.com/in/sarthak-joshi-593597238?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    src: "/assets/MEMBER POST/Joshi Sarthak.png",
    alt: "Sarthak Joshi"
  },
  {
    name: "Shivaraj Deshmukh",
    href: "https://www.linkedin.com/in/shivraj-deshmukh-271137399?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    src: "/assets/MEMBER POST/Shivraj.png",
    alt: "Shivaraj Deshmukh"
  },
  {
    name: "Abhinav Ghadage",
    href: "https://www.linkedin.com/in/abhinav-ghadage",
    src: "/assets/MEMBER POST/Abhinav.png",
    alt: "Abhinav Ghadage"
  },
  {
    name: "Atharva Gaykar",
    href: "https://www.linkedin.com/in/atharva-gaykar-38362437a?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    src: "/assets/MEMBER POST/Gaykar.png",
    alt: "Atharva Gaykar"
  },
  {
    name: "Divya Sawant",
    href: "https://www.linkedin.com/in/divya-sawant-198205396?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    src: "/assets/MEMBER POST/Divya.png",
    alt: "Divya Sawant"
  },
  {
    name: "Vinayak Singh",
    href: "https://www.linkedin.com/in/vinayak-singh-a62364396/",
    src: "/assets/MEMBER POST/Vinayak.png",
    alt: "Vinayak Singh"
  },
  {
    name: "Mugdha Tipnis",
    href: "https://www.linkedin.com/in/mugdha-tipnis-8404392a0",
    src: "/assets/MEMBER POST/Mugdha.png",
    alt: "Mugdha Tipnis"
  },
  {
    name: "Shruti Deshmukh",
    href: "https://www.linkedin.com/in/shruti-deshmukh-4b80a1385?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    src: "/assets/MEMBER POST/Shruti.png",
    alt: "Shruti Deshmukh"
  },
  {
    name: "Chaitanya Pawar",
    href: "https://www.linkedin.com/in/chaitanya-pawar-778290371?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
    src: "/assets/MEMBER POST/Chaitanya.png",
    alt: "Chaitanya Pawar"
  },
  {
    name: "Bhavesh Kutemate",
    href: "https://www.linkedin.com/in/bhavesh-kutemate-13135a386",
    src: "/assets/MEMBER POST/Bhavesh.png",
    alt: "Bhavesh Kutemate"
  },
  {
    name: "Swara Kulkarni",
    href: "https://www.linkedin.com/in/swara-kulkarni-b03285399?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    src: "/assets/MEMBER POST/Swara.png",
    alt: "Swara Kulkarni"
  },
];

const Team = () => {
  return (
    <>
      <section className="founders-section">
        <FadeIn>
          <SectionTitle>Meet Our Founders</SectionTitle>
        </FadeIn>
        <Grid variant="founders">
          {[
            { src: "/assets/manas.jpeg", alt: "Manas", name: "MANAS" },
            { src: "/assets/aatish.jpeg", alt: "Aatish", name: "AATISH" },
            { src: "/assets/omkar.jpeg", alt: "Omkar", name: "OMKAR" },
          ].map((founder, i) => (
            <ScrollReveal key={founder.name} delay={i * 0.12}>
              <Card imageSrc={founder.src} imageAlt={founder.alt} className="founders-card">
                <span className="founder-name">{founder.name}</span>
              </Card>
            </ScrollReveal>
          ))}
        </Grid>
      </section>

      <section className="alumni-section">
        <FadeIn>
          <SectionTitle>Alumni</SectionTitle>
          <p className="team-subtitle">
            <strong>🔸 Click on the photos to know more about our alumni 🔸</strong>
          </p>
        </FadeIn>
        <Grid variant="team">
          {alumniMembers.map((member, i) => (
            <ScrollReveal key={member.name} delay={(i % 4) * 0.08} className="team-member-link">
              <a href={member.href} target="_blank" rel="noopener noreferrer" className="team-member-link">
                <Card imageSrc={member.src} imageAlt={member.alt} className="team-member-card" />
              </a>
            </ScrollReveal>
          ))}
        </Grid>
      </section>

      <section className="team-section">
        <FadeIn>
          <SectionTitle>Meet Our Team</SectionTitle>
          <p className="team-subtitle">
            <strong>🔸 Click on the photos to know more about our members 🔸</strong>
          </p>
        </FadeIn>

        <Grid variant="team">
          {teamMembers.map((member, i) => (
            <ScrollReveal key={member.name} delay={(i % 4) * 0.08} className="team-member-link">
              <a href={member.href} target="_blank" rel="noopener noreferrer" className="team-member-link">
                <Card imageSrc={member.src} imageAlt={member.alt} className="team-member-card" />
              </a>
            </ScrollReveal>
          ))}
        </Grid>
      </section>
    </>
  );
};

export default Team;

