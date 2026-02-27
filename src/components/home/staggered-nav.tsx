"use client";

import Link from "next/link";
import type React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAVIGATION_ITEMS = [
  { label: "CV", href: "#cv" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
  { label: "Posts", href: "#posts" },
] as const;

type StaggeredNavProps = {
  className?: string;
  listClassName?: string;
  itemClassName?: string;
  buttonClassName?: string;
  orientation?: "row" | "column";
  delayStartMs?: number;
  delayStepMs?: number;
  variant?: React.ComponentProps<typeof Button>["variant"];
  size?: React.ComponentProps<typeof Button>["size"];
};

export function StaggeredNav({
  className,
  listClassName,
  itemClassName,
  buttonClassName,
  orientation = "row",
  delayStartMs = 240,
  delayStepMs = 110,
  variant = "outline",
  size = "lg",
}: StaggeredNavProps) {
  return (
    <nav aria-label="Primary navigation" className={className}>
      <ul
        className={cn(
          "flex flex-wrap gap-3",
          orientation === "column" && "flex-col items-start",
          listClassName,
        )}
      >
        {NAVIGATION_ITEMS.map((item, index) => (
          <li
            key={item.label}
            className={cn(
              "animate-nav-in opacity-0 fill-mode-[forwards]",
              itemClassName,
            )}
            style={{
              animationDelay: `${delayStartMs + index * delayStepMs}ms`,
            }}
          >
            <Button
              asChild
              size={size}
              variant={variant}
              className={buttonClassName}
            >
              <Link href={item.href}>{item.label}</Link>
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
