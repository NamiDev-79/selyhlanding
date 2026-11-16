"use client";

import * as RadixSwitch from "@radix-ui/react-switch";
import { type ReactNode, useId } from "react";

type Props = {
  label: ReactNode;
  description?: ReactNode;
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
  disabled?: boolean;
};

export function Switch({ label, description, checked, onCheckedChange, disabled }: Props) {
  const id = useId();
  return (
    <div className="flex items-start justify-between gap-6">
      <div className="grid gap-0.5">
        <label htmlFor={id} className="font-medium text-ink">
          {label}
        </label>
        {description ? <p className="text-step--1 text-ink-soft">{description}</p> : null}
      </div>
      <RadixSwitch.Root
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className="relative mt-0.5 h-7 w-12 shrink-0 rounded-full bg-[var(--line-strong)] transition-colors duration-200 data-[state=checked]:bg-[#6363f1] disabled:opacity-50"
      >
        <RadixSwitch.Thumb className="block size-6 translate-x-0.5 rounded-full bg-white shadow-[0_1px_3px_rgb(15_21_35/0.3)] transition-transform duration-300 ease-[cubic-bezier(.34,1.3,.5,1)] data-[state=checked]:translate-x-[22px]" />
      </RadixSwitch.Root>
    </div>
  );
}
