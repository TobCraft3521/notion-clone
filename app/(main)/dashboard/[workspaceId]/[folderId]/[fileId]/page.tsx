import QuillEditor from "@/components/quill-editor/quill-editor"
import { getFileDetails, getWorkspaceDetails } from "@/lib/supabase/queries"
import { redirect } from "next/navigation"

interface FileIdProps {
  params: {
    fileId: string
  }
}

const FileId = async ({ params }: FileIdProps) => {
  const { data, error } = await getFileDetails(params.fileId)
  if (error || !data.length) redirect("/dashboard")
  return (
    <div className="relative">
      <QuillEditor
        dirType="file"
        fileId={params.fileId}
        dirDetails={data[0] || {}}
      />
    </div>
  )
}

export default FileId
