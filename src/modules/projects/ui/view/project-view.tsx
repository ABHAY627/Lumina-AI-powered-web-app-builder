"use client";
import { ResizablePanel, ResizablePanelGroup ,ResizableHandle} from "@/components/ui/resizable";
import { Suspense } from "react";
import { MessagesContainer } from "../components/messages-container";

interface ProjectProps {
  projectId: string;
}

export const ProjectView = ({ projectId }: ProjectProps) => {

    // a very important speed tip if we move the required data to be shown on ui to its deepest components then it will speed up the initial load time as only those components will wait for data to load not the entire parent component

    return (
        <div className="h-screen">
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel
                    defaultSize={35}
                    minSize={20}
                    className="flex flex-col min-h-0"
                >
                    <Suspense fallback={<div>Loading Messages...</div>}>    
                        <MessagesContainer projectId={projectId} />
                    </Suspense>
                </ResizablePanel>

                <ResizableHandle withHandle />

                <ResizablePanel
                    defaultSize={65}
                    minSize={50}
                >
                    TODO:PREVIEW
                {/* {JSON.stringify(messages, null, 2)} */}
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>


    );
};
