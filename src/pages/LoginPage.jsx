import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false); // ✅ toggle form
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include"
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid credentials");
        return;
      }

      if (isRegister) {
        // ✅ After register, switch to login mode
        setIsRegister(false);
        return;
      }

      // ✅ Login success
      localStorage.setItem("token", data.token);
      navigate("/");

    } catch (err) {
      console.error("Auth error:", err);
      setError("Network error");
    }
  }

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--bg)",
      color: "var(--text)"
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          background: "var(--panel)",
          padding: 28,
          borderRadius: 12,
          width: 320,
          display: "flex",
          flexDirection: "column",
          gap: 14,
          boxShadow: "0 0 30px rgba(0,0,0,0.25)"
        }}
      >
        <h2 style={{ textAlign: "center", fontWeight: 700 }}>
          {isRegister ? "Create Account" : "Welcome Back"}
        </h2>

        <input
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={inputStyle}
        />

        {error && <div style={{ color: "var(--red)", fontSize: 14 }}>{error}</div>}

        <button type="submit" style={buttonStyle}>
          {isRegister ? "Register" : "Login"}
        </button>

        <div
          onClick={() => setIsRegister(!isRegister)}
          style={{
            textAlign: "center",
            cursor: "pointer",
            marginTop: 6,
            fontSize: 14,
            opacity: 0.8
          }}
        >
          {isRegister
            ? "Already have an account? Login"
            : "Don't have an account? Register"}
        </div>
      </form>
    </div>
  );
}

const inputStyle = {
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid var(--border)",
  background: "var(--bg)",
  color: "var(--text)"
};

const buttonStyle = {
  padding: "10px 14px",
  borderRadius: 8,
  background: "var(--accent)",
  border: "none",
  color: "white",
  fontWeight: 600,
  cursor: "pointer",
  transition: "0.2s"
};
