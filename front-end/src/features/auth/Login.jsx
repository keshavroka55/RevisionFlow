import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Input.jsx";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    if (role === "admin") navigate("/admin");
    else if (role === "chef") navigate("/chef");
    else navigate("/dashboard");
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <Input label="Email:" type="email" value={email} onChange={e => setEmail(e.target.value)} />
      <Input label="Password:" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
