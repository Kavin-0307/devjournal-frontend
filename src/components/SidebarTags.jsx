// src/components/SidebarTags.jsx
import { useEffect, useState } from "react";
import authFetch from "../utils/authFetch";
import { colorFromTag } from "../utils/colorFromTag";

export default function SidebarTags({ selectedTagId, onSelect, isExpanded }) {
  const [tags, setTags] = useState(["all"]);

  const tagColors = {
    all: "#3B82F6",
    work: "#8B5CF6",
    personal: "#10B981",
    school: "#F59E0B",
  };

  async function loadTags() {
    try {
      const res = await authFetch("http://localhost:8080/entries/tags");
      const data = await res.json(); // array of strings
      const normalized = data.map(t => t.toLowerCase().trim());
      const unique = Array.from(new Set(["all", ...normalized]));
      setTags(unique);
    } catch (e) {
      console.error("Failed to load tags", e);
    }
  }

  useEffect(() => {
    loadTags();
  }, []);

  // lightweight refresh trigger after save
  useEffect(() => {
    if (sessionStorage.getItem("tags:refresh") === "1") {
      sessionStorage.removeItem("tags:refresh");
      loadTags();
    }
  });

  return (
    <div style={{ padding: "16px 12px", color: "white" }}>
      {tags.map((tag) => {
        const label = tag.charAt(0).toUpperCase() + tag.slice(1);
        const isActive = selectedTagId === tag;
        const color = tagColors[tag] ||colorFromTag(tag)
        ;

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
              transition: "0.18s",
              backgroundColor: isActive ? color : "transparent",
              color: isActive ? "var(--bg)" : "var(--text)",
              fontWeight: isActive ? 600 : 400,
              boxShadow: isActive ? `0 0 10px ${color}88` : "none",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = "var(--panel)"; }}
            onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = "transparent"; }}
          >
            {isExpanded ? label : label[0]}
          </div>
        );
      })}
    </div>
  );
}
