/**
 * Esteticar custom map pin — works with Leaflet (divIcon) and Google Maps (SVG data URL)
 * Shape: teardrop like Didi/Google Maps, aqua-navy gradient, water-drop icon inside
 */

export type PinState = "normal" | "selected" | "edit" | "new" | "deleting";

function pinColors(state: PinState) {
  switch (state) {
    case "selected":
      return { top: "#03045e", mid: "#0077b6", bot: "#00b4d8", border: "#48cae4", bw: 2.5, glow: "rgba(72,202,228,0.45)" };
    case "edit":
      return { top: "#0c4a6e", mid: "#0369a1", bot: "#38bdf8", border: "rgba(255,255,255,0.6)", bw: 1.5, glow: "none" };
    case "new":
      return { top: "#14532d", mid: "#15803d", bot: "#22c55e", border: "#86efac", bw: 2, glow: "rgba(34,197,94,0.4)" };
    case "deleting":
      return { top: "#7f1d1d", mid: "#b91c1c", bot: "#ef4444", border: "#fca5a5", bw: 2, glow: "rgba(239,68,68,0.4)" };
    default:
      return { top: "#03045e", mid: "#0077b6", bot: "#48cae4", border: "rgba(255,255,255,0.45)", bw: 1.5, glow: "none" };
  }
}

/** Returns an SVG string for use in Leaflet divIcon html or as a data: URL */
export function makePinSvg(state: PinState = "normal", size = 44): string {
  const c = pinColors(state);
  const w = size;
  const h = Math.round(size * 1.35);
  const cx = w / 2;
  const cy = w / 2;
  const r = w * 0.46;

  // Icon inside: water drop for normal/selected, + for new, X for deleting, pencil for edit
  const icon = state === "new"
    ? `<line x1="${cx}" y1="${cy - 7}" x2="${cx}" y2="${cy + 7}" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
       <line x1="${cx - 7}" y1="${cy}" x2="${cx + 7}" y2="${cy}" stroke="white" stroke-width="2.5" stroke-linecap="round"/>`
    : state === "deleting"
    ? `<line x1="${cx - 6}" y1="${cy - 6}" x2="${cx + 6}" y2="${cy + 6}" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
       <line x1="${cx + 6}" y1="${cy - 6}" x2="${cx - 6}" y2="${cy + 6}" stroke="white" stroke-width="2.5" stroke-linecap="round"/>`
    : state === "edit"
    ? `<path d="M${cx - 4} ${cy + 5} L${cx - 6} ${cy + 8} L${cx - 3} ${cy + 7} Z" fill="white"/>
       <rect x="${cx - 3}" y="${cy - 6}" width="5" height="10" rx="2" transform="rotate(-45 ${cx} ${cy})" fill="white" opacity="0.9"/>`
    // water drop icon (default)
    : `<path d="M${cx} ${cy - 9} C${cx} ${cy - 9} ${cx - 7} ${cy - 1} ${cx - 7} ${cy + 3} C${cx - 7} ${cy + 7} ${cx - 3.5} ${cy + 10} ${cx} ${cy + 10} C${cx + 3.5} ${cy + 10} ${cx + 7} ${cy + 7} ${cx + 7} ${cy + 3} C${cx + 7} ${cy - 1} ${cx} ${cy - 9} ${cx} ${cy - 9}Z" fill="white" opacity="0.95"/>
      <path d="M${cx} ${cy - 9} C${cx} ${cy - 9} ${cx - 5} ${cy - 3} ${cx - 6} ${cy + 2} C${cx - 5} ${cy} ${cx - 3} ${cy - 2} ${cx} ${cy - 9}Z" fill="rgba(72,202,228,0.6)"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="pg${state}" x1="0.2" y1="0" x2="0.8" y2="1">
      <stop offset="0%" stop-color="${c.top}"/>
      <stop offset="50%" stop-color="${c.mid}"/>
      <stop offset="100%" stop-color="${c.bot}"/>
    </linearGradient>
    <filter id="ps${state}" x="-30%" y="-15%" width="160%" height="160%">
      <feDropShadow dx="0" dy="3" stdDeviation="3.5" flood-color="rgba(3,4,94,0.45)"/>
    </filter>
    ${c.glow !== "none" ? `<filter id="glow${state}"><feGaussianBlur stdDeviation="2.5" result="blur"/><feComposite in="SourceGraphic" in2="blur" operator="over"/></filter>` : ""}
  </defs>
  <!-- Teardrop pin body -->
  <path d="M${cx} 2 C${cx - r * 0.7} 2 ${2} ${cy - r * 0.7} 2 ${cy} C2 ${cy + r * 1.1} ${cx} ${h - 2} ${cx} ${h - 2} C${cx} ${h - 2} ${w - 2} ${cy + r * 1.1} ${w - 2} ${cy} C${w - 2} ${cy - r * 0.7} ${cx + r * 0.7} 2 ${cx} 2Z"
    fill="url(#pg${state})" filter="url(#ps${state})" stroke="${c.border}" stroke-width="${c.bw}"/>
  <!-- Soft inner circle -->
  <circle cx="${cx}" cy="${cy}" r="${r * 0.65}" fill="rgba(255,255,255,0.10)" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
  <!-- Icon -->
  ${icon}
</svg>`;
}

/** Returns a base64 data: URL of the pin SVG — use as Google Maps icon url */
export function makePinUrl(state: PinState = "normal", size = 44): string {
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(makePinSvg(state, size));
}

/** Returns Leaflet DivIcon options */
export function makeDivIcon(
  L: any,
  state: PinState = "normal",
  size = 44
): any {
  const h = Math.round(size * 1.35);
  return L.divIcon({
    className: "",
    html: makePinSvg(state, size),
    iconSize: [size, h],
    iconAnchor: [size / 2, h - 2],
    popupAnchor: [0, -h],
  });
}
