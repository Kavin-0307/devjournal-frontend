// utils/colorFromTag.js
export function colorFromTag(tag) {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }

  const theme = document.documentElement.getAttribute("data-theme");
  const isDark = theme === "dark";

  const lightHueStart = 10;   
  const lightHueEnd   = 55;   


  const darkHueStart = 220;   
  const darkHueEnd   = 285;   

  const hueStart = isDark ? darkHueStart : lightHueStart;
  const hueEnd   = isDark ? darkHueEnd : lightHueEnd;

  const hue = hueStart + (Math.abs(hash) % (hueEnd - hueStart));

  const saturation = isDark ? 72 : 85;
  const lightness  = isDark ? 62 : 42;

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
