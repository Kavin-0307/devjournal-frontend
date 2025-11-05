// src/pages/EntryEditorPage.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import authFetch from "../utils/authFetch";

export default function EntryEditorPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [entryTitle, setEntryTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]); 
  const [newTag, setNewTag] = useState("");


  useEffect(() => {
    if (!id) {
      setEntryTitle("");
      setContent("");
      setTags([]);
      setNewTag("");
    }
  }, [id]);

  
  useEffect(() => {
    if (!id) return;
    (async () => {
      const res = await authFetch(`/api/entries/${id}`);
      if (!res.ok) return alert("Failed to load entry");
      const data = await res.json();
      setEntryTitle(data.entryTitle || "");
      setContent(data.content || "");
      setTags(Array.isArray(data.tags) ? data.tags : []);
    })();
  }, [id]);

  function addTagFromInput() {
    const t = newTag.toLowerCase().trim();
    if (!t) return;
    setTags(prev => Array.from(new Set([...prev, t])));  
    setNewTag("");
  }

  function removeTag(tag) {
    setTags(prev => prev.filter(x => x !== tag));
  }

  async function handleSave() {
    const pending = newTag.toLowerCase().trim();
    const finalTags = Array.from(new Set([
      ...tags,
      ...(pending ? [pending] : [])
    ])).filter(Boolean);

    const payload = {
      entryTitle,
      content,
      tags: finalTags
    };

    const url = id
  ? `/api/entries/${id}`
  : `/api/entries/journal`;

    const method = id ? "PUT" : "POST";

    const res = await authFetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      sessionStorage.setItem("tags:refresh", "1");
      navigate("/");
    } else {
      alert("Failed to save entry.");
    }
  }

  return (
    <div style={{ padding: 24, color: "white" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>
        {id ? "Edit Entry" : "New Journal Entry"}
      </h1>

      <input
        value={entryTitle}
        onChange={(e) => setEntryTitle(e.target.value)}
        placeholder="Title"
        style={{
          width: "100%", padding: 12, borderRadius: 8,
          background: "#1F2937", border: "1px solid #374151", color: "white",
          marginBottom: 12
        }}
      />

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your thoughts…"
        style={{
          width: "100%", height: 240, padding: 12, borderRadius: 8,
          background: "#1F2937", border: "1px solid #374151", color: "white",
          marginBottom: 12, resize: "vertical"
        }}
      />

      <div style={{ marginBottom: 8, fontWeight: 600 }}>Tags</div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
        {tags.map(tag => (
          <span
            key={tag}
            style={{
              padding: "6px 10px", borderRadius: 9999, fontSize: 13,
              border: "1px solid #374151", background: "#0B1220", color: "#E5E7EB",
              display: "inline-flex", alignItems: "center", gap: 8
            }}
          >
            {tag}
            <button
              onClick={() => removeTag(tag)}
              style={{ background: "transparent", border: "none", color: "#9CA3AF", cursor: "pointer" }}
            >
              ×
            </button>
          </span>
        ))}
      </div>

      <input
        value={newTag}
        onChange={(e) => setNewTag(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTagFromInput(); } }}
        placeholder="Add new tag and press Enter…"
        style={{
          width: "100%", padding: 10, borderRadius: 8, marginBottom: 16,
          background: "#1F2937", border: "1px solid #374151", color: "white"
        }}
      />

      <button
        onClick={handleSave}
        style={{
          padding: "10px 14px", borderRadius: 8, background: "#22C55E",
          color: "black", fontWeight: 600, border: "none", cursor: "pointer"
        }}
      >
        Save Entry
      </button>
    </div>
  );
}
