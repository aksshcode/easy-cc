export type Adjustments = { saturation: number; gamma: number; tone: number };

export const DEFAULTS: Adjustments = { saturation: 100, gamma: 100, tone: 0 };

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
  const shift = Math.round((adj.tone / 100) * 45);
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

// Standalone worker payload. Mirrors process() above EXACTLY — kept as a plain
// string because Turbopack's dev worker bootstrap corrupts typed-array messages
// after the first one; a blob worker is immune. If you change process(), change
// this to match, or preview and export will diverge.
export const WORKER_JS = `
function clamp255(v){return v<0?0:v>255?255:v}
self.onmessage=function(e){
  var d=e.data.pixels,a=e.data.adj,i;
  var inv=1/(a.gamma/100),lut=new Uint8ClampedArray(256);
  for(i=0;i<256;i++)lut[i]=Math.round(255*Math.pow(i/255,inv));
  var s=a.saturation/100,shift=Math.round((a.tone/100)*45);
  for(i=0;i<d.length;i+=4){
    var r=lut[clamp255(d[i]+shift)],g=lut[d[i+1]],b=lut[clamp255(d[i+2]-shift)];
    var lum=0.2126*r+0.7152*g+0.0722*b;
    d[i]=clamp255(lum+(r-lum)*s);d[i+1]=clamp255(lum+(g-lum)*s);d[i+2]=clamp255(lum+(b-lum)*s);
  }
  self.postMessage({id:e.data.id,out:d},[d.buffer]);
};`;
