'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductImage } from "../ProductImage";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function ProductImageGallery({ images }: { images: string[] }) {
  const [index, setIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(0);

  if (!images || images.length === 0) {
    return <ProductImage />;
  }

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setIndex((prev) => {
      const next = prev + newDirection;
      if (next < 0) return images.length - 1;
      if (next >= images.length) return 0;
      return next;
    });
  };

  return (
    <div className="relative w-full aspect-square overflow-hidden rounded-xl border">
      {/* Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ x: direction > 0 ? 100 : -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: direction > 0 ? -100 : 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0"
        >
          <ProductImage
            src={images[index]}
            className="h-full w-full"
          />
        </motion.div>
      </AnimatePresence>

      {/* Left Button */}
      <Button
        variant="secondary"
        size="icon"
        onClick={() => paginate(-1)}
        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Right Button */}
      <Button
        variant="secondary"
        size="icon"
        onClick={() => paginate(1)}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
