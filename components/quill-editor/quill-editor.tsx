"use client"

import { useAppState } from "@/lib/providers/state-provider"
import { File, Folder, workspace } from "@/lib/supabase/supabase.types"
import { useCallback, useMemo, useState } from "react"
import "react-quill/dist/quill.snow.css" // Import Quill styles
import { Button } from "../ui/button"

// export const dynamic = "force-dynamic"

interface QuillEditorProps {
  dirType: "workspace" | "folder" | "file"
  dirDetails: File | Folder | workspace
  fileId: string
}

var TOOLBAR_OPTIONS = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block"],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }], // text direction

  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],

  ["clean"], // remove formatting button
]

const QuillEditor = ({ fileId, dirDetails, dirType }: QuillEditorProps) => {
  const { state, workspaceId, folderId, dispatch } = useAppState()
  const [quill, setQuill] = useState<any>(null)

  const details = useMemo(() => {
    let selectedDir
    if (dirType === "file") {
      selectedDir = state.workspaces
        .find((workspace) => workspace.id === workspaceId)
        ?.folders.find((folder) => folder.id === folderId)
        ?.files.find((file) => file.id === fileId)
    }
    if (dirType === "folder") {
      selectedDir = state.workspaces
        .find((workspace) => workspace.id === workspaceId)
        ?.folders.find((folder) => folder.id === fileId)
    }
    if (dirType === "workspace") {
      selectedDir = state.workspaces.find(
        (workspace) => workspace.id === fileId
      )
    }

    if (selectedDir) return selectedDir

    return {
      title: dirDetails.title,
      iconId: dirDetails.iconId,
      createdAt: dirDetails.createdAt,
      data: dirDetails.data,
      inTrash: dirDetails.inTrash,
      bannerUrl: dirDetails.bannerUrl,
    } as File | Folder | workspace
  }, [state, workspaceId, folderId])

  const restoreFileHandler = async () => {
    if (dirType === "file") {
      
    }
  }

  const wrapperRef = useCallback(async (wrapper: any) => {
    if (typeof window !== "undefined") {
      if (wrapper === null) return
      wrapper.innerHTML = ""
      const editor = document.createElement("div")
      wrapper.append(editor)
      const Quill = (await import("quill")).default
      // const QuillCursors = (await import("quill-cursors")).default
      // Quill.register("modules/cursors", QuillCursors)
      const q = new Quill(editor, {
        theme: "snow",
        modules: {
          toolbar: TOOLBAR_OPTIONS,
          // cursors: {
          //   transformOnTextChange: true,
          // },
        },
      })
      setQuill(q)
    }
  }, [])

  return (
    <>
      <div className="relative">
        {details.inTrash && (
          <article
            className="py-2 
          z-40 
          bg-[#EB5757] 
          flex  
          md:flex-row 
          flex-col 
          justify-center 
          items-center 
          gap-4 
          flex-wrap"
          >
            <div
              className="flex 
            flex-col 
            md:flex-row 
            gap-2 
            justify-center 
            items-center"
            >
              <span className="text-white">
                This {dirType} is in the trash.
              </span>
              <Button
                size="sm"
                variant="outline"
                className="bg-transparent
                border-white
                text-white
                hover:bg-white
                hover:text-[#EB5757]
                "
                // onClick={restoreFileHandler}
              >
                Restore
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="bg-transparent
                border-white
                text-white
                hover:bg-white
                hover:text-[#EB5757]
                "
                // onClick={deleteFileHandler}
              >
                Delete
              </Button>
            </div>
            <span className="text-sm text-white">{details.inTrash}</span>
          </article>
        )}
      </div>
      <div className="flex justify-center flex-col mt-2 relative">
        <div id="container" className="max-w-[800px]" ref={wrapperRef}></div>
      </div>
    </>
  )
}

export default QuillEditor
