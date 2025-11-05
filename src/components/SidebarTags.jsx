// src/components/SidebarTags.jsx
import { useEffect, useState } from "react";
import authFetch from "../utils/authFetch";
import { colorFromTag } from "../utils/colorFromTag";

export default function SidebarTags({ selectedTagId, onSelect, isExpanded }) {
  const [tags, setTags] = useState(["all"]);

  async function loadTags() {
    try {
      const res = await authFetch("/api/entries/tags");
      const data = await res.json();
      const normalized = data.map(t => t.toLowerCase().trim());
      const unique = Array.from(new Set(["all", ...normalized]));
      setTags(unique);
    } catch (e) {
      console.error("Failed to load tags", e);
    }
  }

  useEffect(() => { loadTags(); }, []);
  useEffect(() => {
    if (sessionStorage.getItem("tags:refresh") === "1") {
      sessionStorage.removeItem("tags:refresh");
      loadTags();
    }
  });

  return (
    <div style={{ padding: "16px 12px", color: "var(--text)" }}>
      {tags.map((tag) => {
        const label = tag.charAt(0).toUpperCase() + tag.slice(1);
        const isActive = selectedTagId === tag;
        const color = colorFromTag(tag);

        return (
          <div
            key={tag}
            onClick={() => onSelect(tag)}
               style={{
  padding: "10px 14px",
  borderRadius: 8,
  marginBottom: 6,
  cursor: "pointer",
  fontSize: 15,
  userSelect: "none",
  transition: "0.2s ease",

  // ✅ SOLID fill when active
  backgroundColor: isActive ? color : "transparent",
  color: isActive ? "white" : "var(--text)",

  border: `1px solid ${isActive ? color : "transparent"}`,
  fontWeight: isActive ? 600 : 400,
  whiteSpace: "nowrap",
  overflow: "hidden",
}}
onMouseEnter={(e) => {
  if (!isActive) {
    e.currentTarget.style.backgroundColor = `${color}22`; // subtle hover tint
  }
}}
onMouseLeave={(e) => {
  if (!isActive) {
    e.currentTarget.style.backgroundColor = "transparent";
  }
}}
       >
            {isExpanded ? label : label[0]}
          </div>
        );
      })}
    </div>
  );
}
