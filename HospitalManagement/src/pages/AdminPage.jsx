import { useState } from "react";
import '../style/adminpage.css'
import { useEffect } from "react";
import axios from "axios";

function AdminPage() {
    const [activePage, setActivePage] = useState("dashboard");

    const [doctors, setDoctors] = useState([]);
    const [search, setSearch] = useState("");

    // ✅ FIX: define missing states
    const [patients] = useState([]);
    const [staff] = useState([]);
    const [appointments] = useState([]);

    // 🔹 FETCH DOCTORS
    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = () => {
        axios
            .get("http://localhost:5000/doctors")
            .then((res) => setDoctors(res.data))
            .catch((err) => console.log(err));
    };

    // 🔹 ADD DOCTOR
    const addDoctor = () => {
        const newDoctor = {
            id: prompt("Enter ID"),
            name: prompt("Enter Name"),
            specialization: prompt("Enter Specialization"),
            dept: prompt("Enter Department"),
            phone: prompt("Enter Phone"),
            email: prompt("Enter Email"),
            status: prompt("Enter Status (Active/Leave)"),
        };

        if (!newDoctor.name) return; // prevent empty

        axios
            .post("http://localhost:5000/add-doctor", newDoctor)
            .then(() => fetchDoctors())
            .catch((err) => console.log(err));
    };

    // 🔹 DELETE DOCTOR
    const deleteDoctor = (id) => {
        axios
            .delete(`http://localhost:5000/delete-doctor/${id}`)
            .then(() => fetchDoctors())
            .catch((err) => console.log(err));
    };

    // 🔹 SEARCH FILTER
    const filteredDoctors = doctors.filter((doc) =>
        doc.name?.toLowerCase().includes(search.toLowerCase())
    );
    return (
        <>
            <div className="container-fluid admin-dashboard">
                <div className="row min-vh-100">

                    {/* Sidebar */}
                    <div className="col-2 col-sm-3 col-xl-2 bg-dark p-0">

                        <nav className="navbar bg-dark border-bottom border-white" data-bs-theme="dark">
                            <a className="navbar-brand ms-3 admin-panel" href="#">Admin Panel</a>
                        </nav>

                        <nav className="nav flex-column border-bottom border-white px-3">
                            <h6 className="text-light mt-3">Main Menu</h6>
                            <a className="nav-link text-white" onClick={() => setActivePage("dashboard")}>📊 Dashboard</a>
                            <a className="nav-link text-white" onClick={() => setActivePage("doctor")}>🧑‍⚕️ Doctor</a>
                            <a className="nav-link text-white" onClick={() => setActivePage("patient")}>🧑‍🦽 Patient</a>
                            <a className="nav-link text-white" onClick={() => setActivePage("staff")}>👨‍💼 Staff</a>
                            <a className="nav-link text-white" onClick={() => setActivePage("appointment")}>📅 Appointments</a>
                            <a className="nav-link text-white" onClick={() => setActivePage("department")}>🏢 Departments</a>
                            <a className="nav-link text-white" href="#">💳 Billing</a>
                            <a className="nav-link text-white" href="#">📈 Reports</a>
                            <a className="nav-link text-white" href="#">⚙️ Settings</a>
                        </nav>

                        <div className="p-3">
                            <button className="btn text-light admin-out w-100">
                                Admin <br />
                                <span className='logout text-danger'>Logout →</span>
                            </button>
                        </div>

                    </div>


                    {/* Main Content */}
                    <div className="col-10 col-sm-9 col-xl-10 p-0">

                        {/* Top Navbar */}
                        <nav className="navbar navbar-expand-lg admin-nav px-4 py-3">
                            <div className="container-fluid">

                                <div>
                                    <h3 className="m-0">Dashboard</h3>
                                    <small>Welcome back, Admin!</small>
                                </div>

                                <ul className="navbar-nav ms-auto">
                                    <li className="nav-item">
                                        <a href="#" className="nav-link text-white">Home</a>
                                    </li>
                                </ul>

                            </div>
                        </nav>

                        {activePage === "dashboard" && (
                            <div className="container-fluid px-4 mt-4">
                                <div className="row g-4">

                                    {/* Doctors */}
                                    <div className="col-md-3">
                                        <div className="card text-center shadow-sm p-3">
                                            <h5>Total Doctors</h5>
                                            <h2>{doctors.length}</h2>
                                        </div>
                                    </div>

                                    {/* Patients */}
                                    <div className="col-md-3">
                                        <div className="card text-center shadow-sm p-3">
                                            <h5>Total Patients</h5>
                                            <h2>{patients.length}</h2>
                                        </div>
                                    </div>

                                    {/* Staff */}
                                    <div className="col-md-3">
                                        <div className="card text-center shadow-sm p-3">
                                            <h5>Total Staff</h5>
                                            <h2>{staff.length}</h2>
                                        </div>
                                    </div>

                                    {/* Appointments */}
                                    <div className="col-md-3">
                                        <div className="card text-center shadow-sm p-3">
                                            <h5>Total Appointments</h5>
                                            <h2>{appointments.length}</h2>
                                        </div>
                                    </div>

                                </div>
                            </div>


                        )}

                        {/* DOCTOR PAGE */}
                        {activePage === "doctor" && (
                            <div className="doctor-container">

                                {/* Header */}
                                <div className="doctor-header">
                                    <h4>👨‍⚕️ Manage Doctors</h4>

                                    <div className="doctor-actions">
                                        <input
                                            type="text"
                                            placeholder="Search..."
                                            className="doctor-search"
                                        />
                                        <button className="add-btn" onClick={addDoctor}>+ Add</button>
                                    </div>
                                </div>

                                {/* Table */}
                                <div className="doctor-table">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>NAME</th>
                                                <th>SPECIALIZATION</th>
                                                <th>DEPARTMENT</th>
                                                <th>PHONE</th>
                                                <th>STATUS</th>
                                                <th>ACTION</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {doctors.map((doc) => (
                                                <tr key={doc.id}>
                                                    <td>{doc.id}</td>
                                                    <td>{doc.name}</td>
                                                    <td>{doc.specialization}</td>
                                                    <td>{doc.dept}</td>
                                                    <td>{doc.phone}</td>
                                                    <td>
                                                        <span className={doc.status === "Active" ? "status active" : "status leave"}>
                                                            {doc.status}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <button
                                                            className="delete-btn"
                                                            onClick={() => deleteDoctor(doc.id)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                            </div>
                        )}

                    </div>

                </div>
            </div>
        </>
    )
}

export default AdminPage;