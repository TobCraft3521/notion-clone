import {
  getCollaboratingWorkspaces,
  getFolders,
  getPrivateWorkspaces,
  getSharedWorkspaces,
  getUserSubscriptionStatus,
} from "@/lib/supabase/queries"
import { CookieOptions, createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { twMerge } from "tailwind-merge"
import WorkspaceDropdown from "./workspace-dropdown"
import PlanUsage from "./plan-usage"
import NativeNavigation from "./native-navigation"
import { ScrollArea } from "../ui/scroll-area"
import FoldersDropdownList from "./folders-dropdown-list"

interface SidebarProps {
  params: {
    workspaceId: string
  }
  className?: string
}

const Sidebar = async ({ params, className }: SidebarProps) => {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return

  const { data: subscriptionData, error: subscriptionError } =
    await getUserSubscriptionStatus(user.id)

  const { data: workspaceFolderData, error: foldersError } = await getFolders(
    params.workspaceId
  )

  if (foldersError || subscriptionError) redirect("/dashboard")

  const [privateWorkspaces, collaboratingWorkspaces, sharedWorkspaces] =
    await Promise.all([
      getPrivateWorkspaces(user.id),
      getCollaboratingWorkspaces(user.id),
      getSharedWorkspaces(user.id),
    ])

  return (
    <aside
      className={twMerge(
        "hidden sm:flex sm:flex-col w-[280px] shrink-0 p-4 md:gap-4 !justify-between",
        className
      )}
    >
      <div>
        <WorkspaceDropdown
          privateWorkspaces={privateWorkspaces}
          sharedWorkspaces={sharedWorkspaces}
          collaboratingWorkspaces={collaboratingWorkspaces}
          defaultValue={[
            ...privateWorkspaces,
            ...collaboratingWorkspaces,
            ...sharedWorkspaces,
          ].find((workspace) => workspace.id === params.workspaceId)}
        />
        <PlanUsage
          foldersLength={workspaceFolderData?.length || 0}
          subscription={subscriptionData}
        />
        <NativeNavigation myWorkspaceId={params.workspaceId} />

        <ScrollArea className="overflow-scroll relative h-[450px]">
          <div
            className="pointer-events-none 
      w-full 
      absolute 
      bottom-0 
      h-20 
      bg-gradient-to-t 
      from-background 
      to-transparent 
      z-40"
          />
          <FoldersDropdownList
            workspaceFolders={workspaceFolderData || []}
            workspaceId={params.workspaceId}
          />
        </ScrollArea>
      </div>
      {/* <UserCard subscription={subscriptionData} /> */}
    </aside>
  )
}

export default Sidebar
