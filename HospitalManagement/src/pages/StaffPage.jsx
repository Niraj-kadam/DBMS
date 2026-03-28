import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../style/staffpage.css';

function StaffPage() {
    const navigate = useNavigate();
    const [activePage, setActivePage] = useState("dashboard");

    const [currentUser, setCurrentUser] = useState(null);
    const [staffInfo, setStaffInfo] = useState(null);

    const [patients, setPatients] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [tasks, setTasks] = useState([]);

    const [showTaskModal, setShowTaskModal] = useState(false);
    const [taskForm, setTaskForm] = useState({ id: "", title: "", description: "", priority: "Medium", status: "Pending" });
    const [isTaskEditing, setIsTaskEditing] = useState(false);
    const [editingTaskId, setEditingTaskId] = useState(null);

    const [showProfileModal, setShowProfileModal] = useState(false);
    const [profileForm, setProfileForm] = useState({ name: "", role: "", phone: "", shift: "", status: "" });

    useEffect(() => {
        // ✅ FIX: Check both "staffUser" (set at staff login) and fallback to "users"
        const stored = localStorage.getItem("staffUser") || localStorage.getItem("users");
        if (!stored) { navigate("/stafflog"); return; }
        const user = JSON.parse(stored);
        setCurrentUser(user);
        fetchStaff(user);
        fetchPatients();
        fetchAppointments();
        fetchTasks();
    }, []);

    // ✅ FIX: Match by id (loose equality handles string vs number), name, or email
    const fetchStaff = (user) => {
        axios.get("http://localhost:5000/staff")
            .then(res => {
                const me = res.data.find(s =>
                    String(s.id) === String(user.id) ||
                    (user.name && s.name === user.name) ||
                    (user.email && s.email === user.email)
                );
                if (me) {
                    setStaffInfo(me);
                } else {
                    console.warn("No matching staff record found for user:", user);
                    console.log("Available staff:", res.data);
                }
            })
            .catch(err => console.log(err));
    };

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

    const fetchTasks = () => {
        axios.get("http://localhost:5000/staff-tasks")
            .then(res => setTasks(res.data))
            .catch(err => console.log(err));
    };

    const handleTaskChange = (e) => {
        setTaskForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const openAddTask = () => {
        setTaskForm({ id: "", title: "", description: "", priority: "Medium", status: "Pending" });
        setIsTaskEditing(false);
        setShowTaskModal(true);
    };

    const openEditTask = (task) => {
        setEditingTaskId(task.id);
        setTaskForm({ ...task });
        setIsTaskEditing(true);
        setShowTaskModal(true);
    };

    const saveTask = () => {
        if (!taskForm.id || !taskForm.title) { alert("ID and Title are required!"); return; }
        if (isTaskEditing) {
            axios.put(`http://localhost:5000/update-staff-task/${editingTaskId}`, taskForm)
                .then(() => { fetchTasks(); setShowTaskModal(false); })
                .catch(err => console.log(err));
        } else {
            axios.post("http://localhost:5000/add-staff-task", { ...taskForm, assigned_to: staffInfo?.name || "" })
                .then(() => { fetchTasks(); setShowTaskModal(false); })
                .catch(err => console.log(err));
        }
    };

    const deleteTask = (id) => {
        if (!window.confirm("Delete this task?")) return;
        axios.delete(`http://localhost:5000/delete-staff-task/${id}`)
            .then(() => fetchTasks())
            .catch(err => console.log(err));
    };

    const toggleTaskStatus = (task) => {
        const newStatus = task.status === "Done" ? "Pending" : "Done";
        axios.put(`http://localhost:5000/update-staff-task/${task.id}`, { ...task, status: newStatus })
            .then(() => fetchTasks())
            .catch(err => console.log(err));
    };

    // ✅ FIX: Show alert if staffInfo not loaded yet instead of silently returning
    const openEditProfile = () => {
        if (!staffInfo) {
            alert("Staff profile not loaded. Please make sure your account is linked to a staff record.");
            return;
        }
        setProfileForm({
            name: staffInfo.name || "",
            role: staffInfo.role || "",
            phone: staffInfo.phone || "",
            shift: staffInfo.shift || "",
            status: staffInfo.status || ""
        });
        setShowProfileModal(true);
    };

    // ✅ FIX: After save, re-fetch staff so UI is fully in sync with DB
    const saveProfile = () => {
        if (!staffInfo) return;
        const payload = {
            name: profileForm.name,
            role: profileForm.role,
            phone: profileForm.phone,
            shift: profileForm.shift,
            status: profileForm.status
        };
        axios.put(`http://localhost:5000/update-staff/${staffInfo.id}`, payload)
            .then(() => {
                setStaffInfo(prev => ({ ...prev, ...payload }));
                setShowProfileModal(false);
                alert("Profile updated successfully!");
            })
            .catch(err => {
                console.log("Profile update error:", err);
                alert("Failed to update profile. Check console for details.");
            });
    };

    const handleLogout = () => {
        localStorage.removeItem("staffUser");
        localStorage.removeItem("users");
        navigate("/stafflog");
    };

    const todayStr = new Date().toISOString().slice(0, 10);
    const todayAppointments = appointments.filter(a => a.date?.slice(0, 10) === todayStr);
    const admittedPatients = patients.filter(p => p.status === "Admitted");
    const pendingTasks = tasks.filter(t => t.status !== "Done");

    return (
        <>
            <div className="container-fluid staff-dashboard">
                <div className="row min-vh-100">

                    {/* Sidebar */}
                    <div className="col-2 col-sm-3 col-xl-2 bg-dark p-0">
                        <nav className="navbar bg-dark border-bottom border-white" data-bs-theme="dark">
                            <a className="navbar-brand ms-3 staff-panel" href="#">Staff Portal</a>
                        </nav>
                        <nav className="nav flex-column border-bottom border-white px-3">
                            <h6 className="text-light mt-3">Main Menu</h6>
                            <a className="nav-link text-white" onClick={() => setActivePage("dashboard")}>📊 Dashboard</a>
                            <a className="nav-link text-white" onClick={() => setActivePage("patients")}>🧑‍🦽 Patients</a>
                            <a className="nav-link text-white" onClick={() => setActivePage("appointments")}>📅 Appointments</a>
                            <a className="nav-link text-white" onClick={() => setActivePage("tasks")}>✅ My Tasks</a>
                            <a className="nav-link text-white" onClick={() => setActivePage("profile")}>👤 My Profile</a>
                        </nav>
                        <div className="p-3">
                            <button className="btn text-light staff-out w-100" onClick={handleLogout}>
                                {staffInfo?.name || currentUser?.name || "Staff"} <br />
                                <span className="logout text-danger">Logout →</span>
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="col-10 col-sm-9 col-xl-10 p-0">

                        {/* Top Navbar */}
                        <nav className="navbar navbar-expand-lg staff-nav px-4 py-3">
                            <div className="container-fluid">
                                <div>
                                    <h3 className="m-0">
                                        {activePage === "dashboard" && "Dashboard"}
                                        {activePage === "patients" && "Patients"}
                                        {activePage === "appointments" && "Appointments"}
                                        {activePage === "tasks" && "My Tasks"}
                                        {activePage === "profile" && "My Profile"}
                                    </h3>
                                    <small>Welcome, {staffInfo?.name || currentUser?.name}!</small>
                                </div>
                            </div>
                        </nav>

                        {/* DASHBOARD */}
                        {activePage === "dashboard" && (
                            <div className="container-fluid px-4 mt-4">
                                <div className="row g-4 mb-4">
                                    <div className="col-md-3">
                                        <div className="staff-dash-card staff-dash-card--blue">
                                            <div className="staff-dash-card__icon">🧑‍🦽</div>
                                            <div className="staff-dash-card__info">
                                                <span className="staff-dash-card__label">Total Patients</span>
                                                <span className="staff-dash-card__value">{patients.length}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="staff-dash-card staff-dash-card--green">
                                            <div className="staff-dash-card__icon">🏥</div>
                                            <div className="staff-dash-card__info">
                                                <span className="staff-dash-card__label">Admitted</span>
                                                <span className="staff-dash-card__value">{admittedPatients.length}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="staff-dash-card staff-dash-card--orange">
                                            <div className="staff-dash-card__icon">📅</div>
                                            <div className="staff-dash-card__info">
                                                <span className="staff-dash-card__label">Today's Appointments</span>
                                                <span className="staff-dash-card__value">{todayAppointments.length}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="staff-dash-card staff-dash-card--purple">
                                            <div className="staff-dash-card__icon">📋</div>
                                            <div className="staff-dash-card__info">
                                                <span className="staff-dash-card__label">Pending Tasks</span>
                                                <span className="staff-dash-card__value">{pendingTasks.length}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row g-4">
                                    <div className="col-md-4">
                                        <div className="staff-info-card">
                                            <h5 className="staff-info-title">👤 My Info</h5>
                                            <div className="staff-info-row"><span>Name</span><strong>{staffInfo?.name || "—"}</strong></div>
                                            <div className="staff-info-row"><span>Role</span><strong>{staffInfo?.role || "—"}</strong></div>
                                            <div className="staff-info-row"><span>Shift</span><strong>{staffInfo?.shift || "—"}</strong></div>
                                            <div className="staff-info-row"><span>Phone</span><strong>{staffInfo?.phone || "—"}</strong></div>
                                            <div className="staff-info-row">
                                                <span>Status</span>
                                                <span className={`status ${staffInfo?.status === "Active" ? "active" : "inactive"}`}>{staffInfo?.status || "—"}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-8">
                                        <div className="staff-table-card">
                                            <h5 className="staff-info-title">📅 Today's Appointments</h5>
                                            <table className="staff-table">
                                                <thead>
                                                    <tr><th>Patient</th><th>Doctor</th><th>Time</th><th>Status</th></tr>
                                                </thead>
                                                <tbody>
                                                    {todayAppointments.length === 0 ? (
                                                        <tr><td colSpan="4" className="no-data">No appointments today.</td></tr>
                                                    ) : (
                                                        todayAppointments.map(a => (
                                                            <tr key={a.id}>
                                                                <td>{a.patient}</td>
                                                                <td>{a.doctor}</td>
                                                                <td>{a.time}</td>
                                                                <td><span className={`status ${a.status === "Accepted" ? "active" : a.status === "Rejected" ? "inactive" : "leave"}`}>{a.status}</span></td>
                                                            </tr>
                                                        ))
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* PATIENTS */}
                        {activePage === "patients" && (
                            <div className="staff-container">
                                <div className="staff-header"><h4>🧑‍🦽 All Patients</h4></div>
                                <div className="staff-table-wrap">
                                    <table className="staff-table">
                                        <thead>
                                            <tr><th>ID</th><th>Name</th><th>Age</th><th>Disease</th><th>Doctor</th><th>Admission</th><th>Status</th></tr>
                                        </thead>
                                        <tbody>
                                            {patients.length === 0 ? (
                                                <tr><td colSpan="7" className="no-data">No patients found.</td></tr>
                                            ) : (
                                                patients.map(p => (
                                                    <tr key={p.id}>
                                                        <td>{p.id}</td>
                                                        <td><strong>{p.name}</strong></td>
                                                        <td>{p.age}</td>
                                                        <td>{p.disease}</td>
                                                        <td>{p.doctor}</td>
                                                        <td>{p.admission}</td>
                                                        <td><span className={`status ${p.status === "Admitted" ? "active" : p.status === "Discharged" ? "inactive" : "leave"}`}>{p.status}</span></td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* APPOINTMENTS */}
                        {activePage === "appointments" && (
                            <div className="staff-container">
                                <div className="staff-header"><h4>📅 All Appointments</h4></div>
                                <div className="staff-table-wrap">
                                    <table className="staff-table">
                                        <thead>
                                            <tr><th>ID</th><th>Patient</th><th>Doctor</th><th>Date</th><th>Time</th><th>Status</th></tr>
                                        </thead>
                                        <tbody>
                                            {appointments.length === 0 ? (
                                                <tr><td colSpan="6" className="no-data">No appointments found.</td></tr>
                                            ) : (
                                                appointments.map(a => (
                                                    <tr key={a.id}>
                                                        <td>{a.id}</td>
                                                        <td><strong>{a.patient}</strong></td>
                                                        <td>{a.doctor}</td>
                                                        <td>{a.date?.slice(0, 10)}</td>
                                                        <td>{a.time}</td>
                                                        <td><span className={`status ${a.status === "Accepted" ? "active" : a.status === "Rejected" ? "inactive" : "leave"}`}>{a.status}</span></td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* TASKS */}
                        {activePage === "tasks" && (
                            <div className="staff-container">
                                <div className="staff-header">
                                    <h4>✅ My Tasks</h4>
                                    <button className="add-btn" onClick={openAddTask}>+ Add Task</button>
                                </div>
                                <div className="staff-table-wrap">
                                    <table className="staff-table">
                                        <thead>
                                            <tr><th>ID</th><th>Title</th><th>Description</th><th>Priority</th><th>Status</th><th>Actions</th></tr>
                                        </thead>
                                        <tbody>
                                            {tasks.length === 0 ? (
                                                <tr><td colSpan="6" className="no-data">No tasks yet. Add one!</td></tr>
                                            ) : (
                                                tasks.map(task => (
                                                    <tr key={task.id}>
                                                        <td>{task.id}</td>
                                                        <td><strong>{task.title}</strong></td>
                                                        <td>{task.description || "—"}</td>
                                                        <td><span className={`priority-badge priority--${task.priority?.toLowerCase()}`}>{task.priority}</span></td>
                                                        <td><span className={`status ${task.status === "Done" ? "active" : task.status === "In Progress" ? "leave" : "inactive"}`}>{task.status}</span></td>
                                                        <td>
                                                            <div className="action-btns">
                                                                <button className={task.status === "Done" ? "revert-btn" : "accept-btn"} onClick={() => toggleTaskStatus(task)}>
                                                                    {task.status === "Done" ? "↩ Undo" : "✓ Done"}
                                                                </button>
                                                                <button className="edit-btn" onClick={() => openEditTask(task)}>✏️</button>
                                                                <button className="delete-btn" onClick={() => deleteTask(task.id)}>🗑️</button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* PROFILE */}
                        {activePage === "profile" && (
                            <div className="container-fluid px-4 mt-4">
                                <div className="row g-4">
                                    <div className="col-md-5">
                                        <div className="staff-info-card">
                                            <h5 className="staff-info-title">👤 My Profile</h5>
                                            <div className="staff-info-row"><span>Staff ID</span><strong>{staffInfo?.id || "—"}</strong></div>
                                            <div className="staff-info-row"><span>Name</span><strong>{staffInfo?.name || "—"}</strong></div>
                                            <div className="staff-info-row"><span>Role</span><strong>{staffInfo?.role || "—"}</strong></div>
                                            <div className="staff-info-row"><span>Phone</span><strong>{staffInfo?.phone || "—"}</strong></div>
                                            <div className="staff-info-row"><span>Shift</span><strong>{staffInfo?.shift || "—"}</strong></div>
                                            <div className="staff-info-row">
                                                <span>Status</span>
                                                <span className={`status ${staffInfo?.status === "Active" ? "active" : "inactive"}`}>{staffInfo?.status || "—"}</span>
                                            </div>
                                            <button className="add-btn mt-3" onClick={openEditProfile}>✏️ Edit Profile</button>
                                        </div>
                                    </div>
                                    <div className="col-md-7">
                                        <div className="staff-info-card">
                                            <h5 className="staff-info-title">📊 My Summary</h5>
                                            <div className="staff-info-row"><span>Total Patients in System</span><strong>{patients.length}</strong></div>
                                            <div className="staff-info-row"><span>Admitted Patients</span><strong>{admittedPatients.length}</strong></div>
                                            <div className="staff-info-row"><span>Total Appointments</span><strong>{appointments.length}</strong></div>
                                            <div className="staff-info-row"><span>Today's Appointments</span><strong>{todayAppointments.length}</strong></div>
                                            <div className="staff-info-row"><span>Pending Tasks</span><strong>{pendingTasks.length}</strong></div>
                                            <div className="staff-info-row"><span>Total Tasks</span><strong>{tasks.length}</strong></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>

            {/* TASK MODAL */}
            {showTaskModal && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <div className="modal-header">
                            <h4>{isTaskEditing ? "✏️ Edit Task" : "➕ Add Task"}</h4>
                            <button onClick={() => setShowTaskModal(false)}>✖</button>
                        </div>
                        <div className="modal-body" style={{ display: "flex", flexDirection: "column" }}>
                            <div className="form-group full-width">
                                <label>Task ID</label>
                                <input name="id" value={taskForm.id} onChange={handleTaskChange} placeholder="e.g. T001" disabled={isTaskEditing} />
                            </div>
                            <div className="form-group full-width">
                                <label>Title</label>
                                <input name="title" value={taskForm.title} onChange={handleTaskChange} placeholder="e.g. Check patient vitals" />
                            </div>
                            <div className="form-group full-width">
                                <label>Description</label>
                                <input name="description" value={taskForm.description} onChange={handleTaskChange} placeholder="Optional details..." />
                            </div>
                            <div className="form-group full-width">
                                <label>Priority</label>
                                <select name="priority" value={taskForm.priority} onChange={handleTaskChange}>
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                            </div>
                            <div className="form-group full-width">
                                <label>Status</label>
                                <select name="status" value={taskForm.status} onChange={handleTaskChange}>
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Done">Done</option>
                                </select>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="cancel-btn" onClick={() => setShowTaskModal(false)}>Cancel</button>
                            <button className="save-btn" onClick={saveTask}>{isTaskEditing ? "Update" : "Save"}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* PROFILE EDIT MODAL */}
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
                                <label>Role</label>
                                <select value={profileForm.role} onChange={e => setProfileForm(p => ({ ...p, role: e.target.value }))}>
                                    <option value="Nurse">Nurse</option>
                                    <option value="Receptionist">Receptionist</option>
                                    <option value="Technician">Technician</option>
                                    <option value="Pharmacist">Pharmacist</option>
                                    <option value="Security">Security</option>
                                    <option value="Cleaner">Cleaner</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="form-group full-width">
                                <label>Phone</label>
                                <input value={profileForm.phone} onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))} />
                            </div>
                            <div className="form-group full-width">
                                <label>Shift</label>
                                <select value={profileForm.shift} onChange={e => setProfileForm(p => ({ ...p, shift: e.target.value }))}>
                                    <option value="Morning">Morning</option>
                                    <option value="Evening">Evening</option>
                                    <option value="Night">Night</option>
                                </select>
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

export default StaffPage;