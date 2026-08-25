export type Adjustments = { saturation: number; gamma: number; tone: number };

export function clamp255(v: number) {
  return v < 0 ? 0 : v > 255 ? 255 : v;
}

export function process(data: Uint8ClampedArray, adj: Adjustments) {
  const inv = 1 / (adj.gamma / 100);
  const lut = new Uint8ClampedArray(256);
  for (let i = 0; i < 256; i++) {
    lut[i] = Math.round(255 * Math.pow(i / 255, inv));
  }
  const s = adj.saturation / 100;
  const shift = (adj.tone / 100) * 45;

  for (let i = 0; i < data.length; i += 4) {
    const r = lut[clamp255(data[i] + shift)];
    const g = lut[data[i + 1]];
    const b = lut[clamp255(data[i + 2] - shift)];
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    data[i] = clamp255(lum + (r - lum) * s);
    data[i + 1] = clamp255(lum + (g - lum) * s);
    data[i + 2] = clamp255(lum + (b - lum) * s);
  }
}
