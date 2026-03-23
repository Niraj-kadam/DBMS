import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../style/home.css';

function Home() {
  const [doctorCount, setDoctorCount]   = useState(0);
  const [patientCount, setPatientCount] = useState(0);

  useEffect(() => {
    const animate = (target, setter) => {
      let n = 0;
      const step = Math.ceil(target / 40);
      const t = setInterval(() => {
        n += step;
        if (n >= target) { setter(target); clearInterval(t); }
        else setter(n);
      }, 30);
    };
    fetch('http://localhost:5000/api/doctors/count')
      .then(r => r.json()).then(d => animate(d.count || 12, setDoctorCount))
      .catch(() => animate(12, setDoctorCount));
    fetch('http://localhost:5000/api/patients/count')
      .then(r => r.json()).then(d => animate(d.count || 120, setPatientCount))
      .catch(() => animate(120, setPatientCount));
  }, []);

  return (
    <div className="home-root">

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
      <section className="hero">
        <div className="hero-text">
          <h1>Hospital <span className="accent">Management</span> System</h1>
          <p>
            A complete platform for managing patients, doctors,
            appointments, and billing — all in one place.
          </p>
          <div className="hero-btns">
            <Link to="/choice" className="btn-primary">Get Started</Link>
            <Link to="/about"  className="btn-outline">About Us</Link>
          </div>
        </div>
        <div className="hero-cards">
          <div className="hcard"><i className="fa-solid fa-user-doctor"></i><span>Doctors</span></div>
          <div className="hcard"><i className="fa-solid fa-bed-pulse"></i><span>Patients</span></div>
          <div className="hcard"><i className="fa-solid fa-calendar-check"></i><span>Appointments</span></div>
          <div className="hcard"><i className="fa-solid fa-file-invoice-dollar"></i><span>Billing</span></div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats">
        <div className="stat-card green">
          <i className="fa-solid fa-user-doctor"></i>
          <div className="stat-num">{doctorCount}+</div>
          <div className="stat-lbl">Total Doctors</div>
        </div>
        <div className="stat-card cyan">
          <i className="fa-solid fa-bed-pulse"></i>
          <div className="stat-num">{patientCount}+</div>
          <div className="stat-lbl">Patients Visited</div>
        </div>
      </section>

      {/* MODULES */}
      <section className="modules">
        <h2>Our Modules</h2>
        <p className="sec-sub">Everything needed to run a hospital efficiently</p>
        <div className="modules-grid">
          {[
            { icon: 'fa-bed-pulse',           title: 'Patients',     desc: 'Register and manage patient records and history.' },
            { icon: 'fa-user-doctor',         title: 'Doctors',      desc: 'Manage doctor profiles and schedules.' },
            { icon: 'fa-calendar-check',      title: 'Appointments', desc: 'Book and track patient-doctor appointments.' },
            { icon: 'fa-file-invoice-dollar', title: 'Billing',      desc: 'Generate bills and manage payments.' },
          ].map(m => (
            <div className="mod-card" key={m.title}>
              <div className="mod-icon"><i className={`fa-solid ${m.icon}`}></i></div>
              <h3>{m.title}</h3>
              <p>{m.desc}</p>
            </div>
          ))}
        </div>
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

export default Home;