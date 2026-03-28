import '../style/adminlog.css'
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Doctorlog() {
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch("http://localhost:5000/doctor-login-phone", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email.trim(), phone: phone.trim() }),
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem("doctorUser", JSON.stringify(data.doctor));
                navigate("/doctorpage");
            } else {
                setError(data.message || "Invalid email or phone number");
            }
        } catch (err) {
            setError("Server error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="adminlog-container">
                <div className="container-fluid">
                    <div className="adminlog-user bg-primary">
                        <h2>Doctor Login</h2>
                    </div>
                    <form onSubmit={handleLogin}>
                        <input
                            type="email"
                            placeholder="Email (as registered by admin)"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="tel"
                            placeholder="Phone (as registered by admin)"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                        {error && (
                            <p style={{ color: "red", fontSize: "0.875rem", margin: "4px 0" }}>
                                {error}
                            </p>
                        )}
                        <button
                            type="submit"
                            className="btn btn-outline-success"
                            disabled={loading}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>

                    </form>
                </div>
            </div>
        </>
    );
}

export default Doctorlog;