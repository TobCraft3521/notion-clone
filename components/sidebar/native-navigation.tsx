import CypressTrashIcon from "../icons/cypressTrashIcon"
import CypressSettingsIcon from "../icons/cypressSettingsIcon"
import CypressHomeIcon from "../icons/cypressHomeIcon"
import Link from "next/link"
import { twMerge } from "tailwind-merge"
import Trash from "../trash/trash"
import Settings from "../settings/settings"

interface NativeNavigationProps {
  myWorkspaceId: string
  className?: string
  getSelectedElement?: (selection: string) => void
}

const NativeNavigation = ({
  myWorkspaceId,
  className,
}: NativeNavigationProps) => {
  return (
    <nav className={twMerge("my-2", className)}>
      <ul className="flex flex-col gap-2">
        <li>
          <Link
            className="group/native
          flex
          text-Neutrals/neutrals-7
          transition-all
          gap-2
        "
            href={`/dashboard/${myWorkspaceId}`}
          >
            <CypressHomeIcon />
            <span>My Workspace</span>
          </Link>
        </li>

        <Settings>
          <li
            className="group/native
          flex
          text-Neutrals/neutrals-7
          transition-all
          gap-2
          cursor-pointer
        "
          >
            <CypressSettingsIcon />
            <span>Settings</span>
          </li>
        </Settings>

        <Trash>
          <li
            className="group/native
          flex
          text-Neutrals/neutrals-7
          transition-all
          gap-2
        "
          >
            <CypressTrashIcon />
            <span>Trash</span>
          </li>
        </Trash>
      </ul>
    </nav>
  )
}

export default NativeNavigation
