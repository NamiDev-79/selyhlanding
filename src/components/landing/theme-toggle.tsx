"use client";

import { Moon, Sun } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import { useSyncExternalStore } from "react";

import { cn } from "@/lib/utils";

const KEY = "selyh-theme";

/** Lee la clase .dark de <html> (la pone el script del layout antes del primer pintado). */
function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}
const getSnapshot = () => document.documentElement.classList.contains("dark");
const getServerSnapshot = () => false;

export function setTheme(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
  try {
    localStorage.setItem(KEY, dark ? "dark" : "light");
  } catch {
    /* almacenamiento no disponible: el tema dura lo que dure la página */
  }
}

/** Interruptor claro/oscuro. Claro por defecto; la elección se recuerda en este navegador. */
export function ThemeToggle({ className }: { className?: string }) {
  const dark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <button
      type="button"
      onClick={() => setTheme(!dark)}
      aria-label={dark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      aria-pressed={dark}
      className={cn(
        "relative grid size-10 place-items-center overflow-hidden rounded-full text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className,
      )}
    >
      <AnimatePresence initial={false} mode="popLayout">
        <m.span
          key={dark ? "moon" : "sun"}
          initial={{ y: 14, opacity: 0, rotate: -30 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -14, opacity: 0, rotate: 30 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="grid place-items-center"
        >
          {dark ? <Moon className="size-[18px]" aria-hidden /> : <Sun className="size-[18px]" aria-hidden />}
        </m.span>
      </AnimatePresence>
    </button>
  );
}
