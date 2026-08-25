import { process, type Adjustments } from "../lib/color";

const scope = self as unknown as {
  onmessage: ((e: MessageEvent<{
    id: number;
    pixels: Uint8ClampedArray;
    adj: Adjustments;
  }>) => void) | null;
  postMessage: (msg: { id: number; out: Uint8ClampedArray }) => void;
};

scope.onmessage = (e) => {
  const { id, pixels, adj } = e.data;
  process(pixels, adj);
  scope.postMessage({ id, out: pixels });
};

export {};
