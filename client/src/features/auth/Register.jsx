import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Input.jsx";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });

    if (!res.ok) {
      alert("Registration failed");
      return;
    }

    alert("Registered successfully! Please login.");
    navigate("/login");
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Register</h2>
      <Input label="Name:" type="text" value={name} onChange={e => setName(e.target.value)} />
      <Input label="Email:" type="email" value={email} onChange={e => setEmail(e.target.value)} />
      <Input label="Password:" type="password" value={password} onChange={e => setPassword(e.target.value)} />

      <div style={{ margin: "10px 0" }}>
        <label>Role:</label>
        <select value={role} onChange={e => setRole(e.target.value)}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <button type="submit">Register</button>

    </form>
  );
}

export default Register;
