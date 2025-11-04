import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        alert("Invalid login");
        return;
      }

      const data = await res.json();

      // ✅ Save token so authFetch can use it later
      localStorage.setItem("token", data.token);
      console.log("Stored Token:", localStorage.getItem("token"));
      // ✅ Go to journal list
      navigate("/");
    }  catch (err) {
  console.error("Login error:", err);  // <- use it
  alert("Login failed");
}

  }

  return (
    <div className="text-center mt-20 text-white">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          className="p-2 border rounded w-64 bg-gray-800"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <br />
        <input
          className="p-2 border rounded w-64 bg-gray-800"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <br />
        <button className="px-4 py-2 bg-blue-600 rounded">Login</button>
      </form>
    </div>
  );
}
