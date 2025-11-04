// AppLayout.jsx
import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import SidebarTags from "../components/SidebarTags";
import Navbar from "../components/Navbar";

export default function AppLayout() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedTagId, setSelectedTagId] = useState("all");
  const [search, setSearch] = useState("");

  function onSelectTag(id) {
    setSelectedTagId(id);
  }

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);
  function toggleTheme() {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: isExpanded ? "240px" : "64px",
          backgroundColor: "var(--bg2)",
          borderRight: "1px solid var(--border)",
          transition: "width 0.18s ease-out",
          display: "flex",
          flexDirection: "column",
        }}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div style={{ flex: 1, overflowY: "auto" }}>
          <SidebarTags
            selectedTagId={selectedTagId}
            onSelect={onSelectTag}
            isExpanded={isExpanded}
          />
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div
          style={{
            height: "64px",
            padding: "12px 20px",
            backgroundColor: "var(--bg2)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <Navbar
            theme={theme}
            toggleTheme={toggleTheme}
            search={search}
            setSearch={setSearch}
          />
        </div>

        <section style={{ flex: 1, paddingTop:"16px",backgroundColor: "var(--bg)" }}>
          {/* Single, final Outlet that provides context */}
          <Outlet context={{ selectedTagId, search }} />
        </section>
      </main>
    </div>
  );
}
