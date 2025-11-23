// client/src/utils/memes.js

// מערך הממים המקומיים
export const memes = [
  {
    id: "meme1",
    url: "/memes/meme1.jpg",
    caption: "When you buy the dip and it keeps dipping"
  },
  {
    id: "meme2",
    url: "/memes/meme2.jpg",
    caption: "When the market crashes but you already accepted your fate"
  }
];

// מחזיר מם לפי id
export const getMemeById = id => {
  return memes.find(m => m.id === id);
};

// אם תרצי להשתמש גם באקראי בעתיד
export const getRandomMeme = () => {
  const idx = Math.floor(Math.random() * memes.length);
  return memes[idx];
};
