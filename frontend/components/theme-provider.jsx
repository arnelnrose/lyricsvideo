"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect } from "react";

export function ThemeProvider({ children }) {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const syncBodyClass = () => {
      const isDark = html.classList.contains("dark");
      body.classList.toggle("dark", isDark);
    };
    syncBodyClass();

    const observer = new MutationObserver(() => syncBodyClass());
    observer.observe(html, { attributes: true, attributeFilter: ["class", "data-theme"] });
    return () => observer.disconnect();
  }, []);

  return (
    <NextThemesProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
      {children}
    </NextThemesProvider>
  );
}
