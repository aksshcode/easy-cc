"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const features = [
  {
    title: "Saturation",
    description:
      "From muted to vivid — push color as far as you want without wrecking skin tones.",
  },
  {
    title: "Gamma",
    description:
      "Lift shadows or tame highlights to recover detail your camera buried.",
  },
  {
    title: "Color tone",
    description:
      "Warm it up for golden hour, cool it down for that clean, modern look.",
  },
];

export default function Landing({ onFile }: { onFile: (file: File) => void }) {
  const [dragging, setDragging] = useState(false);
  const dragDepth = useRef(0);

  const accept = useCallback(
    (file?: File | null) => {
      if (file && file.type.startsWith("image/")) onFile(file);
    },
    [onFile]
  );

  useEffect(() => {
    const onOver = (e: DragEvent) => {
      e.preventDefault();
      setDragging(true);
    };
    const onLeave = (e: DragEvent) => {
      e.preventDefault();
      if (e.relatedTarget === null) setDragging(false);
    };
    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      dragDepth.current = 0;
      setDragging(false);
      accept(e.dataTransfer?.files?.[0]);
    };
    window.addEventListener("dragover", onOver);
    window.addEventListener("dragleave", onLeave);
    window.addEventListener("drop", onDrop);
    return () => {
      window.removeEventListener("dragover", onOver);
      window.removeEventListener("dragleave", onLeave);
      window.removeEventListener("drop", onDrop);
    };
  }, [accept]);

  return (
    <div className="flex min-h-dvh flex-col font-sans">
      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-black/80">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-5">
          <span className="text-xl font-bold">[easy cc]</span>
          <a
            href="#how"
            className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
          >
            How it works
          </a>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <motion.div
            aria-hidden
            animate={{ y: [0, -18, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-24 left-1/2 -z-10 size-72 -translate-x-[80%] rounded-full bg-gradient-to-br from-amber-300 to-rose-400 opacity-30 blur-3xl"
          />
          <motion.div
            aria-hidden
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-32 left-1/2 -z-10 size-72 translate-x-[10%] rounded-full bg-gradient-to-br from-sky-300 to-indigo-400 opacity-30 blur-3xl"
          />

          <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-5 pb-20 pt-14 text-center sm:pt-20">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-800 dark:text-zinc-400"
            >
              100% local — nothing ever gets uploaded
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05 }}
              className="mt-5 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
            >
              Perfect colors. Zero effort.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.12 }}
              className="mt-4 max-w-xl text-base text-zinc-600 sm:text-lg dark:text-zinc-400"
            >
              Drop a photo and tune saturation, gamma and color tone with three
              sliders. Fast, private, done in your browser.
            </motion.p>

            <motion.label
              htmlFor="landing-upload"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, delay: 0.2 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`group mt-10 flex w-full max-w-xl cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-8 py-14 backdrop-blur-sm transition-colors sm:py-16 ${
                dragging
                  ? "border-zinc-900 bg-white/70 shadow-xl dark:border-white dark:bg-black/70"
                  : "border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50/50 dark:border-zinc-700 dark:hover:border-zinc-600 dark:hover:bg-zinc-900/50"
              }`}
            >
              <input
                id="landing-upload"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => accept(e.target.files?.[0])}
              />
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-12 text-zinc-400"
                animate={dragging ? { y: [-4, 2, -4] } : { y: 0 }}
                transition={{
                  duration: 0.9,
                  repeat: dragging ? Infinity : 0,
                }}
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </motion.svg>
              <span className="mt-4 text-lg font-medium">
                Drop an image anywhere
              </span>
              <span className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                or click to browse · PNG · JPG · WebP
              </span>
            </motion.label>

            <AnimatePresence>
              {dragging && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 text-sm font-medium text-emerald-600 dark:text-emerald-400"
                >
                  Release to start color correcting →
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </section>

        <section id="how" className="border-y border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto w-full max-w-6xl px-5 py-16">
            <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">
              Three steps. No accounts.
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {[
                ["1", "Drop your photo", "Drag it anywhere on this page."],
                ["2", "Slide to taste", "Saturation, gamma and tone — live preview."],
                ["3", "Export full-res", "Download a PNG at original quality."],
              ].map(([n, title, desc], i) => (
                <motion.div
                  key={n}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="rounded-xl border border-zinc-200 bg-white p-6 text-left dark:border-zinc-800 dark:bg-black"
                >
                  <span className="inline-flex size-8 items-center justify-center rounded-full bg-zinc-900 text-sm font-bold text-white dark:bg-white dark:text-black">
                    {n}
                  </span>
                  <h3 className="mt-4 font-semibold">{title}</h3>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-5 py-16">
          <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">
            All the control you need
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800"
              >
                <h3 className="font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {f.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200 py-6 dark:border-zinc-800">
        <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
          © 2026 [easy cc] — your photos never leave your device.
        </p>
      </footer>

      <AnimatePresence>
        {dragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-white/70 p-6 backdrop-blur-sm dark:bg-black/70"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="rounded-3xl border-4 border-dashed border-zinc-900 px-10 py-16 text-center dark:border-white"
            >
              <p className="text-2xl font-bold">Drop to color correct</p>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                Works with PNG, JPG and WebP
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
