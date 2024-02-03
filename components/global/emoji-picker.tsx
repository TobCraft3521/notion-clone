import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Theme } from "emoji-picker-react"

interface EmojiPickerProps {
  children: React.ReactNode
  getValue?: (emoji: string) => void
}

const EmojiPicker = ({ children, getValue }: EmojiPickerProps) => {
  const route = useRouter()
  const Picker = dynamic(() => import("emoji-picker-react"))
const onClick = (selectedEmoji: any) => {
    if (getValue) {
        getValue(selectedEmoji.emoji)
    }
}
return (
    <div className="flex items-center">
        <Popover>
            <PopoverTrigger className="cursor-pointer">{children}</PopoverTrigger>
            <PopoverContent className="p-0 border-none">
                <Picker onEmojiClick={onClick} theme={Theme.DARK} />
            </PopoverContent>
        </Popover>
    </div>
)
}

export default EmojiPicker
