"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { process, type Adjustments } from "@/lib/color";

const MAX_PREVIEW = 2048;
const DEFAULTS: Adjustments = { saturation: 100, gamma: 100, tone: 0 };

export default function Editor({
  file,
  onHome,
}: {
  file: File;
  onHome: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sourceRef = useRef<HTMLCanvasElement | null>(null);
  const originalRef = useRef<Uint8ClampedArray | null>(null);
  const dimsRef = useRef({ w: 0, h: 0 });
  const workerRef = useRef<Worker | null>(null);
  const urlRef = useRef<string | null>(null);
  const busyRef = useRef(false);
  const reqIdRef = useRef(0);
  const pendingRef = useRef<Adjustments | null>(null);
  const startedRef = useRef(false);

  const [fileName, setFileName] = useState("");
  const [showOriginal, setShowOriginal] = useState(false);
  const [adj, setAdj] = useState<Adjustments>(DEFAULTS);

  const pump = useCallback(() => {
    const worker = workerRef.current;
    const next = pendingRef.current;
    const original = originalRef.current;
    if (!worker || !next || !original || busyRef.current) return;
    busyRef.current = true;
    pendingRef.current = null;
    reqIdRef.current += 1;
    worker.postMessage({ id: reqIdRef.current, pixels: original, adj: next });
  }, []);

  useEffect(() => {
    const worker = new Worker(new URL("./cc.worker.ts", import.meta.url));
    worker.onmessage = (
      e: MessageEvent<{ id: number; out: Uint8ClampedArray<ArrayBuffer> }>
    ) => {
      busyRef.current = false;
      if (e.data.id !== reqIdRef.current) return;
      const { w, h } = dimsRef.current;
      if (e.data.out.length !== w * h * 4) return;
      const ctx = canvasRef.current?.getContext("2d");
      if (ctx && w > 0) {
        ctx.putImageData(new ImageData(e.data.out, w, h), 0, 0);
      }
      pump();
    };
    workerRef.current = worker;
    return () => worker.terminate();
  }, [pump]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const original = originalRef.current;
    if (!canvas || !original) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (showOriginal) {
      reqIdRef.current += 1;
      pendingRef.current = null;
      const { w, h } = dimsRef.current;
      ctx.putImageData(new ImageData(original.slice(), w, h), 0, 0);
      return;
    }

    pendingRef.current = adj;
    pump();
  }, [adj, showOriginal, pump]);

  useEffect(() => {
    return () => {
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    };
  }, []);

  const loadFile = useCallback((input: File) => {
    if (!input.type.startsWith("image/")) return;
    const url = URL.createObjectURL(input);
    const img = new Image();
    img.onload = () => {
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
      urlRef.current = url;

      const scale = Math.min(1, MAX_PREVIEW / Math.max(img.width, img.height));
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));

      const previewCanvas = document.createElement("canvas");
      previewCanvas.width = w;
      previewCanvas.height = h;
      const pctx = previewCanvas.getContext("2d", { willReadFrequently: true });
      if (!pctx) return;
      pctx.drawImage(img, 0, 0, w, h);
      const pixels = pctx.getImageData(0, 0, w, h).data;

      sourceRef.current = document.createElement("canvas");
      sourceRef.current.width = img.width;
      sourceRef.current.height = img.height;
      sourceRef.current.getContext("2d")!.drawImage(img, 0, 0);

      reqIdRef.current += 1;
      pendingRef.current = null;
      busyRef.current = false;
      originalRef.current = pixels.slice();
      dimsRef.current = { w, h };
      setFileName(input.name);
      setAdj(DEFAULTS);
      setShowOriginal(false);

      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (ctx) ctx.putImageData(new ImageData(pixels.slice(), w, h), 0, 0);
      }
    };
    img.src = url;
  }, []);

  useEffect(() => {
    if (startedRef.current || !file) return;
    startedRef.current = true;
    loadFile(file);
  }, [file, loadFile]);

  const download = useCallback(() => {
    const source = sourceRef.current;
    if (!source) return;
    const out = document.createElement("canvas");
    out.width = source.width;
    out.height = source.height;
    const ctx = out.getContext("2d")!;
    ctx.drawImage(source, 0, 0);
    const imageData = ctx.getImageData(0, 0, out.width, out.height);
    process(imageData.data, adj);
    ctx.putImageData(imageData, 0, 0);
    out.toBlob((blob) => {
      if (!blob) return;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `easy-cc-${fileName.replace(/\.[^.]+$/, "") || "image"}.png`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    }, "image/png");
  }, [adj, fileName]);

  return (
    <div className="flex min-h-dvh flex-col font-sans lg:h-dvh">
      <header className="sticky top-0 z-10 shrink-0 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-black/80">
        <div className="mx-auto flex h-14 w-full max-w-[1440px] items-center justify-between px-5">
          <button
            type="button"
            onClick={onHome}
            className="flex items-center gap-2 text-xl font-bold"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-5"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            [easy cc]
          </button>
          <span className="max-w-[45vw] truncate text-sm text-zinc-500 dark:text-zinc-400">
            {fileName}
          </span>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[1440px] min-h-0 flex-1 flex-col gap-4 px-4 py-3 lg:flex-row lg:gap-8 lg:px-6 lg:py-5">
        <section className="relative flex h-[56dvh] shrink-0 items-center justify-center lg:h-auto lg:min-h-0 lg:flex-1">
          <canvas
            ref={canvasRef}
            className="max-h-full max-w-full rounded-lg border border-zinc-200 bg-white object-contain shadow-sm dark:border-zinc-800 dark:bg-black"
          />
        </section>

        <aside className="flex w-full flex-col gap-5 pb-2 lg:w-[280px] lg:overflow-y-auto lg:pb-0">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Live preview capped at {MAX_PREVIEW}px — exports at full size.
          </p>

          <Control
            label="Saturation"
            display={`${adj.saturation}%`}
            min={0}
            max={200}
            value={adj.saturation}
            onChange={(saturation) => setAdj((a) => ({ ...a, saturation }))}
          />
          <Control
            label="Gamma"
            display={(adj.gamma / 100).toFixed(2)}
            min={20}
            max={300}
            value={adj.gamma}
            onChange={(gamma) => setAdj((a) => ({ ...a, gamma }))}
          />
          <Control
            label="Color tone"
            display={`${adj.tone > 0 ? "+" : ""}${adj.tone}`}
            min={-100}
            max={100}
            value={adj.tone}
            onChange={(tone) => setAdj((a) => ({ ...a, tone }))}
          />

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              aria-pressed={showOriginal}
              onClick={() => setShowOriginal((v) => !v)}
              className="min-h-11 rounded-lg border border-zinc-300 px-3 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
            >
              {showOriginal ? "Show edited" : "Show original"}
            </button>
            <button
              type="button"
              onClick={() => setAdj(DEFAULTS)}
              className="min-h-11 rounded-lg border border-zinc-300 px-3 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
            >
              Reset
            </button>
          </div>

          <button
            type="button"
            onClick={download}
            className="min-h-12 rounded-lg bg-zinc-900 px-4 text-base font-medium text-white hover:bg-zinc-700 dark:bg-white dark:text-black dark:hover:bg-zinc-300"
          >
            Download PNG
          </button>
        </aside>
      </main>
    </div>
  );
}

type ControlProps = {
  label: string;
  display: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
};

function Control({ label, display, min, max, value, onChange }: ControlProps) {
  return (
    <div>
      <div className="flex items-center justify-between text-base">
        <label className="font-medium">{label}</label>
        <span className="tabular-nums text-zinc-500 dark:text-zinc-400">
          {display}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 h-10 w-full cursor-pointer accent-zinc-900 dark:accent-zinc-100"
      />
    </div>
  );
}
