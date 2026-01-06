import Link from "next/link";
import { useTheme } from "next-themes";
import { ChevronDown, ChevronDownIcon, ChevronLeft, ChevronLeftIcon, Edit, SunMoonIcon } from "lucide-react";
import { Moon } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSuspenseQuery } from "@tanstack/react-query";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";

interface Props {
  projectId: string;
}
export const ProjectHeader = ({ projectId }: Props) => {
    const trpc = useTRPC();
    const {data:project} = useSuspenseQuery(trpc.projects.getOne.queryOptions({id:projectId}));
    const {setTheme,theme} = useTheme();
     return (
        <header className="p-2 flex justify-between items-center border-b">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="focus-visible:ring-2 hover:bg-transparent hover:opacity-75 
                    transition-opacity pl-2!"
                    >
                        <Image src="/logo.svg" alt="Lumina" height={20} width={20} />
                        <span className="text-sm font-medium">{project?.name}</span>
                        <ChevronDownIcon/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="start">
                        <DropdownMenuItem asChild>
                            <Link href="/">
                                <ChevronLeftIcon className="mr-2 h-4 w-4"/>
                                <span>Go to Dashboard</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                            <DropdownMenuSub>
                            <DropdownMenuSubTrigger className="gap-2">
                                <SunMoonIcon className="size-4 text-muted-foreground" />
                                <span>Appearance</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                <DropdownMenuRadioGroup value={theme} onValueChange={(value) => setTheme(value)}>
                                    <DropdownMenuRadioItem value="light">
                                    <span>Light</span>
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="dark">
                                    <span>Dark</span>
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="system">
                                    <span>System</span>
                                    </DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                            </DropdownMenuSub>
                    </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
};  