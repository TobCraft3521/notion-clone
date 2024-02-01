import type { Metadata } from "next"
import { Inter, DM_Sans } from "next/font/google"
import "./globals.css"
import "@/lib/supabase/db"
import ThemeProvider from "@/lib/providers/next-theme-provider"
import { twMerge } from "tailwind-merge"

const inter = DM_Sans({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Notion Clone",
  description: "A Notion clone built with Next.js and Supabase",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={twMerge("bg-background", inter.className)}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
