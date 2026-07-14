"use client";

import { useEffect, useState } from "react";

const SIZES = {
  xs: 96,
  sm: 192,
  md: 224,
  lg: 288,
};

function sampleRegion(
  data: Uint8ClampedArray,
  width: number,
  x0: number,
  y0: number,
  size: number
): [number, number, number] {
  let sr = 0,
    sg = 0,
    sb = 0,
    count = 0;
  for (let y = y0; y < y0 + size; y++) {
    for (let x = x0; x < x0 + size; x++) {
      const idx = (y * width + x) * 4;
      sr += data[idx];
      sg += data[idx + 1];
      sb += data[idx + 2];
      count++;
    }
  }
  return [sr / count, sg / count, sb / count];
}

// Removes the photo's background via flood fill from the canvas border,
// rather than a flat color threshold — this correctly follows soft
// vignettes/shadow gradients in the source photo instead of leaving a
// faint rectangular ghost where a global threshold falls just short.
let transparentSrcPromise: Promise<string> | null = null;

function getTransparentWatchSrc(): Promise<string> {
  if (transparentSrcPromise) return transparentSrcPromise;

  transparentSrcPromise = new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = "/watchface.png";
    img.onload = () => {
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("no 2d context"));

      ctx.drawImage(img, 0, 0);
      const frame = ctx.getImageData(0, 0, width, height);
      const data = frame.data;

      const corners = [
        sampleRegion(data, width, 0, 0, 8),
        sampleRegion(data, width, width - 8, 0, 8),
        sampleRegion(data, width, 0, height - 8, 8),
        sampleRegion(data, width, width - 8, height - 8, 8),
      ];
      const refR = corners.reduce((s, c) => s + c[0], 0) / 4;
      const refG = corners.reduce((s, c) => s + c[1], 0) / 4;
      const refB = corners.reduce((s, c) => s + c[2], 0) / 4;

      const dist = (idx: number) => {
        const dr = data[idx] - refR;
        const dg = data[idx + 1] - refG;
        const db = data[idx + 2] - refB;
        return Math.sqrt(dr * dr + dg * dg + db * db);
      };

      const TOLERANCE = 45;
      const FEATHER = 25;

      const visited = new Uint8Array(width * height);
      const queue = new Int32Array(width * height);
      let qHead = 0;
      let qTail = 0;

      const tryEnqueue = (x: number, y: number) => {
        if (x < 0 || x >= width || y < 0 || y >= height) return;
        const p = y * width + x;
        if (visited[p]) return;
        if (dist(p * 4) <= TOLERANCE) {
          visited[p] = 1;
          queue[qTail++] = p;
        }
      };

      for (let x = 0; x < width; x++) {
        tryEnqueue(x, 0);
        tryEnqueue(x, height - 1);
      }
      for (let y = 0; y < height; y++) {
        tryEnqueue(0, y);
        tryEnqueue(width - 1, y);
      }

      while (qHead < qTail) {
        const p = queue[qHead++];
        const x = p % width;
        const y = (p / width) | 0;
        tryEnqueue(x + 1, y);
        tryEnqueue(x - 1, y);
        tryEnqueue(x, y + 1);
        tryEnqueue(x, y - 1);
      }

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const p = y * width + x;
          const idx = p * 4;
          if (visited[p]) {
            data[idx + 3] = 0;
            continue;
          }
          const nearBg =
            (x > 0 && visited[p - 1]) ||
            (x < width - 1 && visited[p + 1]) ||
            (y > 0 && visited[p - width]) ||
            (y < height - 1 && visited[p + width]);
          if (nearBg) {
            const d = dist(idx);
            if (d < TOLERANCE + FEATHER) {
              const t = Math.max(0, Math.min(1, (d - TOLERANCE) / FEATHER));
              data[idx + 3] = Math.round(255 * t);
            }
          }
        }
      }

      ctx.putImageData(frame, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = reject;
  });

  return transparentSrcPromise;
}

const WatchPhoto = ({ size = "md" }: { size?: "xs" | "sm" | "md" | "lg" }) => {
  const px = SIZES[size];
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getTransparentWatchSrc().then((url) => {
      if (!cancelled) setSrc(url);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="relative" style={{ width: px, height: px }}>
      {src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt="GhadiHours smartwatch"
          className="w-full h-full object-contain"
        />
      )}
    </div>
  );
};

export default WatchPhoto;
