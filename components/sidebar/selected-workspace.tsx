"use client"

import { workspace } from "@/lib/supabase/supabase.types"
import { createBrowserClient } from "@supabase/ssr"
import Link from "next/link"
import { useEffect, useState } from "react"

interface SelectedWorkspaceProps {
  workspace: workspace
}

const SelectedWorkspace = ({ workspace }: SelectedWorkspaceProps) => {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const [workspaceLogo, setWorkspaceLogo] = useState("/cypresslogo.svg")
  useEffect(() => {
    if (workspace.logo) {
      const path = supabase.storage
        .from("workspace-logos")
        .getPublicUrl(workspace.logo).data.publicUrl
      setWorkspaceLogo(path)
    }
  }, [workspace])
  return <Link href={"/dashboard/" + workspace.id}></Link>
}

export default SelectedWorkspace
