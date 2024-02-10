import QuillEditor from "@/components/quill-editor/quill-editor"
import { getWorkspaceDetails } from "@/lib/supabase/queries"
import { redirect } from "next/navigation"

interface WorkspacePageProps {
  params: {
    workspaceId: string
  }
}

const WorkspacePage = async ({ params }: WorkspacePageProps) => {
  const { data, error } = await getWorkspaceDetails(params.workspaceId)
  if (error || !data.length) redirect("/dashboard")

  return (
    <div className="relative">
      <QuillEditor
        dirType="workspace"
        fileId={params.workspaceId}
        dirDetails={data[0] || {}}
      />
    </div>
  )
}

export default WorkspacePage
