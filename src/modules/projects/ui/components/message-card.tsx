import { messageRole,fragment,messageType } from "@/generated/prisma";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import Image from "next/image";
import { ChevronRightIcon, Code2Icon } from "lucide-react";

interface MessageCardProps {
  content: string;
  role: messageRole;
  fragment: fragment | null;
  createdAt: Date;
  isActiveFragment: boolean;
  onFragmentClick: (fragment: fragment) => void;
  type: messageType;
}

interface UserMessageProps {
  content: string;
}

interface AssistantMessageProps {
  content: string;
  fragment: fragment | null;
  createdAt: Date;
  isActiveFragment: boolean;
  onFragmentClick: (fragment: fragment) => void;
  type: messageType;
}

interface FragmentCardProps {
  fragment: fragment;
  isActiveFragment: boolean;
  onFragmentClick: (fragment: fragment) => void;
}

const FragmentCard = ({
  fragment,
  isActiveFragment,
  onFragmentClick,
}: FragmentCardProps) => {
  return (
  <button
    className={cn(
      "flex items-start text-start gap-2 border rounded-lg bg-muted w-fit p-3 hover:bg-secondary transition-colors",
      isActiveFragment &&
        "bg-primary text-primary-foreground border-primary hover:bg-primary",
    )}
    onClick={()=>onFragmentClick(fragment)}
  >
    <Code2Icon className="size-4 mt-0.5" />
    <div className="flex flex-col flex-1">
        <span className="font-medium text-sm line-clamp-1">{fragment.titles}</span>
        <span className="text-sm">Preview</span>
    </div>
    <div className="flex items-center justify-center mt-0.5">
        <ChevronRightIcon className="size-4" />
    </div>
  </button>
);
};

const UserMessage = ({ content }: UserMessageProps) => {
  return (
    <div className="flex justify-end pb-4 pr-2 pl-10">
      <Card className="rounded-lg bg-muted p-3 shadow-none border-none max-w-[80%] break-words">
        {content}
      </Card>
    </div>
  );
};

const AssistantMessage = ({
  content,
  fragment,
  createdAt,
  isActiveFragment,
  onFragmentClick,
  type,
}: AssistantMessageProps) => {
  return (
    <div
    className={cn(
        "flex flex-col group px-2 pb-4",
        type === "TEXT" && "text-red-700 dark:text-red-500",
    )}
    >
    <div className="flex items-center gap-2 pl-2 mb-2">
        <Image
        src="/logo.svg"
        alt="Lumina Logo"
        width={18}
        height={18}
        className="shrink-0"
        />
        <span className="text-sm font-medium">Lumina</span>
        <span className="text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
        {format(createdAt, "HH:mm 'on' MMM dd, yyyy")}
        </span>
    </div>

    <div className="pl-8.5 flex flex-col gap-y-4">
        <span>{content}</span>
        {fragment && type === "FRAGMENT" && (
            <FragmentCard
                fragment={fragment}
                isActiveFragment={isActiveFragment}
                onFragmentClick={onFragmentClick}
            />  
        )}
    </div>
    </div>

  );
};

export const MessageCard = ({
  content,
  role,
  fragment,
  createdAt,
  isActiveFragment,
  onFragmentClick,
  type,
}: MessageCardProps) => {
  if (role === messageRole.ERROR) {
    return (
        <UserMessage content={content} />
    )
}
    return (
        <AssistantMessage
            content={content}
            fragment={fragment}
            createdAt={createdAt}
            isActiveFragment={isActiveFragment}
            onFragmentClick={onFragmentClick}
            type={type}
        />
    );
}
