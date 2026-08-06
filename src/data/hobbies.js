import icedAmericano from "../assets/images/hobbies/iced-americano.png";
import letterboxdSticker from "../assets/images/hobbies/letterboxd.png";
import booksSticker from "../assets/images/hobbies/books.jpg";
import duolingoSticker from "../assets/images/hobbies/duolingo.png";
import minecraftCover from "../assets/images/games/minecraft.png";
import valorantCover from "../assets/images/games/valorant.png";
import robloxCover from "../assets/images/games/roblox.png";
import { duolingoProfileUrl } from "./duolingo";

// Each card can optionally be interactive — set `openWindow` to a window id
// (registered in windowRegistry.js) to make the whole card open that window
// instead of just displaying text.
export const hobbyCards = [
  {
    id: "coffee",
    title: "Favorite Coffee",
    sticker: icedAmericano,
    content: "Iced Americano",
    minimal: true,
  },
  {
    id: "movies",
    title: "Movies",
    sticker: letterboxdSticker,
    boxed: true,
    content: "Story-driven films, logged on Letterboxd.",
    openWindow: "letterboxd",
  },
  {
    id: "gaming",
    title: "Gaming",
    stickerGroup: [minecraftCover, valorantCover, robloxCover],
    content: "Adventure, competitive, and relaxing games.",
    openWindow: "games",
  },
  {
    id: "books",
    title: "Books",
    sticker: booksSticker,
    boxed: true,
    content: "A running list of what I've read.",
    openWindow: "books",
  },
  {
    id: "duolingo",
    title: "Duolingo",
    sticker: duolingoSticker,
    boxed: true,
    content: "Learning languages, one streak at a time.",
    externalUrl: duolingoProfileUrl,
  },
  {
    id: "photography",
    title: "Photography",
    content: "Capturing small details.",
    openWindow: "photography",
    // TODO: add a custom sticker for this card
  },
  {
    id: "favorite-time",
    title: "Favorite Time",
    content: "After 12 AM. Winter moments.",
    variant: "night",
    // TODO: add a custom sticker for this card
  },
];

export const aboutMeFacts = [
  "I notice details other people usually miss.",
  "I enjoy exploring software from both a user's and a developer's perspective.",
  "I can spend hours perfecting tiny UI details.",
  "Coffee + headphones = perfect focus.",
  "I'm always learning something new.",
];
