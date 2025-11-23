export const memes = [
  {
    id: "meme1",
    url: "/public/memes/meme1.jpg",
  },
  {
    id: "meme2",
    url: "/public/memes/meme2.jpg",
  }
];

export const getRandomMeme = () => {
  const idx = Math.floor(Math.random() * memes.length);
  return memes[idx];
};
