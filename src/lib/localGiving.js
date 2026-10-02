// Device-local storage for "My Giving" history and saved stories (no login needed).
const read = (k) => { try { return JSON.parse(localStorage.getItem(k)) || []; } catch { return []; } };
const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));

export const getGifts = () => read("rts_gifts");
export const addGift = (gift) => write("rts_gifts", [{ ...gift, date: new Date().toISOString() }, ...getGifts()]);

export const getSavedStories = () => read("rts_saved_stories");
export const toggleSavedStory = (id) => {
  const s = getSavedStories();
  const next = s.includes(id) ? s.filter((x) => x !== id) : [...s, id];
  write("rts_saved_stories", next);
  return next;
};