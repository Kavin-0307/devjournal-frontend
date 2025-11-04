// JournalListPage.jsx
import { useEffect, useState } from "react";
import authFetch from "../utils/authFetch";
import { useNavigate, useOutletContext } from "react-router-dom";
import { colorFromTag } from "../utils/colorFromTag";

export default function JournalListPage() {
  const navigate = useNavigate();
  const { selectedTagId, search } = useOutletContext(); // ✅ shared search
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    loadEntries();
  }, [selectedTagId]);

  async function loadEntries() {
    try {
      const res = await authFetch("http://localhost:8080/entries/journal");
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

  async function togglePin(entryId) {
    await authFetch(`http://localhost:8080/entries/${entryId}/pin`, { method: "PUT" });
    loadEntries();
  }

  async function deleteEntry(entryId) {
    if (!confirm("Delete this entry?")) return;
    await authFetch(`http://localhost:8080/entries/${entryId}`, { method: "DELETE" });
    loadEntries();
  }

  return (
    <div style={{ padding: "32px", color: "var(--text)" }}>
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
          .filter((entry) => {
            if (selectedTagId !== "all" && !entry.tags?.includes(selectedTagId)) return false;
            if (!search) return true;
            const q = search.toLowerCase();
            return (
              entry.entryTitle.toLowerCase().includes(q) ||
              entry.content.toLowerCase().includes(q)
            );
          })
          .map((entry) => {
            const tag = entry.tags?.[0];
            const color = tag ? colorFromTag(tag) : "#9CA3AF";

            return (
              <li
                key={entry.id}
                style={{
                  border: `1px solid ${color}33`,
                  backgroundColor: "var(--panel)",
                  borderRadius: 8,
                  padding: 16,
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  transition: "0.18s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = `0 4px 14px ${color}33`;
                  e.currentTarget.style.borderColor = color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0px)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = `${color}33`;
                }}
                onClick={() => navigate(`/journals/${entry.id}/edit`)}
              >
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: entry.isPinned ? 800 : 600, color }}>
                    {entry.entryTitle}
                  </h2>

                  <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                    {entry.tags?.map((t) => {
                      const pill = colorFromTag(t);
                      return (
                        <span
                          key={t}
                          style={{
                            padding: "3px 8px",
                            borderRadius: 12,
                            backgroundColor: `${pill}22`,
                            color: pill,
                            fontSize: 12,
                          }}
                        >
                          {t}
                        </span>
                      );
                    })}
                  </div>

                  <p style={{ color: "var(--text-dim)", marginTop: 6 }}>
                    {entry.content.length > 120
                      ? entry.content.substring(0, 120) + "…"
                      : entry.content}
                  </p>
                </div>

                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
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
