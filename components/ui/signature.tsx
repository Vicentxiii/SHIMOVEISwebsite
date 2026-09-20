"use client";

import { useEffect, useId, useState } from "react";
import { motion } from "motion/react";
import { parse as opentypeParse } from "opentype.js";
import { cn } from "@/lib/utils";

interface SignatureProps {
  text?: string;
  color?: string;
  fontSize?: number;
  duration?: number;
  delay?: number;
  className?: string;
  inView?: boolean;
  once?: boolean;
  fontUrl?: string;
  loop?: boolean;
  loopPause?: number;
}

export function Signature({
  text = "Signature",
  color = "currentColor",
  fontSize = 32,
  duration = 1.5,
  delay = 0,
  className,
  inView = false,
  once = true,
  fontUrl,
  loop = false,
  loopPause = 2.8,
}: SignatureProps) {
  const [paths, setPaths] = useState<string[]>([]);
  const [width, setWidth] = useState<number>(300);
  const [animationKey, setAnimationKey] = useState(0);
  const height = fontSize * 3;
  const horizontalPadding = fontSize * 0.1;
  const topMargin = fontSize * 1.5;
  const baseline = topMargin;
  const maskId = `signature-reveal-${useId().replace(/:/g, "")}-${animationKey}`;

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        let font: any = null;
        const fontPaths = fontUrl
          ? [fontUrl]
          : [
              "/LastoriaBoldRegular.otf",
              "./LastoriaBoldRegular.otf",
              "https://www.componentry.fun/LastoriaBoldRegular.otf",
            ];

        for (const path of fontPaths) {
          try {
            const res = await fetch(path);
            if (!res.ok) throw new Error(`HTTP ${res.status} ao buscar ${path}`);
            const buffer = await res.arrayBuffer();
            font = opentypeParse(buffer);
            if (font) break;
          } catch (e) {
            console.warn(`[Signature] falha ao carregar fonte em ${path}:`, e);
          }
        }

        if (!font) throw new Error("Font could not be loaded from any path");

        let x = horizontalPadding;
        const newPaths: string[] = [];

        for (const char of text) {
          const glyph = font.charToGlyph(char);
          const path = glyph.getPath(x, baseline, fontSize);
          newPaths.push(path.toPathData(3));
          const advanceWidth = glyph.advanceWidth ?? font.unitsPerEm;
          x += advanceWidth * (fontSize / font.unitsPerEm);
        }

        if (!cancelled) {
          setPaths(newPaths);
          setWidth(x + horizontalPadding);
        }
      } catch (error) {
        console.error("Signature component font load error:", error);
        if (!cancelled) {
          setPaths([]);
          setWidth(text.length * fontSize * 0.6);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [text, fontSize, baseline, horizontalPadding, fontUrl]);

  // Looping via remount: anima da primeira até a última letra, pausa, e repete
  useEffect(() => {
    if (!loop || paths.length === 0) return;
    const stagger = 0.2;
    const totalDuration = delay + Math.max(0, paths.length - 1) * stagger + duration;
    const cycle = totalDuration + loopPause;
    const id = setInterval(() => {
      setAnimationKey((k) => k + 1);
    }, cycle * 1000);
    return () => clearInterval(id);
  }, [loop, loopPause, paths.length, delay, duration]);

  const variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { pathLength: 1, opacity: 1 },
  };

  // Traço mais fino: mask 0.14 (era 0.22) e stroke 1.15 (era 2)
  const maskStrokeWidth = fontSize * 0.14;
  const strokeWidth = 1.15;

  return (
    <motion.svg
      key={loop ? animationKey : paths.length}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      className={cn("text-foreground overflow-visible", className)}
      initial="hidden"
      whileInView={inView ? "visible" : undefined}
      animate={inView ? undefined : "visible"}
      viewport={{ once: loop ? false : once }}
    >
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse">
          {paths.map((d, i) => (
            <motion.path
              key={`${i}-${animationKey}-mask`}
              d={d}
              stroke="white"
              strokeWidth={maskStrokeWidth}
              fill="none"
              variants={variants}
              transition={{
                pathLength: {
                  delay: delay + i * 0.2,
                  duration,
                  ease: "easeInOut",
                },
                opacity: {
                  delay: delay + i * 0.2 + 0.01,
                  duration: 0.01,
                },
              }}
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </mask>
      </defs>

      {paths.map((d, i) => (
        <motion.path
          key={`${i}-${animationKey}-stroke`}
          d={d}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          variants={variants}
          transition={{
            pathLength: {
              delay: delay + i * 0.2,
              duration,
              ease: "easeInOut",
            },
            opacity: {
              delay: delay + i * 0.2 + 0.01,
              duration: 0.01,
            },
          }}
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}

      <g mask={`url(#${maskId})`}>
        {paths.map((d, i) => (
          <path key={`${i}-${animationKey}-fill`} d={d} fill={color} />
        ))}
      </g>
    </motion.svg>
  );
}
