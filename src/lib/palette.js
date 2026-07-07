// Validated categorical palette (dataviz six-checks, light surface #ffffff).
// Slots are assigned in this fixed order and never cycled.
export const SERIES = [
  "#2a78d6", // 1 blue
  "#1baf7a", // 2 aqua
  "#eda100", // 3 yellow
  "#008300", // 4 green
  "#4a3aa7", // 5 violet
  "#e34948", // 6 red
  "#e87ba4", // 7 magenta
  "#eb6834", // 8 orange
];

// Sequential blue ramp (light -> dark) for magnitude encoding (choropleth).
export const SEQUENTIAL = ["#cde2fb", "#9ec5f4", "#6da7ec", "#3987e5", "#256abf", "#184f95", "#0d366b"];

// Status colors: reserved meaning, always paired with a text label.
export const STATUS = {
  good: "#0ca30c",
  critical: "#d03b3b",
};

// Chart chrome / ink.
export const INK = {
  primary: "#0b0b0b",
  secondary: "#52514e",
  muted: "#898781",
  grid: "#e1e0d9",
  baseline: "#c3c2b7",
  surface: "#ffffff",
  empty: "#f0efec",
};
