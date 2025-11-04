export function colorFromTag(tag) {
  // Convert string → number
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Use hash to generate HSL hue (0-360)
  const hue = Math.abs(hash) % 360;

  // Vibrant color + readable in dark UI
  return `hsl(${hue}, 70%, 60%)`;
}
