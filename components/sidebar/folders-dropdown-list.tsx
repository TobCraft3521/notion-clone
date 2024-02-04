"use client"

import { useAppState } from "@/lib/providers/state-provider"
import { Folder } from "@/lib/supabase/supabase.types"
import { useEffect, useState } from "react"
import TooltipComponent from "../global/tooltip-component"
import { PlusIcon } from "lucide-react"
import { Accordion } from "../ui/accordion"
import { useSupabaseUser } from "@/lib/providers/supabase-user-provider"
import { v4 } from "uuid"
import { createFolder } from "@/lib/supabase/queries"
import { useToast } from "../ui/use-toast"

interface FoldersDropdownListProps {
  workspaceFolders: Folder[]
  workspaceId: string
}

const FoldersDropdownList = ({
  workspaceFolders,
  workspaceId,
}: FoldersDropdownListProps) => {
  const { state, dispatch } = useAppState()
  const [folders, setFolders] = useState(workspaceFolders)
  const { subscription } = useSupabaseUser()
  const { toast } = useToast()

  useEffect(() => {
    if (workspaceFolders.length > 0) {
      dispatch({
        type: "SET_FOLDERS",
        payload: {
          folders: workspaceFolders.map((folder) => ({
            ...folder,
            files:
              state.workspaces
                .find((workspace) => workspace.id === workspaceId)
                ?.folders.find((f) => f.id === folder.id)?.files || [],
          })),
          workspaceId,
        },
      })
    }
  }, [workspaceFolders, workspaceId])

  useEffect(() => {
    setFolders(
      state.workspaces.find((workspace) => workspace.id === workspaceId)
        ?.folders || []
    )
  }, [state, workspaceId])

  const addFolderHandler = async () => {
    // if (folders.length >= 3 && !subscription) {

    // }
    const newFolder: Folder = {
      data: null,
      id: v4(),
      createdAt: new Date().toISOString(),
      title: "New Folder",
      iconId: "📁",
      inTrash: null,
      workspaceId,
      bannerUrl: "",
    }
    dispatch({
      type: "ADD_FOLDER",
      payload: {
        folder: { ...newFolder, files: [] },
        workspaceId,
      },
    })

    const { data, error } = await createFolder(newFolder)
    if (error) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Could not create the folder",
      })
    } else {
      toast({
        title: "Success",
        description: "Created Folder",
      })
    }
  }

  return (
    <>
      <div
        className="flex
            sticky 
            z-20 
            top-0 
            bg-background 
            w-full  
            h-10 
            group/title 
            justify-between 
            items-center 
            pr-4 
            text-Neutrals/neutrals-8
      "
      >
        <span
          className="text-Neutrals-8 
            font-bold 
            text-xs"
        >
          FOLDERS
        </span>
        <TooltipComponent message="Create Folder">
          <PlusIcon
            onClick={addFolderHandler}
            size={16}
            className="group-hover/title:inline-block
                hidden 
                cursor-pointer
                hover:dark:text-white
              "
          />
        </TooltipComponent>
      </div>
      <Accordion
        type="multiple"
        //  defaultValue={[folderId || ""]}
        className="pb-20"
      >
        {/* {folders
          .filter((folder) => !folder.inTrash)
          .map((folder) => (
            <Dropdown
              key={folder.id}
              title={folder.title}
              listType="folder"
              id={folder.id}
              iconId={folder.iconId}
            />
          ))} */}
      </Accordion>
    </>
  )
}

export default FoldersDropdownList
