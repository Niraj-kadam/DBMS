import '../style/home.css'

function Home() {

  return (
    <>
      <nav className="navbar navbar-expand-sm bg-dark navbar-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="#"><i className="fa-solid fa-house-medical"></i></a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#collapsibleNavbar">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="collapsibleNavbar">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link" href="#">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Login</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">About</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div class="container-fluid p-0">
        <div class="hero"></div>
      </div>

      <div className="cards">
        <div className="dashboard-card bg-success">
          <h3>Total Doctors</h3>
          <p className="count">12</p>
        </div>

        <div className="dashboard-card bg-info">
          <h3>Patients Visited</h3>
          <p className="count">120</p>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-container">

          <div className="footer-section">
            <h3>Hospital Management System</h3>
            <p>Efficient hospital data and patient management system.</p>
          </div>

          <div className="footer-section part1">
            <h4>Quick Links</h4>
            <ul>
              <li>Home</li>
              <li>Login</li>
              <li>About</li>
            </ul>
          </div>

          <div className="footer-section part2">
            <h4>Modules</h4>
            <ul>
              <li>Patients</li>
              <li>Doctors</li>
              <li>Appointments</li>
              <li>Billing</li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Follow Us</h4>
            <div className="social-icons">
              <span><i className="fa-brands fa-facebook"></i></span>
              <span><i className="fa-brands fa-instagram"></i></span>
              <span><i className="fa-brands fa-twitter"></i></span>
              <span><i className="fa-brands fa-x-twitter"></i></span>
            </div>
          </div>

        </div>

        <div className="footer-bottom">
          © 2026 Hospital Management System | DBMS Course Project
        </div>
      </footer>


    </>
  )

}

export default Home;