import React from "react";
import { Bookmark, Share2 } from "lucide-react";

export default function StoryFeedCard({ story, saved, onToggleSave }) {
  const share = async () => {
    const url = story.link || window.location.origin + "/stories";
    if (navigator.share) {
      await navigator.share({ title: story.title, text: story.body, url }).catch(() => {});
    } else {
      await navigator.clipboard?.writeText(url);
      alert("Link copied");
    }
  };

  return (
    <article className="story" style={{ marginBottom: "1.4rem" }}>
      <img src={story.image} alt={story.alt} style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover" }} />
      <div style={{ padding: "1rem 1.1rem" }}>
        <h3 style={{ fontSize: "1.2rem", marginBottom: ".4rem" }}>{story.title}</h3>
        <p style={{ color: "var(--ink-soft)", margin: "0 0 .8rem" }}>{story.body}</p>
        <div style={{ display: "flex", gap: ".5rem" }}>
          <button type="button" className="btn btn--ghost btn--sm" style={{ minHeight: 44 }} onClick={onToggleSave} aria-pressed={saved}>
            <Bookmark size={18} fill={saved ? "currentColor" : "none"} /> {saved ? "Saved" : "Save"}
          </button>
          <button type="button" className="btn btn--ghost btn--sm" style={{ minHeight: 44 }} onClick={share}>
            <Share2 size={18} /> Share
          </button>
          {story.link && (
            <a className="btn btn--ghost btn--sm" style={{ minHeight: 44 }} href={story.link} target="_blank" rel="noopener">Watch</a>
          )}
        </div>
      </div>
    </article>
  );
}