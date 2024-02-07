import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import clsx from "clsx"
import React from "react"
import { ScrollArea } from "../ui/scroll-area"

interface CustomDialogTriggerProps {
  header?: string
  content?: React.ReactNode
  children: React.ReactNode
  description?: string
  className?: string
}

const CustomDialogTrigger: React.FC<CustomDialogTriggerProps> = ({
  header,
  content,
  children,
  description,
  className,
}) => {
  return (
    <Dialog>
      <DialogTrigger className={clsx("", className)}>{children}</DialogTrigger>
      <DialogContent
        className="h-screen
        block
        sm:h-[440px]
        overflow-scroll
        w-full
      "
      >
        <DialogHeader>
          <DialogTitle>{header}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {/* <ScrollArea className="rounded-md overflow-hidden h-[400px] p-4"> */}
        {content}
        {/* </ScrollArea> */}
      </DialogContent>
    </Dialog>
  )
}

export default CustomDialogTrigger
