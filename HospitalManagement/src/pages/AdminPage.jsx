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

const defaultAppointmentForm = {
    id: "",
    patient: "",
    doctor: "",
    date: "",
    time: "",
    status: "Pending"
};

const defaultDepartmentForm = {
    id: "",
    name: "",
    head: "",
    beds: "",
    occupied: ""
};

const defaultBillingForm = {
    id: "",
    patient: "",
    treatment: "",
    amount: "",
    status: "Pending"
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

    // APPOINTMENT STATES
    const [appointments, setAppointments] = useState([]);
    const [showAppointmentModal, setShowAppointmentModal] = useState(false);
    const [appointmentForm, setAppointmentForm] = useState(defaultAppointmentForm);
    const [isAppointmentEditing, setIsAppointmentEditing] = useState(false);
    const [editingAppointmentId, setEditingAppointmentId] = useState(null);

    // DEPARTMENT STATES
    const [departments, setDepartments] = useState([]);
    const [showDeptModal, setShowDeptModal] = useState(false);
    const [deptForm, setDeptForm] = useState(defaultDepartmentForm);

    // BILLING STATES
    const [bills, setBills] = useState([]);
    const [showBillModal, setShowBillModal] = useState(false);
    const [isBillEditing, setIsBillEditing] = useState(false);
    const [editingBillId, setEditingBillId] = useState(null);
    const [billForm, setBillForm] = useState(defaultBillingForm);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // useeffect to fetch
    useEffect(() => {
        fetchDoctors();
        fetchPatients();   // ✅ ADD THIS
        fetchStaff();
        fetchAppointments();
        fetchDepartments();
        fetchBilling();
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

    // ── APPOINTMENT FUNCTIONS ──
    const fetchAppointments = () => {
        axios.get("http://localhost:5000/appointments")
            .then(res => setAppointments(res.data))
            .catch(err => console.log(err));
    };

    const handleAppointmentChange = (e) => {
        setAppointmentForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const updateAppointmentStatus = (id, status) => {
        axios.put(`http://localhost:5000/update-appointment-status/${id}`, { status })
            .then(() => fetchAppointments())
            .catch(err => console.log(err));
    };

    // OPEN ADD
    const addAppointment = () => {
        setAppointmentForm({ ...defaultAppointmentForm });
        setIsAppointmentEditing(false);
        setShowAppointmentModal(true);
    };

    // OPEN EDIT
    const editAppointment = (a) => {
        setEditingAppointmentId(a.id);
        setAppointmentForm({
            ...a,
            date: a.date?.slice(0, 10)
        });
        setIsAppointmentEditing(true);
        setShowAppointmentModal(true);
    };

    // SAVE
    const saveAppointment = () => {
        if (!appointmentForm.id || !appointmentForm.patient) {
            alert("ID & Patient required");
            return;
        }

        const payload = {
            ...appointmentForm,
            id: String(appointmentForm.id)
        };

        if (isAppointmentEditing) {
            axios.put(`http://localhost:5000/update-appointment/${editingAppointmentId}`, payload)
                .then(() => {
                    fetchAppointments();
                    setShowAppointmentModal(false);
                    setIsAppointmentEditing(false);
                })
                .catch(err => console.log(err));
        } else {
            axios.post("http://localhost:5000/add-appointment", payload)
                .then(() => {
                    fetchAppointments();
                    setShowAppointmentModal(false);
                })
                .catch(err => console.log(err));
        }
    };

    // DELETE
    const deleteAppointment = (id) => {
        if (!window.confirm("Delete this appointment?")) return;

        axios.delete(`http://localhost:5000/delete-appointment/${id}`)
            .then(() => fetchAppointments())
            .catch(err => console.log(err));
    };

    // ── DEPARTMENT FUNCTIONS ──
    const fetchDepartments = () => {
        axios.get("http://localhost:5000/departments")
            .then(res => setDepartments(res.data))
            .catch(err => console.log(err));
    };

    const handleDeptChange = (e) => {
        setDeptForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const openAddDept = () => {
        setDeptForm({ ...defaultDepartmentForm });
        setShowDeptModal(true);
    };

    const saveDepartment = () => {
        if (!deptForm.id || !deptForm.name) {
            alert("ID and Name are required!");
            return;
        }
        const payload = {
            ...deptForm,
            beds: Number(deptForm.beds) || 0,
            occupied: Number(deptForm.occupied) || 0
        };
        axios.post("http://localhost:5000/add-department", payload)
            .then(() => {
                fetchDepartments();
                setShowDeptModal(false);
                setDeptForm({ ...defaultDepartmentForm });
            })
            .catch(err => {
                console.log(err);
                alert("Failed to add department. Check console.");
            });
    };

    const deleteDepartment = (id) => {
        if (!window.confirm("Remove this department?")) return;
        axios.delete(`http://localhost:5000/delete-department/${id}`)
            .then(() => fetchDepartments())
            .catch(err => console.log(err));
    };

    // ── BILLING FUNCTIONS ──
    const fetchBilling = () => {
        axios.get("http://localhost:5000/billing")
            .then(res => setBills(res.data))
            .catch(err => console.log(err));
    };

    const handleBillChange = (e) => {
        setBillForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const addBill = () => {
        setBillForm({ ...defaultBillingForm });
        setIsBillEditing(false);
        setShowBillModal(true);
    };

    const editBill = (b) => {
        setEditingBillId(b.id);
        setBillForm({ ...b });
        setIsBillEditing(true);
        setShowBillModal(true);
    };

    const saveBill = () => {
        if (!billForm.id || !billForm.patient) {
            alert("ID and Patient are required!");
            return;
        }
        const payload = {
            ...billForm,
            amount: Number(billForm.amount) || 0
        };

        if (isBillEditing) {
            axios.put(`http://localhost:5000/update-bill/${editingBillId}`, payload)
                .then(() => {
                    fetchBilling();
                    setShowBillModal(false);
                    setIsBillEditing(false);
                })
                .catch(err => console.log(err));
        } else {
            axios.post("http://localhost:5000/add-bill", payload)
                .then(() => {
                    fetchBilling();
                    setShowBillModal(false);
                })
                .catch(err => {
                    console.log(err);
                    alert("Failed to add bill. Check console.");
                });
        }
    };

    const deleteBill = (id) => {
        if (!window.confirm("Delete this bill?")) return;
        axios.delete(`http://localhost:5000/delete-bill/${id}`)
            .then(() => fetchBilling())
            .catch(err => console.log(err));
    };

    const toggleBillStatus = (id, currentStatus) => {
        const newStatus = currentStatus === "Paid" ? "Pending" : "Paid";
        axios.put(`http://localhost:5000/update-bill-status/${id}`, { status: newStatus })
            .then(() => fetchBilling())
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
                            <a className="nav-link text-white" onClick={() => setActivePage("billing")}>💳 Billing</a>
                            <a className="nav-link text-white" onClick={() => setActivePage("reports")}>📈 Reports</a>
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
                                        {activePage === "patient" && "Manage Patients"}
                                        {activePage === "staff" && "Manage Staff"}
                                        {activePage === "appointment" && "Manage Appointments"}
                                        {activePage === "department" && "Manage Departments"}
                                        {activePage === "billing" && "Billing & Payments"}
                                        {activePage === "reports" && "Reports & Analytics"}
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
                        {activePage === "dashboard" && (() => {
                            const totalDepartments = departments.length;
                            const totalBeds = departments.reduce((sum, d) => sum + (Number(d.beds) || 0), 0);
                            const occupiedBeds = departments.reduce((sum, d) => sum + (Number(d.occupied) || 0), 0);
                            const availableBeds = totalBeds - occupiedBeds;
                            const totalBill = patients.reduce((sum, p) => sum + (Number(p.bill) || 0), 0);

                            return (
                                <div className="container-fluid px-4 mt-4">
                                    {/* Row 1 */}
                                    <div className="row g-4 mb-2">
                                        <div className="col-md-3">
                                            <div className="dash-card dash-card--blue">
                                                <div className="dash-card__icon">👨‍⚕️</div>
                                                <div className="dash-card__info">
                                                    <span className="dash-card__label">Total Doctors</span>
                                                    <span className="dash-card__value">{doctors.length}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="dash-card dash-card--green">
                                                <div className="dash-card__icon">🧑‍🦽</div>
                                                <div className="dash-card__info">
                                                    <span className="dash-card__label">Total Patients</span>
                                                    <span className="dash-card__value">{patients.length}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="dash-card dash-card--purple">
                                                <div className="dash-card__icon">🧑‍💼</div>
                                                <div className="dash-card__info">
                                                    <span className="dash-card__label">Total Staff</span>
                                                    <span className="dash-card__value">{staff.length}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="dash-card dash-card--orange">
                                                <div className="dash-card__icon">📅</div>
                                                <div className="dash-card__info">
                                                    <span className="dash-card__label">Total Appointments</span>
                                                    <span className="dash-card__value">{appointments.length}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Row 2 */}
                                    <div className="row g-4">
                                        <div className="col-md-3">
                                            <div className="dash-card dash-card--teal">
                                                <div className="dash-card__icon">🏥</div>
                                                <div className="dash-card__info">
                                                    <span className="dash-card__label">Total Departments</span>
                                                    <span className="dash-card__value">{totalDepartments}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="dash-card dash-card--red">
                                                <div className="dash-card__icon">💰</div>
                                                <div className="dash-card__info">
                                                    <span className="dash-card__label">Total Bills</span>
                                                    <span className="dash-card__value">₹{totalBill.toLocaleString("en-IN")}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="dash-card dash-card--indigo">
                                                <div className="dash-card__icon">🛏️</div>
                                                <div className="dash-card__info">
                                                    <span className="dash-card__label">Beds Occupied</span>
                                                    <span className="dash-card__value">{occupiedBeds} <small>/ {totalBeds}</small></span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="dash-card dash-card--cyan">
                                                <div className="dash-card__icon">✅</div>
                                                <div className="dash-card__info">
                                                    <span className="dash-card__label">Beds Available</span>
                                                    <span className="dash-card__value">{availableBeds}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}

                        {/* ── REPORTS PAGE ── */}
                        {activePage === "reports" && (() => {
                            // Compute stats
                            const totalPatients = patients.length;
                            const activeDoctors = doctors.filter(d => d.status === "Active").length;
                            const approvedAppointments = appointments.filter(a => a.status === "Accepted" || a.status === "Approved").length;
                            const collectedRevenue = bills
                                .filter(b => b.status === "Paid")
                                .reduce((sum, b) => sum + (Number(b.amount) || 0), 0);

                            // Format revenue
                            const formatRevenue = (amt) => {
                                if (amt >= 1000) return `₹${(amt / 1000).toFixed(1)}K`;
                                return `₹${amt}`;
                            };

                            // Department-wise stats
                            const deptStats = departments.map(dept => ({
                                name: dept.name,
                                totalDoctors: doctors.filter(d => d.dept === dept.name).length,
                                totalPatients: patients.filter(p => p.disease && doctors.find(d => d.name === p.doctor && d.dept === dept.name)).length,
                                appointments: appointments.filter(a => doctors.find(d => d.name === a.doctor && d.dept === dept.name)).length,
                            }));

                            return (
                                <div className="container-fluid px-4 mt-4">
                                    {/* Report Cards */}
                                    <div className="row g-4 mb-4">
                                        {/* Patient Report */}
                                        <div className="col-md-6 col-lg-3">
                                            <div className="report-card">
                                                <div className="report-card__icon">🧑‍🦽</div>
                                                <div className="report-card__title">Patient Report</div>
                                                <div className="report-card__sub">Daily admissions &amp; discharges</div>
                                                <div className="report-card__value">{totalPatients}</div>
                                                <span className="report-card__badge report-card__badge--blue">Patients</span>
                                            </div>
                                        </div>

                                        {/* Doctor Report */}
                                        <div className="col-md-6 col-lg-3">
                                            <div className="report-card">
                                                <div className="report-card__icon">🧑‍⚕️</div>
                                                <div className="report-card__title">Doctor Report</div>
                                                <div className="report-card__sub">Active staff &amp; assignments</div>
                                                <div className="report-card__value">{activeDoctors}</div>
                                                <span className="report-card__badge report-card__badge--teal">Active Doctors</span>
                                            </div>
                                        </div>

                                        {/* Appointment Report */}
                                        <div className="col-md-6 col-lg-3">
                                            <div className="report-card">
                                                <div className="report-card__icon">📅</div>
                                                <div className="report-card__title">Appointment Report</div>
                                                <div className="report-card__sub">Today's &amp; upcoming appointments</div>
                                                <div className="report-card__value">{approvedAppointments}</div>
                                                <span className="report-card__badge report-card__badge--green">Approved</span>
                                            </div>
                                        </div>

                                        {/* Revenue Report */}
                                        <div className="col-md-6 col-lg-3">
                                            <div className="report-card">
                                                <div className="report-card__icon">💰</div>
                                                <div className="report-card__title">Revenue Report</div>
                                                <div className="report-card__sub">Billing &amp; payment overview</div>
                                                <div className="report-card__value">{formatRevenue(collectedRevenue)}</div>
                                                <span className="report-card__badge report-card__badge--orange">Collected</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Department-wise Table */}
                                    <div className="report-table-wrap">
                                        <div className="report-table-header">
                                            <span className="report-table-icon">📊</span>
                                            <h5 className="report-table-title">Department-wise Bed Usage</h5>
                                        </div>
                                        <div className="doctor-table">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>DEPARTMENT</th>
                                                        <th>TOTAL DOCTORS</th>
                                                        <th>TOTAL PATIENTS</th>
                                                        <th>APPOINTMENTS</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {deptStats.length === 0 ? (
                                                        <tr>
                                                            <td colSpan="4" className="no-data">No department data found.</td>
                                                        </tr>
                                                    ) : (
                                                        deptStats.map((dept, idx) => (
                                                            <tr key={idx}>
                                                                <td><strong>{dept.name}</strong></td>
                                                                <td>{dept.totalDoctors}</td>
                                                                <td>{dept.totalPatients}</td>
                                                                <td>{dept.appointments}</td>
                                                            </tr>
                                                        ))
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}

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

                        {activePage === "appointment" && (
                            <div className="doctor-container">

                                <div className="doctor-header">
                                    <h4>📅 Manage Appointments</h4>
                                    <div className="doctor-actions">
                                        <button className="add-btn" onClick={addAppointment}>+ Add</button>
                                    </div>
                                </div>
                                <div className="doctor-table">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>PATIENT</th>
                                                <th>DOCTOR</th>
                                                <th>DATE</th>
                                                <th>TIME</th>
                                                <th>STATUS</th>
                                                <th>ACTION</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {appointments.length === 0 ? (
                                                <tr>
                                                    <td colSpan="7" className="no-data">No appointments found.</td>
                                                </tr>
                                            ) : (
                                                appointments.map((a) => (
                                                    <tr key={a.id}>
                                                        <td>{a.id}</td>
                                                        <td>{a.patient}</td>
                                                        <td>{a.doctor}</td>
                                                        <td>{a.date?.slice(0, 10)}</td>
                                                        <td>{a.time}</td>

                                                        <td>
                                                            <span className={
                                                                a.status === "Accepted" ? "status active" :
                                                                    a.status === "Rejected" ? "status inactive" :
                                                                        "status leave"
                                                            }>
                                                                {a.status}
                                                            </span>
                                                        </td>

                                                        <td className="action-btns">

                                                            <button className="edit-btn" onClick={() => editAppointment(a)}>
                                                                ✏️ Edit
                                                            </button>

                                                            <button className="delete-btn" onClick={() => deleteAppointment(a.id)}>
                                                                🗑 Delete
                                                            </button>

                                                            {/* ACCEPT */}
                                                            {a.status !== "Accepted" && (
                                                                <button className="accept-btn" onClick={() => updateAppointmentStatus(a.id, "Accepted")}>
                                                                    ✅ Accept
                                                                </button>
                                                            )}

                                                            {/* REJECT */}
                                                            {a.status !== "Rejected" && (
                                                                <button className="reject-btn" onClick={() => updateAppointmentStatus(a.id, "Rejected")}>
                                                                    ❌ Reject
                                                                </button>
                                                            )}

                                                            {/* REVERT */}
                                                            {(a.status === "Accepted" || a.status === "Rejected") && (
                                                                <button className="revert-btn" onClick={() => updateAppointmentStatus(a.id, "Pending")}>
                                                                    🔄 Pending
                                                                </button>
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

                        {/* ── DEPARTMENTS PAGE ── */}
                        {activePage === "department" && (
                            <div className="dept-container">
                                <div className="dept-header">
                                    <h4>🏢 Manage Departments</h4>
                                    <button className="add-dept-btn" onClick={openAddDept}>+ Add Department</button>
                                </div>

                                <div className="dept-grid">
                                    {departments.length === 0 ? (
                                        <p className="no-dept-msg">No departments found. Add one!</p>
                                    ) : (
                                        departments.map((dep, idx) => {
                                            const pct = dep.beds > 0
                                                ? Math.round((dep.occupied / dep.beds) * 100)
                                                : 0;
                                            return (
                                                <div className="dept-card" key={dep.id}>
                                                    <div className="dept-card__top">
                                                        <span className="dept-card__name">{dep.name}</span>
                                                        <span className="dept-card__id">{dep.id}</span>
                                                    </div>
                                                    <p className="dept-card__head">Head: {dep.head || "—"}</p>
                                                    <div className="dept-card__beds">
                                                        <span className="dept-beds-occupied">{dep.occupied}</span>
                                                        <span className="dept-beds-total">/{dep.beds} beds</span>
                                                    </div>
                                                    <div className="dept-progress-track">
                                                        <div
                                                            className="dept-progress-fill"
                                                            style={{ width: `${pct}%` }}
                                                        />
                                                    </div>
                                                    <button className="dept-remove-btn" onClick={() => deleteDepartment(dep.id)}>
                                                        🗑 Remove
                                                    </button>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>

                                {/* Add Department Modal */}
                                {showDeptModal && (
                                    <div className="modal-overlay">
                                        <div className="modal-box">
                                            <div className="modal-header">
                                                <h4>➕ Add Department</h4>
                                                <button onClick={() => setShowDeptModal(false)}>✖</button>
                                            </div>
                                            <div className="modal-body">
                                                <div className="form-group">
                                                    <label>Department ID</label>
                                                    <input name="id" placeholder="e.g. DEP05" value={deptForm.id} onChange={handleDeptChange} />
                                                </div>
                                                <div className="form-group">
                                                    <label>Department Name</label>
                                                    <input name="name" placeholder="e.g. Radiology" value={deptForm.name} onChange={handleDeptChange} />
                                                </div>
                                                <div className="form-group">
                                                    <label>Head Doctor</label>
                                                    <input name="head" placeholder="e.g. Dr. John Smith" value={deptForm.head} onChange={handleDeptChange} />
                                                </div>
                                                <div className="form-group">
                                                    <label>Total Beds</label>
                                                    <input type="number" name="beds" placeholder="e.g. 20" value={deptForm.beds} onChange={handleDeptChange} />
                                                </div>
                                                <div className="form-group">
                                                    <label>Occupied Beds</label>
                                                    <input type="number" name="occupied" placeholder="e.g. 12" value={deptForm.occupied} onChange={handleDeptChange} />
                                                </div>
                                            </div>
                                            <div className="modal-footer">
                                                <button className="cancel-btn" onClick={() => setShowDeptModal(false)}>Cancel</button>
                                                <button className="save-btn" onClick={saveDepartment}>Save</button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ── BILLING PAGE ── */}
                        {activePage === "billing" && (() => {
                            const totalRevenue = bills
                                .filter(b => b.status === "Paid")
                                .reduce((sum, b) => sum + Number(b.amount), 0);
                            const pendingTotal = bills
                                .filter(b => b.status === "Pending")
                                .reduce((sum, b) => sum + Number(b.amount), 0);
                            const totalBills = bills.length;

                            return (
                                <div className="billing-container">

                                    {/* Summary Cards */}
                                    <div className="billing-summary">
                                        <div className="bill-summary-card bill-summary-card--green">
                                            <span className="bill-summary-amount">₹{totalRevenue.toLocaleString("en-IN")}</span>
                                            <span className="bill-summary-label">Total Revenue (Paid)</span>
                                        </div>
                                        <div className="bill-summary-card bill-summary-card--orange">
                                            <span className="bill-summary-amount">₹{pendingTotal.toLocaleString("en-IN")}</span>
                                            <span className="bill-summary-label">Pending Payments</span>
                                        </div>
                                        <div className="bill-summary-card bill-summary-card--neutral">
                                            <span className="bill-summary-amount">{totalBills}</span>
                                            <span className="bill-summary-label">Total Bills</span>
                                        </div>
                                    </div>

                                    {/* Table Section */}
                                    <div className="billing-table-section">
                                        <div className="billing-table-header">
                                            <h5 className="billing-table-title">All Bills</h5>
                                            <button className="generate-bill-btn" onClick={addBill}>+ Generate Bill</button>
                                        </div>

                                        <div className="billing-table-wrapper">
                                            <table className="billing-table">
                                                <thead>
                                                    <tr>
                                                        <th>BILL ID</th>
                                                        <th>PATIENT</th>
                                                        <th>TREATMENT</th>
                                                        <th>AMOUNT (₹)</th>
                                                        <th>STATUS</th>
                                                        <th>ACTION</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {bills.length === 0 ? (
                                                        <tr>
                                                            <td colSpan="6" className="no-data">No bills found. Generate one!</td>
                                                        </tr>
                                                    ) : (
                                                        bills.map((bill) => (
                                                            <tr key={bill.id}>
                                                                <td className="bill-id">{bill.id}</td>
                                                                <td className="bill-patient">{bill.patient}</td>
                                                                <td className="bill-treatment">{bill.treatment}</td>
                                                                <td className="bill-amount">₹{Number(bill.amount).toLocaleString("en-IN")}</td>
                                                                <td>
                                                                    <span className={`bill-status ${bill.status === "Paid" ? "bill-status--paid" : "bill-status--pending"}`}>
                                                                        {bill.status}
                                                                    </span>
                                                                </td>
                                                                <td className="bill-actions">
                                                                    <button
                                                                        className={`bill-toggle-btn ${bill.status === "Paid" ? "bill-toggle-btn--mark-pending" : "bill-toggle-btn--mark-paid"}`}
                                                                        onClick={() => toggleBillStatus(bill.id, bill.status)}
                                                                    >
                                                                        {bill.status === "Paid" ? "Mark Pending" : "Mark Paid"}
                                                                    </button>
                                                                    <button className="bill-edit-btn" onClick={() => editBill(bill)}>✏️</button>
                                                                    <button className="bill-delete-btn" onClick={() => deleteBill(bill.id)}>🗑️</button>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Generate/Edit Bill Modal */}
                                    {showBillModal && (
                                        <div className="modal-overlay">
                                            <div className="modal-box">
                                                <div className="modal-header">
                                                    <h4>{isBillEditing ? "✏️ Edit Bill" : "🧾 Generate Bill"}</h4>
                                                    <button onClick={() => setShowBillModal(false)}>✖</button>
                                                </div>
                                                <div className="modal-body">
                                                    <div className="form-group">
                                                        <label>Bill ID</label>
                                                        <input
                                                            name="id"
                                                            placeholder="e.g. B001"
                                                            value={billForm.id}
                                                            onChange={handleBillChange}
                                                            disabled={isBillEditing}
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Patient Name</label>
                                                        <input
                                                            name="patient"
                                                            placeholder="e.g. Amit Verma"
                                                            value={billForm.patient}
                                                            onChange={handleBillChange}
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Treatment</label>
                                                        <input
                                                            name="treatment"
                                                            placeholder="e.g. Cardiology Checkup"
                                                            value={billForm.treatment}
                                                            onChange={handleBillChange}
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Amount (₹)</label>
                                                        <input
                                                            type="number"
                                                            name="amount"
                                                            placeholder="e.g. 4500"
                                                            value={billForm.amount}
                                                            onChange={handleBillChange}
                                                        />
                                                    </div>
                                                    <div className="form-group full-width">
                                                        <label>Status</label>
                                                        <select name="status" value={billForm.status} onChange={handleBillChange}>
                                                            <option value="Pending">Pending</option>
                                                            <option value="Paid">Paid</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="modal-footer">
                                                    <button className="cancel-btn" onClick={() => setShowBillModal(false)}>Cancel</button>
                                                    <button className="save-btn" onClick={saveBill}>
                                                        {isBillEditing ? "Update" : "Save"}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })()}

                        {showAppointmentModal && (<div className="modal-overlay">
                            <div className="modal-box">

                                <div className="modal-header">
                                    <h4>{isAppointmentEditing ? "✏️ Edit Appointment" : "➕ Add Appointment"}</h4>
                                    <button onClick={() => setShowAppointmentModal(false)}>✖</button>
                                </div>

                                <div className="modal-body">

                                    <div className="form-group">
                                        <label>ID</label>
                                        <input
                                            name="id"
                                            value={appointmentForm.id}
                                            onChange={handleAppointmentChange}
                                            disabled={isAppointmentEditing}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Patient</label>
                                        <input
                                            name="patient"
                                            value={appointmentForm.patient}
                                            onChange={handleAppointmentChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Doctor</label>
                                        <input
                                            name="doctor"
                                            value={appointmentForm.doctor}
                                            onChange={handleAppointmentChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Date</label>
                                        <input
                                            type="date"
                                            name="date"
                                            value={appointmentForm.date}
                                            onChange={handleAppointmentChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Time</label>
                                        <input
                                            type="time"
                                            name="time"
                                            value={appointmentForm.time}
                                            onChange={handleAppointmentChange}
                                        />
                                    </div>

                                    <div className="form-group full-width">
                                        <label>Status</label>
                                        <select
                                            name="status"
                                            value={appointmentForm.status}
                                            onChange={handleAppointmentChange}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Accepted">Accepted</option>
                                            <option value="Rejected">Rejected</option>
                                        </select>
                                    </div>

                                </div>

                                <div className="modal-footer">
                                    <button className="cancel-btn" onClick={() => setShowAppointmentModal(false)}>
                                        Cancel
                                    </button>
                                    <button className="save-btn" onClick={saveAppointment}>
                                        {isAppointmentEditing ? "Update" : "Save"}
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