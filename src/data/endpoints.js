// src/data/endpoints.js

export const ENDPOINT_GROUPS = [
  {
    id: "text",
    label: "Text utilities",
    description: "Helpers for words, slugs and display text.",
    endpoints: [
      {
        method: "POST",
        path: "/v1/text/scramble",
        name: "Word scrambler",
        description: "Scramble a word with multiple randomized variations.",
        badge: "Games • Bots",
      },
      {
        method: "POST",
        path: "/v1/text/slugify",
        name: "Slugify",
        description: "Turn titles into URL-safe slugs with sane defaults.",
        badge: "Content",
      },
      {
        method: "POST",
        path: "/v1/text/title-case",
        name: "Title case",
        description: "Normalize titles and headings for display.",
        badge: "Formatting",
      },
    ],
  },
  {
    id: "discord",
    label: "Discord helpers",
    description: "XP curves, cooldown checks and reward helpers for bots.",
    endpoints: [
      {
        method: "POST",
        path: "/v1/discord/xp/calc",
        name: "XP calculator",
        description: "Turn activity into XP using a balanced curve.",
        badge: "XP",
      },
      {
        method: "POST",
        path: "/v1/discord/xp/level-range",
        name: "Level range",
        description: "Figure out XP needed between levels.",
        badge: "XP",
      },
      {
        method: "POST",
        path: "/v1/discord/cooldowns/check",
        name: "Cooldown check",
        description: "Simple per-user cooldown logic for commands.",
        badge: "Cooldowns",
      },
    ],
  },
  {
    id: "fun",
    label: "Fun & random",
    description: "Tiny building blocks for games and playful apps.",
    endpoints: [
      {
        method: "GET",
        path: "/v1/fun/coin-flip",
        name: "Coin flip",
        description: "Heads or tails with an optional bias.",
        badge: "Games",
      },
      {
        method: "GET",
        path: "/v1/fun/random-number",
        name: "Random number",
        description: "Random integer between min/max with seed support.",
        badge: "Utility",
      },
      {
        method: "POST",
        path: "/v1/fun/pick-one",
        name: "Pick one",
        description: "Choose a random option from a list for you.",
        badge: "Utility",
      },
    ],
  },
];
