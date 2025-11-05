// JournalListPage.jsx
import { useEffect, useState } from "react";
import authFetch from "../utils/authFetch";
import { useNavigate, useOutletContext } from "react-router-dom";
import { colorFromTag } from "../utils/colorFromTag";

export default function JournalListPage() {
  const navigate = useNavigate();
  const { selectedTagId, search } = useOutletContext();
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    loadEntries();
  }, [selectedTagId]);

  async function loadEntries() {
    try {
      const res = await authFetch("/api/entries/journal");
      const data = await res.json();
      const list = Array.isArray(data.entries) ? data.entries : [];

      const latestOnly = Object.values(
        list.reduce((acc, entry) => {
          if (
            !acc[entry.entryTitle] ||
            new Date(entry.updatedAt) > new Date(acc[entry.entryTitle].updatedAt)
          ) {
            acc[entry.entryTitle] = entry;
          }
          return acc;
        }, {})
      ).sort((a, b) => (b.isPinned === true) - (a.isPinned === true));

      setEntries(latestOnly);
    } catch (err) {
      console.error("Load error:", err);
    }
  }

  async function togglePin(id) {
    await authFetch(`/api/entries/${id}/pin`, { method: "PUT" });
    loadEntries();
  }

  async function deleteEntry(id) {
    if (!confirm("Delete this entry?")) return;
    await authFetch(`/api/entries/${id}`, { method: "DELETE" });
    loadEntries();
  }
  
function withAlpha(hsl, alpha) {
 
  const m = hsl.match(/hsl\(\s*([\d.]+)[,\s]+([\d.]+)%[,\s]+([\d.]+)%\s*\)/i);
  if (m) {
    const [_, h, s, l] = m;
    return `hsl(${h} ${s}% ${l}% / ${alpha})`;
  }
 return hsl;
}



  return (
    <div style={{ padding: 32, color: "var(--text)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>Your Journal Entries</h1>

        <button
          onClick={() => navigate("/journals/new")}
          style={{
            padding: "8px 14px",
            backgroundColor: "transparent",
            borderRadius: 8,
            border: "1px solid var(--accent)",
            color: "var(--text)",
            fontWeight: 500,
          }}
        >
          + New Entry
        </button>
      </div>

      <ul style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 16 }}>
        {entries
          .filter((e) => {
            if (selectedTagId !== "all" && !e.tags?.includes(selectedTagId)) return false;
            if (!search) return true;
            const q = search.toLowerCase();
            return (
              e.entryTitle.toLowerCase().includes(q) ||
              e.content.toLowerCase().includes(q)
            );
          })
          .map((entry) => {
            const tag = entry.tags?.[0];
            const color = tag ? colorFromTag(tag) : "#9CA3AF";

            return (
<li
  key={entry.id}
  style={{
    border: `1px solid ${color}`,     // simple line, always visible
    backgroundColor: "var(--panel)",
    borderRadius: 12,
    padding: 20,
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "none",                 // no glow at rest
    transition: "0.25s ease",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = "translateY(-2px)";
    e.currentTarget.style.boxShadow = `0 0 12px ${color}44`; // glow only on hover
    e.currentTarget.style.borderColor = color;               // keep the same line color
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "none";
    e.currentTarget.style.boxShadow = "none";                // remove glow
    e.currentTarget.style.borderColor = color;               // keep the same line color
  }}
>

                <div>
                  <h2 style={{ fontSize: 20, fontWeight: entry.isPinned ? 800 : 600, color }}>
                    {entry.entryTitle}
                  </h2>

                  <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                    {entry.tags?.map((t) => {
                      const pill = colorFromTag(t);
                      return (
                      <span
                        key={t}
                        style={{
                          padding: "4px 10px",
                          borderRadius: "9999px",
                          fontSize: 12,
                          fontWeight: 500,

                          // ✅ SOLID FILL
                          backgroundColor: pill,
                          color: "white",
                          border: "none",

                          transition: "0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.opacity = 0.85;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.opacity = 1;
                        }}
                      >
                        {t}
                      </span>


                      );
                    })}
                  </div>

                  <p style={{ color: "var(--text-dim)", marginTop: 8 }}>
                    {entry.content.length > 120
                      ? entry.content.substring(0, 120) + "…"
                      : entry.content}
                  </p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span
                    style={{
                      fontSize: 22,
                      cursor: "pointer",
                      color: entry.isPinned ? "#FACC15" : "#6B7280",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePin(entry.id);
                    }}
                  >
                    {entry.isPinned ? "★" : "☆"}
                  </span>

                  <span
                    style={{ fontSize: 18, cursor: "pointer", color: "#EF4444" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteEntry(entry.id);
                    }}
                  >
                    🗑
                  </span>
                </div>
              </li>
            );
          })}
      </ul>
    </div>
  );
}
