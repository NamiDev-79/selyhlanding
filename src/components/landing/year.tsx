"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
/** En el servidor (prerender estático) se usa el año del build; en el navegador, el actual. */
const BUILD_YEAR = 2026;

export function Year() {
  const year = useSyncExternalStore(subscribe, () => new Date().getFullYear(), () => BUILD_YEAR);
  return <span>{year}</span>;
}
