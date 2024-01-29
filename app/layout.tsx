import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import "@/lib/supabase/db"
import ThemeProvider from "@/lib/providers/next-theme-provider"

const inter = Inter({ subsets: ["latin"] })

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
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
