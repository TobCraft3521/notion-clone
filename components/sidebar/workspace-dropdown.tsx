"use client"

import { useAppState } from "@/lib/providers/state-provider"
import { workspace } from "@/lib/supabase/supabase.types"
import { useEffect, useState } from "react"

interface WorkspaceDropdownProps {
  privateWorkspaces: workspace[] | []
  sharedWorkspaces: workspace[] | []
  collaboratingWorkspaces: workspace[] | []
  defaultValue: workspace | undefined
}

const WorkspaceDropdown = ({
  privateWorkspaces,
  sharedWorkspaces,
  collaboratingWorkspaces,
  defaultValue,
}: WorkspaceDropdownProps) => {
  const [selectedOption, setSelectedOption] = useState(defaultValue)
  const [isOpen, setIsOpen] = useState(false)
  const { dispatch, state } = useAppState()
  useEffect(() => {
    if (!state.workspaces.length) {
      dispatch({
        type: "SET_WORKSPACES",
        payload: {
          workspaces: [
            ...privateWorkspaces,
            ...sharedWorkspaces,
            ...collaboratingWorkspaces,
          ].map((workspace) => ({ ...workspace, folders: [] })),
        },
      })
    }
  }, [privateWorkspaces, collaboratingWorkspaces, sharedWorkspaces])

  const handleSelect = (option: workspace) => {
    setSelectedOption(option)
    setIsOpen(false)
  }
  return (
    <div className="relative inline-block text-left">
      <span onClick={() => setIsOpen(!isOpen)}>
        {selectedOption ? null : null}
      </span>
    </div>
  )
}

export default WorkspaceDropdown
