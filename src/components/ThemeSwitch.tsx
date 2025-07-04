"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function ThemeSwitch() {
  const { theme, setTheme } = useTheme();

  return (
    <>
      <button
        onClick={() => {
          console.log("theme---->", theme);
          setTheme(theme == "dark" ? "light" : "dark");
        }}
      >
        {theme == "dark" ? (
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0  transition-all dark:fill-white dark:stroke-white" />
        ) : (
          <Moon className="h-[1.2rem] w-[1.2rem] transition-all fill-black" />
        )}
      </button>
    </>
  );
}
