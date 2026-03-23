import { Link } from 'react-router-dom';
import '../style/About.css';

function About() {
  return (
    <div className="about-root">

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-brand">
          <i className="fa-solid fa-house-medical"></i>
          Hospital Management System
        </div>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/choice" className="nav-btn">Login</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="about-hero">
        <h1>About <span className="accent">Us</span></h1>
        <p>Learn more about the Hospital Management System and what it offers.</p>
      </section>

      {/* ABOUT INFO */}
      <section className="about-info">
        <div className="info-text">
          <h2>What is this system?</h2>
          <p>
            The Hospital Management System is a web-based platform designed to simplify
            the day-to-day operations of a hospital. It allows admins, doctors, and staff
            to manage patient records, appointments, billing, and more from a single dashboard.
          </p>
          <p>
            This project was built as a DBMS course project to demonstrate how a relational
            database can power a real-world application. It uses React on the frontend and
            Node.js with a SQL database on the backend.
          </p>
        </div>
        <div className="info-stats">
          <div className="i-stat"><i className="fa-solid fa-user-doctor"></i><strong>12+</strong><span>Doctors</span></div>
          <div className="i-stat"><i className="fa-solid fa-bed-pulse"></i><strong>120+</strong><span>Patients</span></div>
          <div className="i-stat"><i className="fa-solid fa-calendar-check"></i><strong>340+</strong><span>Appointments</span></div>
          <div className="i-stat"><i className="fa-solid fa-users-gear"></i><strong>3</strong><span>User Roles</span></div>
        </div>
      </section>

      {/* WHO USES IT */}
      <section className="about-roles">
        <h2>Who Uses This System?</h2>
        <p className="sec-sub">Three roles, one unified platform</p>
        <div className="roles-grid">
          <div className="role-card r-admin">
            <i className="fa-solid fa-user-shield"></i>
            <h3>Admin</h3>
            <p>Manages the entire system — doctors, staff, patients, and billing from one dashboard.</p>
          </div>
          <div className="role-card r-doctor">
            <i className="fa-solid fa-user-doctor"></i>
            <h3>Doctor</h3>
            <p>Views appointments, manages patient details, and tracks medical records.</p>
          </div>
          <div className="role-card r-staff">
            <i className="fa-solid fa-user-nurse"></i>
            <h3>Staff</h3>
            <p>Handles patient registration, appointment scheduling, and daily operations.</p>
          </div>
        </div>
      </section>

      {/* TECH STACK */}
      <section className="about-tech">
        <h2>Tech Stack</h2>
        <p className="sec-sub">Built with modern web technologies</p>
        <div className="tech-grid">
          {[
            { icon: 'fa-brands fa-react',    label: 'React',    color: '#61dafb' },
            { icon: 'fa-brands fa-node-js',  label: 'Node.js',  color: '#6db33f' },
            { icon: 'fa-solid fa-database',  label: 'MySQL',    color: '#f59e0b' },
            { icon: 'fa-brands fa-css3-alt', label: 'CSS3',     color: '#0891b2' },
          ].map(t => (
            <div className="tech-card" key={t.label}>
              <i className={t.icon} style={{ color: t.color }}></i>
              <span>{t.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <h2>Ready to explore?</h2>
        <p>Login as Admin, Doctor, or Staff to access your dashboard.</p>
        <Link to="/choice" className="btn-primary">Login Now &rarr;</Link>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-grid">
          <div className="footer-about">
            <h4><i className="fa-solid fa-house-medical"></i> Hospital Management System</h4>
            <p>Efficient hospital data and patient management system.</p>
          </div>
          <div className="footer-col">
            <h5>Quick Links</h5>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/choice">Login</Link>
          </div>
          <div className="footer-col">
            <h5>Modules</h5>
            <span>Patients</span>
            <span>Doctors</span>
            <span>Appointments</span>
            <span>Billing</span>
          </div>
          <div className="footer-col">
            <h5>Follow Us</h5>
            <div className="socials">
              <a href="#!"><i className="fa-brands fa-facebook"></i></a>
              <a href="#!"><i className="fa-brands fa-instagram"></i></a>
              <a href="#!"><i className="fa-brands fa-twitter"></i></a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          © 2026 Hospital Management System. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default About;