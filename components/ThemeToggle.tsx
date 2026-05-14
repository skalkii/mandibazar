"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function ThemeToggle({ dict }: { dict: Dictionary }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <Select value={mounted ? (theme ?? "system") : "system"} onValueChange={setTheme}>
      <SelectTrigger
        aria-label="Theme"
        className="h-9 w-[110px] text-xs"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="light">{dict.theme_light}</SelectItem>
        <SelectItem value="dark">{dict.theme_dark}</SelectItem>
        <SelectItem value="system">{dict.theme_system}</SelectItem>
      </SelectContent>
    </Select>
  );
}
