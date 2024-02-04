"use client"

import { workspace } from "@/lib/supabase/supabase.types"
import { createBrowserClient } from "@supabase/ssr"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

interface SelectedWorkspaceProps {
  workspace: workspace
  onClick?: (option: workspace) => void
}

const SelectedWorkspace = ({ workspace, onClick }: SelectedWorkspaceProps) => {
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
  return (
    <Link
      href={"/dashboard/" + workspace.id}
      onClick={() => {
        if (onClick) onClick(workspace)
      }}
      className="flex rounded-md hover:bg-muted transition-all flex-row p-2 gap-4 justify-center cursor-pointer items-center my-2"
    >
      <Image
        src={workspaceLogo}
        alt="workspace logo"
        width={26}
        height={26}
        objectFit="cover"
      />
      <div className="flex flex-col">
        <p className="text-lg w-[170px] overflow-hidden overflow-ellipsis whitespace-nowrap">
          {workspace.title}
        </p>
      </div>
    </Link>
  )
}

export default SelectedWorkspace
