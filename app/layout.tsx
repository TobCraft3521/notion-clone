import type { Metadata } from "next"
import { Inter, DM_Sans } from "next/font/google"
import "./globals.css"
import "@/lib/supabase/db"
import ThemeProvider from "@/lib/providers/next-theme-provider"
import { twMerge } from "tailwind-merge"
import AppStateProvider from "@/lib/providers/state-provider"
import { Toaster } from "@/components/ui/toaster"
import { SupabaseUserProvider } from "@/lib/providers/supabase-user-provider"
import { SocketProvider } from "@/lib/providers/socket-provider"

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
          <AppStateProvider>
            <SupabaseUserProvider>
              <SocketProvider>{children}</SocketProvider>
              <Toaster />
            </SupabaseUserProvider>
          </AppStateProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
