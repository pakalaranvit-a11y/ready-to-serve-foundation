import React, { useState } from "react";
import BackHeader from "@/components/charity/BackHeader";
import StoryFeedCard from "@/components/charity/StoryFeedCard";
import { STORIES } from "@/lib/storiesData";
import { getSavedStories, toggleSavedStory } from "@/lib/localGiving";

export default function StoriesPage() {
  const [saved, setSaved] = useState(getSavedStories);
  const [onlySaved, setOnlySaved] = useState(false);
  const list = onlySaved ? STORIES.filter((s) => saved.includes(s.id)) : STORIES;

  return (
    <div className="charity-site">
      <BackHeader title="Stories" />
      <main className="wrap" style={{ maxWidth: 640, paddingBlock: "1.2rem 2rem" }}>
        <div className="seg">
          <button type="button" className={!onlySaved ? "is-active" : ""} onClick={() => setOnlySaved(false)}>All stories</button>
          <button type="button" className={onlySaved ? "is-active" : ""} onClick={() => setOnlySaved(true)}>Saved ({saved.length})</button>
        </div>
        {list.length === 0 && <p className="donorwall-empty">No saved stories yet. Tap "Save" on a story to keep it here.</p>}
        {list.map((s) => (
          <StoryFeedCard key={s.id} story={s} saved={saved.includes(s.id)} onToggleSave={() => setSaved(toggleSavedStory(s.id))} />
        ))}
      </main>
    </div>
  );
}