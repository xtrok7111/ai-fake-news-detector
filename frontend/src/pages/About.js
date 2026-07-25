import React from 'react';
import Navbar from '../components/Navbar';

const UserIcon = ({ size = 50 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z" />
  </svg>
);

export default function About() {
  const team = [
    { name: 'Turki Ali Mubarak Alrayeh' },
    { name: 'Bader Ahmed Alghamdi' },
    { name: 'Turki Mohammed Alsaiari' },
  ];

  return (
    <div className="page" data-theme="about">
      <Navbar />
      <div className="container">
        {/* Hero */}
        <div className="about-hero">
          <img src="/logo.png" alt="Logo" className="about-hero-logo" />
          <h1 className="about-hero-title">About Our Project</h1>
          <p className="about-hero-subtitle">
            Fighting misinformation in Arabic digital media through Artificial Intelligence
          </p>
        </div>

        {/* Mission */}
        <div className="about-section animate-fadein">
          <h3>Our Mission</h3>
          <p>
            <strong>Fake News Detector</strong> is built to empower users with an instant,
            transparent, and reliable tool to verify English news authenticity. In an era of
            viral misinformation, our system helps people make informed decisions before
            trusting or sharing content — protecting public discourse, healthcare choices,
            and political awareness.
          </p>
        </div>

        {/* Team */}
        <div className="about-section animate-fadein">
          <h3>Meet the Team</h3>
          <div className="team-grid">
            {team.map((m, i) => (
              <div className="team-card" key={i} style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="team-avatar user-avatar">
                  <UserIcon size={46} />
                </div>
                <h4 className="team-name">{m.name}</h4>
              </div>
            ))}
          </div>
        </div>

        {/* Supervisor */}
        <div className="about-section supervisor-section animate-fadein">
          <h3>Supervisor</h3>
          <div className="supervisor-card">
            <div className="supervisor-avatar user-avatar">
              <UserIcon size={46} />
            </div>
            <div>
              <h4>Dr. Bader Mattar Alotaibi</h4>
              <p>Department of Computer Science</p>
              <p>College of Computer Engineering and Sciences</p>
            </div>
          </div>
        </div>

        {/* University */}
        <div className="about-section university-section animate-fadein">
          <h3>University</h3>
          <div className="university-card">
            <img src="/sattam-logo.png" alt="Prince Sattam University" className="uni-logo-img" />
            <div>
              <h4>Prince Sattam Bin Abdulaziz University</h4>
              <p>College of Computer Engineering and Sciences</p>
              <p>Department of Computer Sciences</p>
              <p className="uni-arabic">جامعة الأمير سطام بن عبد العزيز</p>
            </div>
          </div>
        </div>

        {/* Project Info */}
        <div className="about-section animate-fadein">
          <h3>Project Information</h3>
          <div className="info-grid">
            <div className="info-card">
              <h4>Degree</h4>
              <p>Bachelor of Computer Science</p>
            </div>
            <div className="info-card">
              <h4>Project Type</h4>
              <p>Graduation Project</p>
            </div>
            <div className="info-card">
              <h4>Project Code</h4>
              <p>#F14-CS</p>
            </div>
          </div>
        </div>

        {/* Goals */}
        <div className="about-section animate-fadein">
          <h3>Our Goals</h3>
          <ul className="how-list">
            <li>Provide an explainable AI that users can trust and understand.</li>
            <li>Make fake-news detection accessible to non-technical users.</li>
            <li>Support media literacy and critical thinking.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
