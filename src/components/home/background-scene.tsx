/** biome-ignore-all lint/a11y/noStaticElementInteractions: <explanation> This is only used to make mouse events work in the background scene </explanation> */
"use client";

import { useState } from "react";
import { Canvas } from "@/components/canvas";
import { Scene } from "@/components/gaussian-splat/Scene";
import { cn } from "@/lib/utils";
import { StaggeredNav } from "./staggered-nav";

export function BackgroundScene() {
  // mouse position in viewport, normalized to -1..1
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  return (
    <header className="relative isolate min-h-svh w-full overflow-hidden text-[#f2f4f8] bg-linear-to-b from-[#7887B1] via-[#9BA7C2] via-60% to-[#434444]">
      <div
        className="absolute top-10 z-10 w-full flex-col lg:flex-row px-10 py-12 sm:px-20 flex gap-8 lg:items-end justify-between"
        onMouseMove={(e) => {
          // biome-ignore lint/style/noNonNullAssertion: <explanation>We know that `e.currentTarget.parentElement` will always be there since this is the `nav` element's parent and it will always be in the DOM</explanation>
          const rect = e.currentTarget.parentElement!.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
          const y = 1 - ((e.clientY - rect.top) / rect.height) * 2;
          setMouse({ x, y });
        }}
      >
        <div className="max-w-3xl">
          <h1 className="animate-hero-enter font-(family-name:--font-cormorant) text-[clamp(2.8rem,10vw,7.1rem)] leading-[0.9] font-semibold tracking-[-0.03em]">
            Abel de Bruijn
          </h1>
          <p
            className="animate-hero-enter mt-2 max-w-lg text-base text-[#d9e3f4]/90 sm:text-lg"
            style={{ animationDelay: "120ms" }}
          >
            Web developer based in the Netherlands / Amsterdam
          </p>
        </div>

        <div className="relative">
          {/* <div className="pointer-events-none absolute left-0 top-2 h-[calc(100%-1rem)] w-px bg-linear-to-b from-transparent via-[#9ec9ff] to-transparent" /> */}
          <StaggeredNav
            orientation="column"
            buttonClassName="w-48 justify-start rounded-full border-[#afd2ff]/50 bg-background/70 text-foreground hover:bg-background/90 transition-colors hover:text-white"
            delayStartMs={500}
            delayStepMs={120}
          />
        </div>
      </div>

      <div className="h-dvh w-full">
        <Canvas gl={{ antialias: false }}>
          <Scene mouse={mouse} />
        </Canvas>
      </div>

      <div
        className={cn(
          "pointer-events-auto absolute inset-0 bg-[linear-gradient(160deg,rgba(0,0,0,0.22),rgba(0,0,0,0.33))]",
        )}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
          const y = 1 - ((e.clientY - rect.top) / rect.height) * 2;
          setMouse({ x, y });
        }}
      />
    </header>
  );
}
