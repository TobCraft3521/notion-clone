"use client"
import { useAppState } from "@/lib/providers/state-provider"
import { useSupabaseUser } from "@/lib/providers/supabase-user-provider"
import { useRouter } from "next/navigation"
import React from "react"
import { Button } from "../ui/button"
import { createBrowserClient } from "@supabase/ssr"

interface LogoutButtonProps {
  children: React.ReactNode
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ children }) => {
  const { user } = useSupabaseUser()
  const { dispatch } = useAppState()
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const logout = async () => {
    await supabase.auth.signOut()
    router.refresh()
    dispatch({ type: "SET_WORKSPACES", payload: { workspaces: [] } })
  }
  return (
    <div className="rounded-full overflow-hidden">
      <Button variant="ghost" size="icon" className="p-0" onClick={logout}>
        {children}
      </Button>
    </div>
  )
}

export default LogoutButton
