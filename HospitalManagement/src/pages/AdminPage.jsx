import { useState, useEffect } from "react";
import '../style/adminpage.css';
import axios from "axios";

// ✅ KEY FIX: defaultForm is OUTSIDE the component so it's always the same object
const defaultForm = {
    id: "",
    name: "",
    specialization: "",
    dept: "Cardiology",
    phone: "",
    email: "",
    status: "Active"
};

const defaultPatientForm = {
    id: "",
    name: "",
    age: "",
    disease: "",
    doctor: "",
    admission: "",
    status: "Admitted"
};

const defaultStaffForm = {
    id: "",
    name: "",
    role: "Nurse",
    phone: "",
    shift: "Morning",
    status: "Active"
};


function AdminPage() {
    const [activePage, setActivePage] = useState("dashboard");

    // DOCTOR STATES
    const [doctors, setDoctors] = useState([]);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState(defaultForm);


    // PATIENT STATES
    const [patients, setPatients] = useState([]);
    const [showPatientModal, setShowPatientModal] = useState(false);
    const [isPatientEditing, setIsPatientEditing] = useState(false);
    const [editingPatientId, setEditingPatientId] = useState(null);
    const [patientForm, setPatientForm] = useState(defaultPatientForm);

    // STAFF STATES
    const [staff, setStaff] = useState([]);
    const [showStaffModal, setShowStaffModal] = useState(false);
    const [isStaffEditing, setIsStaffEditing] = useState(false);
    const [editingStaffId, setEditingStaffId] = useState(null);
    const [staffForm, setStaffForm] = useState(defaultStaffForm);

    const [appointments] = useState([]);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // useeffect to fetch
    useEffect(() => {
        fetchDoctors();
        fetchPatients();   // ✅ ADD THIS
        fetchStaff();
    }, []);

    const fetchDoctors = () => {
        axios.get("http://localhost:5000/doctors")
            .then((res) => setDoctors(res.data))
            .catch((err) => console.log(err));
    };

    // OPEN ADD MODAL
    const addDoctor = () => {
        setFormData({ ...defaultForm });
        setIsEditing(false);
        setShowModal(true);
    };

    // OPEN EDIT MODAL — load doctor data directly into formData
    const editDoctor = (doc) => {
        setEditingId(doc.id); // ✅ store ID separately so it's never lost
        setFormData({
            id: doc.id,
            name: doc.name,
            specialization: doc.specialization,
            dept: doc.dept,
            phone: doc.phone,
            email: doc.email,
            status: doc.status
        });
        setIsEditing(true);
        setShowModal(true);
    };

    const saveDoctor = () => {
        if (isEditing) {
            console.log("Sending PUT to update-doctor, editingId =", editingId);
            axios.put(`http://localhost:5000/update-doctor/${editingId}`, {
                name: formData.name,
                specialization: formData.specialization,
                dept: formData.dept,
                phone: formData.phone,
                email: formData.email,
                status: formData.status
            })
                .then((res) => {
                    console.log("Updated:", res.data);
                    fetchDoctors();
                    setShowModal(false);
                    setIsEditing(false);
                    setEditingId(null);
                    setFormData({ ...defaultForm });
                })
                .catch((err) => {
                    console.log("Update error:", err);
                    alert("Update failed. Check console.");
                });
        } else {
            axios.post("http://localhost:5000/add-doctor", formData)
                .then((res) => {
                    console.log("Added:", res.data);
                    fetchDoctors();
                    setShowModal(false);
                    setFormData({ ...defaultForm });
                })
                .catch((err) => {
                    console.log("Add error:", err);
                    alert("Add failed. Check console.");
                });
        }
    };

    // DELETE DOCTOR
    const deleteDoctor = (id) => {
        if (!window.confirm("Are you sure you want to delete this doctor?")) return;
        axios.delete(`http://localhost:5000/delete-doctor/${id}`)
            .then(() => fetchDoctors())
            .catch((err) => console.log(err));
    };

    // SEARCH FILTER
    const filteredDoctors = doctors.filter((doc) =>
        doc.name?.toLowerCase().includes(search.toLowerCase())
    );

    // ── PATIENT FUNCTIONS ──

    const fetchPatients = () => {
        axios.get("http://localhost:5000/patients")
            .then((res) => setPatients(res.data))
            .catch((err) => console.log(err));
    };

    // HANDLE INPUT
    const handlePatientChange = (e) => {
        setPatientForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    // OPEN ADD
    const addPatient = () => {
        setPatientForm({ ...defaultPatientForm });
        setIsPatientEditing(false);
        setShowPatientModal(true);
    };

    // OPEN EDIT
    const editPatient = (p) => {
        setEditingPatientId(p.id);
        setPatientForm({
            ...p,
            admission: p.admission?.slice(0, 10) // Ensure date is in YYYY-MM-DD format for input
        });
        setIsPatientEditing(true);
        setShowPatientModal(true);
    };

    // SAVE (ADD + UPDATE)
    const savePatient = () => {
        if (!patientForm.id || !patientForm.name) {
            alert("ID and Name are required!");
            return;
        }

        // ✅ FIX: Don't force 'id' to a Number if your DB is now VARCHAR.
        // Also, ensure age is handled safely.
        const payload = {
            ...patientForm,
            id: String(patientForm.id), // Ensure it's a string for VARCHAR
            age: patientForm.age ? Number(patientForm.age) : 0
        };

        if (isPatientEditing) {
            axios.put(`http://localhost:5000/update-patient/${editingPatientId}`, payload)
                .then(() => {
                    fetchPatients();
                    setShowPatientModal(false);
                    setIsPatientEditing(false);
                })
                .catch((err) => console.log("Update Error:", err));
        } else {
            axios.post("http://localhost:5000/add-patient", payload)
                .then(() => {
                    fetchPatients();
                    setShowPatientModal(false);
                })
                .catch((err) => {
                    console.log("Add Error Details:", err.response?.data); // Improved logging
                    alert("Failed to add patient. Check console.");
                });
        }
    };

    // DELETE
    const deletePatient = (id) => {
        if (!window.confirm("Delete this patient?")) return;

        axios.delete(`http://localhost:5000/delete-patient/${id}`)
            .then(() => fetchPatients())
            .catch((err) => console.log(err));
    };

    // ----STAFF FUNCTIONS-------
    const fetchStaff = () => {
        axios.get("http://localhost:5000/staff")
            .then(res => setStaff(res.data))
            .catch(err => console.log(err));
    };

    const handleStaffChange = (e) => {
        setStaffForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    // OPEN ADD
    const addStaff = () => {
        setStaffForm({ ...defaultStaffForm });
        setIsStaffEditing(false);
        setShowStaffModal(true);
    };

    // OPEN EDIT
    const editStaff = (s) => {
        setEditingStaffId(s.id);
        setStaffForm({ ...s });
        setIsStaffEditing(true);
        setShowStaffModal(true);
    };

    // SAVE
    const saveStaff = () => {
        if (!staffForm.id || !staffForm.name) {
            alert("ID and Name required");
            return;
        }

        const payload = {
            ...staffForm,
            id: String(staffForm.id)
        };

        if (isStaffEditing) {
            axios.put(`http://localhost:5000/update-staff/${editingStaffId}`, payload)
                .then(() => {
                    fetchStaff();
                    setShowStaffModal(false);
                    setIsStaffEditing(false);
                })
                .catch(err => console.log(err));
        } else {
            axios.post("http://localhost:5000/add-staff", payload)
                .then(() => {
                    fetchStaff();
                    setShowStaffModal(false);
                })
                .catch(err => console.log(err));
        }
    };

    // DELETE
    const deleteStaff = (id) => {
        if (!window.confirm("Delete this staff?")) return;

        axios.delete(`http://localhost:5000/delete-staff/${id}`)
            .then(() => fetchStaff())
            .catch(err => console.log(err));
    };

    return (
        <>
            <div className="container-fluid admin-dashboard">
                <div className="row min-vh-100">

                    {/* ── Sidebar ── */}
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
                                <span className="logout text-danger">Logout →</span>
                            </button>
                        </div>
                    </div>

                    {/* ── Main Content ── */}
                    <div className="col-10 col-sm-9 col-xl-10 p-0">

                        {/* Top Navbar */}
                        <nav className="navbar navbar-expand-lg admin-nav px-4 py-3">
                            <div className="container-fluid">
                                <div>
                                    <h3 className="m-0">
                                        {activePage === "dashboard" && "Dashboard"}
                                        {activePage === "doctor" && "Manage Doctors"}
                                    </h3>
                                    <small>Welcome back, Admin!</small>
                                </div>
                                <ul className="navbar-nav ms-auto">
                                    <li className="nav-item">
                                        <a href="#" className="nav-link text-white">Home</a>
                                    </li>
                                </ul>
                            </div>
                        </nav>

                        {/* ── DASHBOARD ── */}
                        {activePage === "dashboard" && (
                            <div className="container-fluid px-4 mt-4">
                                <div className="row g-4">
                                    <div className="col-md-3">
                                        <div className="card text-center shadow-sm p-3">
                                            <h5>Total Doctors</h5>
                                            <h2>{doctors.length}</h2>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="card text-center shadow-sm p-3">
                                            <h5>Total Patients</h5>
                                            <h2>{patients.length}</h2>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="card text-center shadow-sm p-3">
                                            <h5>Total Staff</h5>
                                            <h2>{staff.length}</h2>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="card text-center shadow-sm p-3">
                                            <h5>Total Appointments</h5>
                                            <h2>{appointments.length}</h2>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── DOCTOR PAGE ── */}
                        {activePage === "doctor" && (
                            <div className="doctor-container">

                                <div className="doctor-header">
                                    <h4>👨‍⚕️ Manage Doctors</h4>
                                    <div className="doctor-actions">
                                        <input
                                            type="text"
                                            placeholder="Search by name..."
                                            className="doctor-search"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                        />
                                        <button className="add-btn" onClick={addDoctor}>+ Add</button>
                                    </div>
                                </div>

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
                                            {filteredDoctors.length === 0 ? (
                                                <tr>
                                                    <td colSpan="7" className="no-data">No doctors found.</td>
                                                </tr>
                                            ) : (
                                                filteredDoctors.map((doc) => (
                                                    <tr key={doc.id}>
                                                        <td>{doc.id}</td>
                                                        <td>{doc.name}</td>
                                                        <td>{doc.specialization}</td>
                                                        <td>{doc.dept}</td>
                                                        <td>{doc.phone}</td>
                                                        <td>
                                                            <span className={
                                                                doc.status === "Active" ? "status active" :
                                                                    doc.status === "On Leave" ? "status leave" :
                                                                        "status inactive"
                                                            }>
                                                                {doc.status}
                                                            </span>
                                                        </td>
                                                        <td className="action-btns">
                                                            <button className="edit-btn" onClick={() => editDoctor(doc)}>
                                                                ✏️ Edit
                                                            </button>
                                                            <button className="delete-btn" onClick={() => deleteDoctor(doc.id)}>
                                                                🗑 Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* ── MODAL: Add / Edit Doctor ── */}
                        {showModal && (
                            <div className="modal-overlay">
                                <div className="modal-box">

                                    <div className="modal-header">
                                        <h4>{isEditing ? "✏️ Edit Doctor" : "➕ Add Doctor"}</h4>
                                        <button onClick={() => setShowModal(false)}>✖</button>
                                    </div>

                                    <div className="modal-body">

                                        <div className="form-group">
                                            <label>Doctor ID</label>
                                            <input
                                                name="id"
                                                placeholder="e.g. D005"
                                                value={formData.id}
                                                onChange={handleChange}
                                                disabled={isEditing}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Full Name</label>
                                            <input
                                                name="name"
                                                placeholder="Dr. Full Name"
                                                value={formData.name}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Specialization</label>
                                            <input
                                                name="specialization"
                                                placeholder="e.g. Cardiologist"
                                                value={formData.specialization}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Department</label>
                                            <select name="dept" value={formData.dept} onChange={handleChange}>
                                                <option value="Cardiology">Cardiology</option>
                                                <option value="Neurology">Neurology</option>
                                                <option value="Orthopedic">Orthopedic</option>
                                                <option value="Pediatrics">Pediatrics</option>
                                                <option value="General">General</option>
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label>Phone</label>
                                            <input
                                                name="phone"
                                                placeholder="9876543210"
                                                value={formData.phone}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Email</label>
                                            <input
                                                name="email"
                                                placeholder="doctor@hospital.com"
                                                value={formData.email}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="form-group full-width">
                                            <label>Status</label>
                                            <select name="status" value={formData.status} onChange={handleChange}>
                                                <option value="Active">Active</option>
                                                <option value="On Leave">On Leave</option>
                                                <option value="InActive">InActive</option>
                                            </select>
                                        </div>

                                    </div>

                                    <div className="modal-footer">
                                        <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                                        <button className="save-btn" onClick={saveDoctor}>
                                            {isEditing ? "Update" : "Save"}
                                        </button>
                                    </div>

                                </div>
                            </div>
                        )}

                        {/* ── PATIENT PAGE ── */}
                        {activePage === "patient" && (
                            <div className="doctor-container">

                                <div className="doctor-header">
                                    <h4>🧑‍🦽 Manage Patients</h4>
                                    <div className="doctor-actions">
                                        <button className="add-btn" onClick={addPatient}>+ Add</button>
                                    </div>
                                </div>

                                <div className="doctor-table">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>NAME</th>
                                                <th>AGE</th>
                                                <th>DISEASE</th>
                                                <th>DOCTOR</th>
                                                <th>ADMISSION</th>
                                                <th>STATUS</th>
                                                <th>ACTION</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {patients.length === 0 ? (
                                                <tr>
                                                    <td colSpan="8" className="no-data">No patients found.</td>
                                                </tr>
                                            ) : (
                                                patients.map((p) => (
                                                    <tr key={p.id}>
                                                        <td>{p.id}</td>
                                                        <td>{p.name}</td>
                                                        <td>{p.age}</td>
                                                        <td>{p.disease}</td>
                                                        <td>{p.doctor}</td>
                                                        <td>
                                                            {p.admission?.slice(0, 10)}
                                                        </td>
                                                        <td>
                                                            <span className={
                                                                p.status === "Admitted" ? "status active" :
                                                                    "status inactive"
                                                            }>
                                                                {p.status}
                                                            </span>
                                                        </td>
                                                        <td className="action-btns">
                                                            <button className="edit-btn" onClick={() => editPatient(p)}>
                                                                ✏️ Edit
                                                            </button>
                                                            <button className="delete-btn" onClick={() => deletePatient(p.id)}>
                                                                🗑 Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* ── MODAL: Add / Edit Patient ── */}
                        {showPatientModal && (
                            <div className="modal-overlay">
                                <div className="modal-box">

                                    <div className="modal-header">
                                        <h4>{isPatientEditing ? "✏️ Edit Patient" : "➕ Add Patient"}</h4>
                                        <button onClick={() => setShowPatientModal(false)}>✖</button>
                                    </div>

                                    <div className="modal-body">

                                        <div className="form-group">
                                            <label>Patient ID</label>
                                            <input
                                                name="id"
                                                value={patientForm.id}
                                                onChange={handlePatientChange}
                                                disabled={isPatientEditing}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Name</label>
                                            <input name="name" value={patientForm.name} onChange={handlePatientChange} />
                                        </div>

                                        <div className="form-group">
                                            <label>Age</label>
                                            <input name="age" value={patientForm.age} onChange={handlePatientChange} />
                                        </div>

                                        <div className="form-group">
                                            <label>Disease</label>
                                            <input name="disease" value={patientForm.disease} onChange={handlePatientChange} />
                                        </div>

                                        <div className="form-group">
                                            <label>Doctor</label>
                                            <input name="doctor" value={patientForm.doctor} onChange={handlePatientChange} />
                                        </div>

                                        <div className="form-group">
                                            <label>Admission Date</label>
                                            <input
                                                type="date"
                                                name="admission"
                                                value={patientForm.admission}
                                                onChange={handlePatientChange}
                                            />
                                        </div>

                                        <div className="form-group full-width">
                                            <label>Status</label>
                                            <select name="status" value={patientForm.status} onChange={handlePatientChange}>
                                                <option value="Admitted">Admitted</option>
                                                <option value="Discharged">Discharged</option>
                                            </select>
                                        </div>

                                    </div>

                                    <div className="modal-footer">
                                        <button className="cancel-btn" onClick={() => setShowPatientModal(false)}>Cancel</button>
                                        <button className="save-btn" onClick={savePatient}>
                                            {isPatientEditing ? "Update" : "Save"}
                                        </button>
                                    </div>

                                </div>
                            </div>
                        )}

                        {activePage === "staff" && (
                            <div className="doctor-container">

                                <div className="doctor-header">
                                    <h4>👨‍💼 Manage Staff</h4>
                                    <div className="doctor-actions">
                                        <button className="add-btn" onClick={addStaff}>+ Add</button>
                                    </div>
                                </div>

                                <div className="doctor-table">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>NAME</th>
                                                <th>ROLE</th>
                                                <th>PHONE</th>
                                                <th>SHIFT</th>
                                                <th>STATUS</th>
                                                <th>ACTION</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {staff.length === 0 ? (
                                                <tr>
                                                    <td colSpan="7" className="no-data">No staff found.</td>
                                                </tr>
                                            ) : (
                                                staff.map((s) => (
                                                    <tr key={s.id}>
                                                        <td>{s.id}</td>
                                                        <td>{s.name}</td>
                                                        <td>{s.role}</td>
                                                        <td>{s.phone}</td>
                                                        <td>{s.shift}</td>
                                                        <td>
                                                            <span className={
                                                                s.status === "Active" ? "status active" : "status inactive"
                                                            }>
                                                                {s.status}
                                                            </span>
                                                        </td>
                                                        <td className="action-btns">
                                                            <button className="edit-btn" onClick={() => editStaff(s)}>✏️ Edit</button>
                                                            <button className="delete-btn" onClick={() => deleteStaff(s.id)}>🗑 Delete</button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {showStaffModal && (
                            <div className="modal-overlay">
                                <div className="modal-box">

                                    <div className="modal-header">
                                        <h4>{isStaffEditing ? "✏️ Edit Staff" : "➕ Add Staff"}</h4>
                                        <button onClick={() => setShowStaffModal(false)}>✖</button>
                                    </div>

                                    <div className="modal-body">

                                        <div className="form-group">
                                            <label>ID</label>
                                            <input
                                                name="id"
                                                value={staffForm.id}
                                                onChange={handleStaffChange}
                                                disabled={isStaffEditing}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Name</label>
                                            <input name="name" value={staffForm.name} onChange={handleStaffChange} />
                                        </div>

                                        {/* ROLE DROPDOWN */}
                                        <div className="form-group">
                                            <label>Role</label>
                                            <select name="role" value={staffForm.role} onChange={handleStaffChange}>
                                                <option value="Nurse">Nurse</option>
                                                <option value="Receptionist">Receptionist</option>
                                                <option value="Lab Staff">Lab Staff</option>
                                                <option value="Technician">Technician</option>
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label>Phone</label>
                                            <input name="phone" value={staffForm.phone} onChange={handleStaffChange} />
                                        </div>

                                        {/* SHIFT DROPDOWN */}
                                        <div className="form-group">
                                            <label>Shift</label>
                                            <select name="shift" value={staffForm.shift} onChange={handleStaffChange}>
                                                <option value="Morning">Morning</option>
                                                <option value="Afternoon">Afternoon</option>
                                                <option value="Night">Night</option>
                                            </select>
                                        </div>

                                        <div className="form-group full-width">
                                            <label>Status</label>
                                            <select name="status" value={staffForm.status} onChange={handleStaffChange}>
                                                <option value="Active">Active</option>
                                                <option value="Inactive">Inactive</option>
                                            </select>
                                        </div>

                                    </div>

                                    <div className="modal-footer">
                                        <button className="cancel-btn" onClick={() => setShowStaffModal(false)}>Cancel</button>
                                        <button className="save-btn" onClick={saveStaff}>
                                            {isStaffEditing ? "Update" : "Save"}
                                        </button>
                                    </div>

                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminPage;