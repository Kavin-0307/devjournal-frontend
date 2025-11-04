// src/components/Navbar.jsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";
export default function Navbar({ toggleTheme, theme ,setSearch}) {
  const navigate = useNavigate();
 const [open, setOpen] = useState(false);

  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        height: "64px",
        borderBottom: "1px solid var(--border)",
        backgroundColor: "var(--bg2)",
        color: "var(--text)",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      {/* Left: Logo + App Name */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span
          style={{
            fontSize: 20,
            color: "var(--accent)",
            textShadow: "0 0 6px var(--accent)",
          }}
        >
          ✧
        </span>
        <span
          style={{
            fontWeight: 600,
            letterSpacing: 0.3,
            fontSize: 18,
          }}
        >
          DevJournal
        </span>
      </div>

      {/* Middle: Global Search Bar */}
      <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
        <input
          type="text"
          placeholder="Search entries..."
          onChange={(e) => setSearch(e.target.value)}

          style={{
            width: "50%",
            padding: "8px 12px",
            borderRadius: 8,
            border: "1px solid var(--border)",
            backgroundColor: "var(--panel)",
            color: "var(--text)",
            outline: "none",
            fontSize: 14,
            transition: "0.2s border-color",
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
        />
      </div>

      {/* Right: Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          style={{
            background: "transparent",
            border: "1px solid var(--border)",
            color: "var(--text)",
            padding: "6px 10px",
            borderRadius: 6,
            cursor: "pointer",
            fontSize: 13,
          }}
        >
          {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
        </button>

  <button
  onClick={async () => {
    const res = await fetch("http://localhost:8080/entries/export/all", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "journal_export.zip";
    link.click();
  }}
  style={{
    background: "transparent",
    border: "1px solid var(--border)",
    color: "var(--text)",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "0.2s",
  }}
  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
>
  📦 Export
</button>

<div style={{ position: "relative" }}>
  <div
    onClick={() => setOpen(!open)}
    style={{
      width: 32,
      height: 32,
      borderRadius: "50%",
      background: "var(--accent)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontWeight: 600,
      cursor: "pointer",
      userSelect: "none"
    }}
  >
    A
  </div>

  {open && (
    <div
      style={{
        position: "absolute",
        top: "40px",
        right: 0,
        background: "var(--bg2)",
        border: "1px solid var(--border)",
        borderRadius: 8,
        padding: "8px 0",
        boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
        animation: "fadeIn 0.15s ease-out"
      }}
    >
      <div
        onClick={() => alert("Profile page coming soon")}
        style={{
          padding: "8px 16px",
          cursor: "pointer"
        }}
      >
        Profile
      </div>
      <div
        onClick={logout}
        style={{
          padding: "8px 16px",
          color: "#EF4444",
          cursor: "pointer"
        }}
      >
        Logout
      </div>
    </div>
  )}
</div>

      </div>
    </div>
  );
}
