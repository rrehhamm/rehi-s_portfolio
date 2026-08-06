import minecraftCover from "../assets/images/games/minecraft.png";
import valorantCover from "../assets/images/games/valorant.png";
import robloxCover from "../assets/images/games/roblox.png";

// Editable list — nothing here is hardcoded into the window component.
// `profileUrl: null` means there's no reliable public profile page for that
// username yet, so the UI shows the tag as plain text instead of a fake link.
export const games = [
  {
    id: "minecraft",
    title: "Minecraft (Java Edition)",
    cover: minecraftCover,
    username: "rrehhii",
    profileUrl: null, // TODO: add a real profile/server link if you have one
    platform: "Minecraft",
  },
  {
    id: "valorant",
    title: "VALORANT",
    cover: valorantCover,
    username: "rehi#444",
    profileUrl: null, // TODO: add a real tracker/profile link if you have one
    platform: "Riot Games",
  },
  {
    id: "roblox",
    title: "Roblox",
    cover: robloxCover,
    username: "rrehhii",
    profileUrl: "https://www.roblox.com/users/profile?username=rrehhii",
    platform: "Roblox",
  },
];
