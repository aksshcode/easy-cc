"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import Editor from "@/components/editor";
import Landing from "@/components/landing";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);

  const handleFile = useCallback((f: File) => setFile(f), []);
  const goHome = useCallback(() => setFile(null), []);

  return (
    <AnimatePresence mode="wait">
      {file ? (
        <motion.div
          key="editor"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
        >
          <Editor file={file} onHome={goHome} />
        </motion.div>
      ) : (
        <motion.div
          key="landing"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
        >
          <Landing onFile={handleFile} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
