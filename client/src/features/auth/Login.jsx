import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Input.jsx";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        const res = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include", // important for cookies
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
            alert("Invalid credentials");
            return;
        }

        const data = await res.json();
        const role = data.user.role;

        // role-based redirect
        if (role === "ADMIN") navigate("/admin");
        else navigate("/user");
    };

    return (
        <form onSubmit={handleLogin}>
            <h2>Login</h2>
            <Input label="Email:" type="email" value={email} onChange={e => setEmail(e.target.value)} />
            <Input label="Password:" type="password" value={password} onChange={e => setPassword(e.target.value)} />
            <div style={{ margin: "10px 0" }}>
                <label>Role:</label>
                <select value={role} onChange={e => setRole(e.target.value)}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
            <button type="submit">Login</button>
            <p>
                Don't have an account?{" "}
                <button type="button" onClick={() => navigate("/register")}>
                    Register
                </button>
            </p>
        </form>
    );
}

export default Login;
