import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../style/doctorpage.css';

function DoctorPage() {
    const navigate = useNavigate();
    const [activePage, setActivePage] = useState("dashboard");

    const [doctorInfo, setDoctorInfo] = useState(null);
    const [patients, setPatients] = useState([]);
    const [appointments, setAppointments] = useState([]);

    const [patientSearch, setPatientSearch] = useState("");
    const [apptFilter, setApptFilter] = useState("All");

    const [showProfileModal, setShowProfileModal] = useState(false);
    const [profileForm, setProfileForm] = useState({
        name: "", specialization: "", dept: "", phone: "", email: "", status: ""
    });

    // ── On mount ──
    useEffect(() => {
        const stored = localStorage.getItem("doctorUser");
        if (!stored) { navigate("/doctorlog"); return; }

        const parsed = JSON.parse(stored);

        // If the stored object is a full doctor record (has name + specialization),
        // use it directly — no DB call needed.
        if (parsed.name && parsed.specialization !== undefined) {
            setDoctorInfo(parsed);
            setProfileForm({
                name: parsed.name || "",
                specialization: parsed.specialization || "",
                dept: parsed.dept || "",
                phone: parsed.phone || "",
                email: parsed.email || "",
                status: parsed.status || ""
            });
        } else {
            // Fallback: old login stored only {id, email}. Match by email in doctors table.
            const email = parsed.email;
            if (!email) { navigate("/doctorlog"); return; }

            axios.get("http://localhost:5000/doctors")
                .then(res => {
                    const me = res.data.find(d =>
                        d.email?.trim().toLowerCase() === email.trim().toLowerCase()
                    );
                    if (me) {
                        setDoctorInfo(me);
                        setProfileForm({
                            name: me.name || "",
                            specialization: me.specialization || "",
                            dept: me.dept || "",
                            phone: me.phone || "",
                            email: me.email || "",
                            status: me.status || ""
                        });
                        // Save full record so future loads are instant
                        localStorage.setItem("doctorUser", JSON.stringify(me));
                    } else {
                        alert("Doctor profile not found. Please contact admin.");
                        navigate("/doctorlog");
                    }
                })
                .catch(() => navigate("/doctorlog"));
        }

        fetchPatients();
        fetchAppointments();
    }, []);

    const fetchPatients = () => {
        axios.get("http://localhost:5000/patients")
            .then(res => setPatients(res.data))
            .catch(err => console.log(err));
    };

    const fetchAppointments = () => {
        axios.get("http://localhost:5000/appointments")
            .then(res => setAppointments(res.data))
            .catch(err => console.log(err));
    };

    const updateAppointmentStatus = (id, status) => {
        axios.put(`http://localhost:5000/update-appointment-status/${id}`, { status })
            .then(() => fetchAppointments())
            .catch(err => console.log(err));
    };

    const openEditProfile = () => {
        if (!doctorInfo) return;
        setProfileForm({
            name: doctorInfo.name || "",
            specialization: doctorInfo.specialization || "",
            dept: doctorInfo.dept || "",
            phone: doctorInfo.phone || "",
            email: doctorInfo.email || "",
            status: doctorInfo.status || ""
        });
        setShowProfileModal(true);
    };

    const saveProfile = () => {
        if (!doctorInfo) return;
        axios.put(`http://localhost:5000/update-doctor/${doctorInfo.id}`, profileForm)
            .then(() => {
                const updated = { ...doctorInfo, ...profileForm };
                setDoctorInfo(updated);
                localStorage.setItem("doctorUser", JSON.stringify(updated));
                setShowProfileModal(false);
                alert("Profile updated successfully!");
            })
            .catch(err => {
                console.log(err);
                alert("Failed to update profile.");
            });
    };

    const handleLogout = () => {
        localStorage.removeItem("doctorUser");
        navigate("/doctorlog");
    };

    // ── Derived data ──
    const _today = new Date();
    const todayStr = `${_today.getFullYear()}-${String(_today.getMonth() + 1).padStart(2, '0')}-${String(_today.getDate()).padStart(2, '0')}`;

    const myAppointments = doctorInfo
        ? appointments.filter(a =>
            a.doctor?.trim().toLowerCase() === doctorInfo.name?.trim().toLowerCase()
          )
        : [];

    const todayAppointments = myAppointments.filter(a => a.date?.slice(0, 10) === todayStr);
    const pendingAppointments = myAppointments.filter(a => a.status === "Pending");
    const acceptedAppointments = myAppointments.filter(a => a.status === "Accepted");

    const filteredAppointments = apptFilter === "All"
        ? myAppointments
        : myAppointments.filter(a => a.status === apptFilter);

    const admittedPatients = patients.filter(p => p.status === "Admitted");
    const dischargedPatients = patients.filter(p => p.status === "Discharged");

    const filteredPatients = patients.filter(p =>
        p.name?.toLowerCase().includes(patientSearch.toLowerCase()) ||
        p.disease?.toLowerCase().includes(patientSearch.toLowerCase()) ||
        p.doctor?.toLowerCase().includes(patientSearch.toLowerCase()) ||
        String(p.id).includes(patientSearch)
    );

    return (
        <>
            <div className="container-fluid doctor-dashboard">
                <div className="row min-vh-100">

                    {/* ── Sidebar ── */}
                    <div className="col-2 col-sm-3 col-xl-2 bg-dark p-0">
                        <nav className="navbar bg-dark border-bottom border-white" data-bs-theme="dark">
                            <a className="navbar-brand ms-3 doctor-panel" href="#">Doctor Portal</a>
                        </nav>
                        <nav className="nav flex-column border-bottom border-white px-3">
                            <h6 className="text-light mt-3">Main Menu</h6>
                            <a className="nav-link text-white" style={{ cursor: "pointer" }} onClick={() => setActivePage("dashboard")}>📊 Dashboard</a>
                            <a className="nav-link text-white" style={{ cursor: "pointer" }} onClick={() => setActivePage("patients")}>🧑‍🦽 All Patients</a>
                            <a className="nav-link text-white" style={{ cursor: "pointer" }} onClick={() => setActivePage("appointments")}>📅 My Appointments</a>
                            <a className="nav-link text-white" style={{ cursor: "pointer" }} onClick={() => setActivePage("profile")}>👨‍⚕️ My Profile</a>
                        </nav>
                        <div className="p-3">
                            <button className="btn text-light doctor-out w-100" onClick={handleLogout}>
                                {doctorInfo?.name || "Doctor"} <br />
                                <span className="logout text-danger">Logout →</span>
                            </button>
                        </div>
                    </div>

                    {/* ── Main Content ── */}
                    <div className="col-10 col-sm-9 col-xl-10 p-0">

                        {/* Top Navbar */}
                        <nav className="navbar navbar-expand-lg doctor-nav px-4 py-3">
                            <div className="container-fluid">
                                <div>
                                    <h3 className="m-0">
                                        {activePage === "dashboard" && "Dashboard"}
                                        {activePage === "patients" && "All Patients"}
                                        {activePage === "appointments" && "My Appointments"}
                                        {activePage === "profile" && "My Profile"}
                                    </h3>
                                    <small>Welcome, Dr. {doctorInfo?.name || "—"}!</small>
                                </div>
                            </div>
                        </nav>

                        {/* ══════════════════════════════════════
                            DASHBOARD
                        ══════════════════════════════════════ */}
                        {activePage === "dashboard" && (
                            <div className="container-fluid px-4 mt-4">
                                <div className="row g-4 mb-4">
                                    <div className="col-md-3">
                                        <div className="doctor-dash-card doctor-dash-card--blue">
                                            <div className="doctor-dash-card__icon">🧑‍🦽</div>
                                            <div className="doctor-dash-card__info">
                                                <span className="doctor-dash-card__label">Total Patients</span>
                                                <span className="doctor-dash-card__value">{patients.length}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="doctor-dash-card doctor-dash-card--green">
                                            <div className="doctor-dash-card__icon">🏥</div>
                                            <div className="doctor-dash-card__info">
                                                <span className="doctor-dash-card__label">Currently Admitted</span>
                                                <span className="doctor-dash-card__value">{admittedPatients.length}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="doctor-dash-card doctor-dash-card--orange">
                                            <div className="doctor-dash-card__icon">📅</div>
                                            <div className="doctor-dash-card__info">
                                                <span className="doctor-dash-card__label">Today's Appointments</span>
                                                <span className="doctor-dash-card__value">{todayAppointments.length}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="doctor-dash-card doctor-dash-card--purple">
                                            <div className="doctor-dash-card__icon">⏳</div>
                                            <div className="doctor-dash-card__info">
                                                <span className="doctor-dash-card__label">Pending Requests</span>
                                                <span className="doctor-dash-card__value">{pendingAppointments.length}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row g-4">
                                    <div className="col-md-4">
                                        <div className="doctor-info-card">
                                            <h5 className="doctor-info-title">👨‍⚕️ My Info</h5>
                                            <div className="doctor-info-row"><span>Name</span><strong>Dr. {doctorInfo?.name || "—"}</strong></div>
                                            <div className="doctor-info-row"><span>Specialization</span><strong>{doctorInfo?.specialization || "—"}</strong></div>
                                            <div className="doctor-info-row"><span>Department</span><strong>{doctorInfo?.dept || "—"}</strong></div>
                                            <div className="doctor-info-row"><span>Phone</span><strong>{doctorInfo?.phone || "—"}</strong></div>
                                            <div className="doctor-info-row">
                                                <span>Status</span>
                                                <span className={`status ${doctorInfo?.status === "Active" ? "active" : "inactive"}`}>
                                                    {doctorInfo?.status || "—"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-8">
                                        <div className="doctor-info-card">
                                            <h5 className="doctor-info-title">📅 Today's Appointments</h5>
                                            <table className="doctor-table">
                                                <thead>
                                                    <tr><th>Patient</th><th>Time</th><th>Status</th><th>Action</th></tr>
                                                </thead>
                                                <tbody>
                                                    {todayAppointments.length === 0 ? (
                                                        <tr><td colSpan="4" className="no-data">No appointments scheduled for today.</td></tr>
                                                    ) : (
                                                        todayAppointments.map(a => (
                                                            <tr key={a.id}>
                                                                <td><strong>{a.patient}</strong></td>
                                                                <td>{a.time}</td>
                                                                <td>
                                                                    <span className={`status ${a.status === "Accepted" ? "active" : a.status === "Rejected" ? "inactive" : "leave"}`}>
                                                                        {a.status}
                                                                    </span>
                                                                </td>
                                                                <td>
                                                                    {a.status === "Pending" && (
                                                                        <div className="action-btns">
                                                                            <button className="accept-btn" onClick={() => updateAppointmentStatus(a.id, "Accepted")}>✓ Accept</button>
                                                                            <button className="delete-btn" onClick={() => updateAppointmentStatus(a.id, "Rejected")}>✗ Reject</button>
                                                                        </div>
                                                                    )}
                                                                    {a.status === "Accepted" && (
                                                                        <button className="revert-btn" onClick={() => updateAppointmentStatus(a.id, "Pending")}>↩ Reset</button>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        ))
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                <div className="row g-4 mt-1">
                                    <div className="col-12">
                                        <div className="doctor-info-card">
                                            <h5 className="doctor-info-title">🏥 Hospital Patient Overview</h5>
                                            <div className="row g-3">
                                                <div className="col-md-4">
                                                    <div style={{ background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.25)", borderRadius: "10px", padding: "16px" }}>
                                                        <div style={{ color: "#94a3b8", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Total Patients</div>
                                                        <div style={{ color: "#e6edf3", fontSize: "1.8rem", fontWeight: 800 }}>{patients.length}</div>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: "10px", padding: "16px" }}>
                                                        <div style={{ color: "#94a3b8", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Admitted</div>
                                                        <div style={{ color: "#22c55e", fontSize: "1.8rem", fontWeight: 800 }}>{admittedPatients.length}</div>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div style={{ background: "rgba(248,81,73,0.1)", border: "1px solid rgba(248,81,73,0.25)", borderRadius: "10px", padding: "16px" }}>
                                                        <div style={{ color: "#94a3b8", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Discharged</div>
                                                        <div style={{ color: "#f85149", fontSize: "1.8rem", fontWeight: 800 }}>{dischargedPatients.length}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ══════════════════════════════════════
                            ALL PATIENTS
                        ══════════════════════════════════════ */}
                        {activePage === "patients" && (
                            <div className="doctor-container">
                                <div className="doctor-header">
                                    <h4>🧑‍🦽 All Patients</h4>
                                    <div className="doctor-actions">
                                        <input
                                            className="doctor-search"
                                            placeholder="Search by name, disease, doctor or ID..."
                                            value={patientSearch}
                                            onChange={e => setPatientSearch(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: "flex", gap: "12px", marginBottom: "14px", flexWrap: "wrap" }}>
                                    {[
                                        { label: "Total", count: patients.length, color: "#38bdf8" },
                                        { label: "Admitted", count: admittedPatients.length, color: "#22c55e" },
                                        { label: "Discharged", count: dischargedPatients.length, color: "#f85149" },
                                    ].map(s => (
                                        <div key={s.label} style={{
                                            background: "rgba(255,255,255,0.05)",
                                            border: `1px solid ${s.color}33`,
                                            borderRadius: "8px",
                                            padding: "8px 16px",
                                            display: "flex", gap: "8px", alignItems: "center"
                                        }}>
                                            <span style={{ color: s.color, fontWeight: 700, fontSize: "1.1rem" }}>{s.count}</span>
                                            <span style={{ color: "#94a3b8", fontSize: "0.78rem" }}>{s.label}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="doctor-table-wrap">
                                    <table className="doctor-table">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Name</th>
                                                <th>Age</th>
                                                <th>Disease</th>
                                                <th>Assigned Doctor</th>
                                                <th>Admission Date</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredPatients.length === 0 ? (
                                                <tr>
                                                    <td colSpan="7" className="no-data">
                                                        {patientSearch ? "No patients match your search." : "No patients found."}
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredPatients.map(p => (
                                                    <tr key={p.id}>
                                                        <td>{p.id}</td>
                                                        <td><strong>{p.name}</strong></td>
                                                        <td>{p.age}</td>
                                                        <td>{p.disease}</td>
                                                        <td>
                                                            {p.doctor
                                                                ? <span style={{ color: p.doctor?.toLowerCase() === doctorInfo?.name?.toLowerCase() ? "#38bdf8" : "#e2e8f0" }}>{p.doctor}</span>
                                                                : <span style={{ color: "#64748b" }}>Unassigned</span>
                                                            }
                                                        </td>
                                                        <td>{p.admission?.slice(0, 10)}</td>
                                                        <td>
                                                            <span className={`status ${p.status === "Admitted" ? "active" : p.status === "Discharged" ? "inactive" : "leave"}`}>
                                                                {p.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* ══════════════════════════════════════
                            MY APPOINTMENTS
                        ══════════════════════════════════════ */}
                        {activePage === "appointments" && (
                            <div className="doctor-container">
                                <div className="doctor-header">
                                    <h4>📅 My Appointments</h4>
                                    <div className="doctor-actions">
                                        {["All", "Pending", "Accepted", "Rejected"].map(f => (
                                            <button key={f} onClick={() => setApptFilter(f)} style={{
                                                background: apptFilter === f ? "#38bdf8" : "rgba(255,255,255,0.07)",
                                                color: apptFilter === f ? "#0f172a" : "#94a3b8",
                                                border: "1px solid rgba(255,255,255,0.12)",
                                                borderRadius: "7px", padding: "6px 14px",
                                                fontSize: "0.8rem", fontWeight: 600,
                                                cursor: "pointer", transition: "all 0.2s"
                                            }}>{f}</button>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ display: "flex", gap: "12px", marginBottom: "14px", flexWrap: "wrap" }}>
                                    {[
                                        { label: "Total", count: myAppointments.length, color: "#38bdf8" },
                                        { label: "Pending", count: pendingAppointments.length, color: "#facc15" },
                                        { label: "Accepted", count: acceptedAppointments.length, color: "#22c55e" },
                                        { label: "Today", count: todayAppointments.length, color: "#a78bfa" }
                                    ].map(s => (
                                        <div key={s.label} style={{
                                            background: "rgba(255,255,255,0.05)",
                                            border: `1px solid ${s.color}33`,
                                            borderRadius: "8px", padding: "8px 16px",
                                            display: "flex", gap: "8px", alignItems: "center"
                                        }}>
                                            <span style={{ color: s.color, fontWeight: 700, fontSize: "1.1rem" }}>{s.count}</span>
                                            <span style={{ color: "#94a3b8", fontSize: "0.78rem" }}>{s.label}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="doctor-table-wrap">
                                    <table className="doctor-table">
                                        <thead>
                                            <tr>
                                                <th>ID</th><th>Patient</th><th>Date</th><th>Time</th><th>Status</th><th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredAppointments.length === 0 ? (
                                                <tr>
                                                    <td colSpan="6" className="no-data">
                                                        {myAppointments.length === 0
                                                            ? `No appointments found for Dr. ${doctorInfo?.name || ""}. Admin must add appointments using your exact name.`
                                                            : `No ${apptFilter.toLowerCase()} appointments.`}
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredAppointments.map(a => (
                                                    <tr key={a.id}>
                                                        <td>{a.id}</td>
                                                        <td><strong>{a.patient}</strong></td>
                                                        <td>{a.date?.slice(0, 10)}</td>
                                                        <td>{a.time}</td>
                                                        <td>
                                                            <span className={`status ${a.status === "Accepted" ? "active" : a.status === "Rejected" ? "inactive" : "leave"}`}>
                                                                {a.status}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            {a.status === "Pending" && (
                                                                <div className="action-btns">
                                                                    <button className="accept-btn" onClick={() => updateAppointmentStatus(a.id, "Accepted")}>✓ Accept</button>
                                                                    <button className="delete-btn" onClick={() => updateAppointmentStatus(a.id, "Rejected")}>✗ Reject</button>
                                                                </div>
                                                            )}
                                                            {a.status === "Accepted" && (
                                                                <button className="revert-btn" onClick={() => updateAppointmentStatus(a.id, "Pending")}>↩ Reset</button>
                                                            )}
                                                            {a.status === "Rejected" && (
                                                                <button className="revert-btn" onClick={() => updateAppointmentStatus(a.id, "Pending")}>↩ Reopen</button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* ══════════════════════════════════════
                            MY PROFILE
                        ══════════════════════════════════════ */}
                        {activePage === "profile" && (
                            <div className="container-fluid px-4 mt-4">
                                <div className="row g-4">
                                    <div className="col-md-5">
                                        <div className="doctor-info-card">
                                            <h5 className="doctor-info-title">👨‍⚕️ My Profile</h5>
                                            <div className="doctor-info-row"><span>Doctor ID</span><strong>{doctorInfo?.id || "—"}</strong></div>
                                            <div className="doctor-info-row"><span>Name</span><strong>Dr. {doctorInfo?.name || "—"}</strong></div>
                                            <div className="doctor-info-row"><span>Specialization</span><strong>{doctorInfo?.specialization || "—"}</strong></div>
                                            <div className="doctor-info-row"><span>Department</span><strong>{doctorInfo?.dept || "—"}</strong></div>
                                            <div className="doctor-info-row"><span>Phone</span><strong>{doctorInfo?.phone || "—"}</strong></div>
                                            <div className="doctor-info-row"><span>Email</span><strong>{doctorInfo?.email || "—"}</strong></div>
                                            <div className="doctor-info-row">
                                                <span>Status</span>
                                                <span className={`status ${doctorInfo?.status === "Active" ? "active" : "inactive"}`}>
                                                    {doctorInfo?.status || "—"}
                                                </span>
                                            </div>
                                            <button className="add-btn mt-3" onClick={openEditProfile}>✏️ Edit Profile</button>
                                        </div>
                                    </div>
                                    <div className="col-md-7">
                                        <div className="doctor-info-card">
                                            <h5 className="doctor-info-title">📊 My Summary</h5>
                                            <div className="doctor-info-row"><span>Total Patients in Hospital</span><strong>{patients.length}</strong></div>
                                            <div className="doctor-info-row"><span>Currently Admitted</span><strong>{admittedPatients.length}</strong></div>
                                            <div className="doctor-info-row"><span>My Total Appointments</span><strong>{myAppointments.length}</strong></div>
                                            <div className="doctor-info-row"><span>Today's Appointments</span><strong>{todayAppointments.length}</strong></div>
                                            <div className="doctor-info-row"><span>Pending Requests</span><strong>{pendingAppointments.length}</strong></div>
                                            <div className="doctor-info-row"><span>Accepted Appointments</span><strong>{acceptedAppointments.length}</strong></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>

            {/* ── PROFILE EDIT MODAL ── */}
            {showProfileModal && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <div className="modal-header">
                            <h4>✏️ Edit Profile</h4>
                            <button onClick={() => setShowProfileModal(false)}>✖</button>
                        </div>
                        <div className="modal-body" style={{ display: "flex", flexDirection: "column" }}>
                            <div className="form-group full-width">
                                <label>Name</label>
                                <input value={profileForm.name} onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))} />
                            </div>
                            <div className="form-group full-width">
                                <label>Specialization</label>
                                <input value={profileForm.specialization} onChange={e => setProfileForm(p => ({ ...p, specialization: e.target.value }))} />
                            </div>
                            <div className="form-group full-width">
                                <label>Department</label>
                                <select value={profileForm.dept} onChange={e => setProfileForm(p => ({ ...p, dept: e.target.value }))}>
                                    <option value="Cardiology">Cardiology</option>
                                    <option value="Neurology">Neurology</option>
                                    <option value="Orthopedics">Orthopedics</option>
                                    <option value="Pediatrics">Pediatrics</option>
                                    <option value="Dermatology">Dermatology</option>
                                    <option value="Oncology">Oncology</option>
                                    <option value="Radiology">Radiology</option>
                                    <option value="General">General</option>
                                </select>
                            </div>
                            <div className="form-group full-width">
                                <label>Phone</label>
                                <input value={profileForm.phone} onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))} />
                            </div>
                            <div className="form-group full-width">
                                <label>Email</label>
                                <input value={profileForm.email} onChange={e => setProfileForm(p => ({ ...p, email: e.target.value }))} />
                            </div>
                            <div className="form-group full-width">
                                <label>Status</label>
                                <select value={profileForm.status} onChange={e => setProfileForm(p => ({ ...p, status: e.target.value }))}>
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="cancel-btn" onClick={() => setShowProfileModal(false)}>Cancel</button>
                            <button className="save-btn" onClick={saveProfile}>Update</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default DoctorPage;