"use client";
import { ResizablePanel, ResizablePanelGroup ,ResizableHandle} from "@/components/ui/resizable";
import { Suspense, useState } from "react";
import { MessagesContainer } from "../components/messages-container";
import { fragment } from "@/generated/prisma";
import { ProjectHeader } from "../components/project-header";
import { FragmentWeb } from "../components/fragment-web";
import { Tabs,TabsContent,TabsList,TabsTrigger } from "@/components/ui/tabs";
import { EyeIcon,CodeIcon, CrownIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CodeView } from "@/code-view";
import { FileExplorer } from "@/components/ui/file-explorer";

interface ProjectProps {
  projectId: string;
}

export const ProjectView = ({ projectId }: ProjectProps) => {
    const [activeFragment,setActiveFragment]=useState<fragment|null>(null);
    // matlab ye sirf ye dono properties hi le sakta hai "Preview" ya "Code"
    const [tabState,setTabState]=useState<"Preview" | "Code">("Preview");

    // a very important speed tip if we move the required data to be shown on ui to its deepest components then it will speed up the initial load time as only those components will wait for data to load not the entire parent component

    return (
        <div className="h-screen">
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel
                    defaultSize={35}
                    minSize={20}
                    className="flex flex-col min-h-0"
                >   <Suspense fallback={<div>Loading Project Header...</div>}>
                    <ProjectHeader projectId={projectId} />
                    </Suspense>
                    <Suspense fallback={<div>Loading Messages...</div>}>    
                        <MessagesContainer 
                            projectId={projectId}
                            activeFragment={activeFragment}
                            setActiveFragment={setActiveFragment}
                        />
                    </Suspense> 
                </ResizablePanel>

                <ResizableHandle className="hover:bg-primary transition-colors" />

                <ResizablePanel
                    defaultSize={65}
                    minSize={50}
                >
                    <Tabs 
                        className="h-full gap-y-0"
                        defaultValue="Preview"
                        value={tabState}    
                        onValueChange={(value)=>{
                            if (value === "Preview" || value === "Code") {
                                setTabState(value);
                            }
                        }}
                        >
                        <div className="w-full flex items-center border-b gap-x-2">
                            <TabsList className="h-8 p-0 border rounded-md">
                                <TabsTrigger value="Preview" className="rounded-md">
                                    <EyeIcon /> <span>Demo</span>
                                </TabsTrigger>
                                <TabsTrigger value="Code" className="rounded-md">
                                    <CodeIcon /> <span>Code</span>
                                </TabsTrigger>
                            </TabsList>
                            <div className="ml-auto flex items-center gap-x-2">
                                <Button asChild size="sm" variant="default">
                                    <Link href="/projects">
                                        <CrownIcon /> Upgrade
                                    </Link>
                                </Button>
                            </div>
                        </div>
                        <TabsContent value="Preview">
                            {!!activeFragment && <FragmentWeb data={activeFragment} />}
                        </TabsContent>
                        <TabsContent value="Code" className="min-h-0">
                            {!!activeFragment?.files && (
                                <FileExplorer files={activeFragment.files as {[path: string]:string} } />
                            )}
                        </TabsContent>  
                    </Tabs>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>


    );
};
