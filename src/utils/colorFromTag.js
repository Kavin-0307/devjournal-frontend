// utils/colorFromTag.js
export function colorFromTag(tag) {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }

  // detect actual current theme
  const theme = document.documentElement.getAttribute("data-theme");
  const isDark = theme === "dark";

  // 🎨 Warm, saturated hues for LIGHT MODE (red → orange → amber → yellow)
  const lightHueStart = 10;   // deep orange / vermillion
  const lightHueEnd   = 55;   // warm golden yellow

  // 🎨 Cool neon hues for DARK MODE (blue → indigo → violet)
  const darkHueStart = 220;   // deep blue
  const darkHueEnd   = 285;   // purple/indigo

  const hueStart = isDark ? darkHueStart : lightHueStart;
  const hueEnd   = isDark ? darkHueEnd : lightHueEnd;

  const hue = hueStart + (Math.abs(hash) % (hueEnd - hueStart));

  // 🌈 Saturation & lightness tuned for bold color presence
  const saturation = isDark ? 72 : 85;   // higher saturation = richer colors
  const lightness  = isDark ? 62 : 42;   // lower lightness = deeper tone

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
