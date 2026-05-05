import "./globals.css";
import Providers from "./providers";
import { ThemeProvider } from "@/components/theme-provider";
import { ClientOnly } from "@/components/client-only";

export const metadata = {
  title: "Lyrics Video Local App",
  description: "Local lyrics video tool using Next.js + FastAPI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <ClientOnly>
            <Providers>{children}</Providers>
          </ClientOnly>
        </ThemeProvider>
      </body>
    </html>
  );
}
