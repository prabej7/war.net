export const primary = '#03A791';
const tintColorDark = '#fff';
const station = "rgba(54, 241, 88, 0.5)";

export default {
  light: {
    text: '#0d1117',
    background: '#fff',
    primary: primary,
    tabIconDefault: '#ccc',
    tabIconSelected: primary,
    offBg: "#f5f5f5",
    red: "#ef4444",
    shadow: "0 0 150 0rgba(215, 212, 255, 0.53)",
    green: "#10b981",
    border: "rgb(233, 233, 233)",
    station
  },
  dark: {
    text: '#fff',
    background: '#141414',
    primary: primary,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
    offBg: "#171717",
    red: "#ef4444",
    shadow: "0 0 150 0 rgba(0, 0, 0, 0.7)",
    green: "#10b981",
    border: "rgb(233, 233, 233)",
    station
  },
};