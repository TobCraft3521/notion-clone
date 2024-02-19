import QuillEditor from "@/components/quill-editor/quill-editor"
import { getFolderDetails } from "@/lib/supabase/queries"
import { redirect } from "next/navigation"

interface FolderPageProps {
  params: {
    folderId: string
  }
}

const FolderPage = async ({ params }: FolderPageProps) => {
  const { data, error } = await getFolderDetails(params.folderId)
  if (error || !data.length) redirect("/dashboard")
  return (
    <div className="relative">
      <QuillEditor
        dirType="folder"
        fileId={params.folderId}
        dirDetails={data[0] || {}}
      />
    </div>
  )
}

export default FolderPage
