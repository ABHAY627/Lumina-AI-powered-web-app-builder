import { Code, CopyCheckIcon, CopyIcon } from "lucide-react";
import { useState, useMemo, useCallback, Fragment } from "react";
import { CodeView } from "@/code-view";
import { Button } from "@/components/ui/button";
import { TreeView } from "@/components/ui/tree-view";
import {
  ResizableHandle,  
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb";
import { convertFilesToTreeItems } from "@/lib/utils";

type FileCollection = { [path: string]: string };

function getLanguageFromExtension(filename: string): string {
  const extension = filename.split(".").pop()?.toLowerCase();
  return extension || "text";
}

interface FileExplorerProps {
  files: FileCollection;
}
interface FileBreadCrumbProps {
  filePath: string;
}

const FileBreadCrumb = ({ filePath }: FileBreadCrumbProps) => {
  const pathSeagments = filePath.split("/");
  const maxItemsToShow = 4;

  const renderBreadCrumbItems = () => {
    if (pathSeagments.length <= maxItemsToShow) {
      return pathSeagments.map((seagment, index) => {
        const isLast = index === pathSeagments.length - 1;

        return (
          <Fragment key={index}>
            <BreadcrumbItem>
              {isLast ? (
                <BreadcrumbPage>{seagment}</BreadcrumbPage>
              ) : (
                <BreadcrumbItem>{seagment}</BreadcrumbItem>
              )}
            </BreadcrumbItem>
            {!isLast && <BreadcrumbSeparator />}
          </Fragment>
        );
      });
    }
    //file ka name array ka size maxSize se bhi bada ho gaya.
    else{
        const firstSegment = pathSeagments[0];
        const lastSegment = pathSeagments.slice(pathSeagments.length-1);
        return(
            <>
            <Breadcrumb>
                <BreadcrumbList>

                    <BreadcrumbItem>
                    <span className="text-muted-foreground">
                        {firstSegment}
                    </span>
                    </BreadcrumbItem>

                    <BreadcrumbSeparator />

                    <BreadcrumbItem>
                    <BreadcrumbEllipsis />
                    </BreadcrumbItem>

                    <BreadcrumbSeparator />

                    <BreadcrumbItem>
                    <BreadcrumbPage className="font-medium">
                        {lastSegment}
                    </BreadcrumbPage>
                    </BreadcrumbItem>

                </BreadcrumbList>
            </Breadcrumb>
            </>
        );
    }
  };
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {renderBreadCrumbItems()}
      </BreadcrumbList>
    </Breadcrumb>
  );
};


export const FileExplorer = ({
  files,
}: FileExplorerProps) => {
    const [selectedFile, setSelectedFile] = useState<string | null>(() => {
        const fileKeys = Object.keys(files);
        return fileKeys.length > 0 ? fileKeys[0] : null;
    });
    const treeData = useMemo(() => {
        return convertFilesToTreeItems(files);
    }, [files]);
    const handleFileSelect = useCallback((
        filePath: string
        ) => {
        if (files[filePath]) {
            setSelectedFile(filePath);
        }
    }, [files]);

    const [isCopied, setCopied] = useState(false);

    const handleCopy = useCallback(() => {
    if (selectedFile) {
        navigator.clipboard.writeText(files[selectedFile]);
        setCopied(true);

        setTimeout(() => {
        setCopied(false);
        }, 2000);
    }
    }, [selectedFile, files]);

  return (
    <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={30} minSize={30} className="bg-sidebar">
            <p>TODO: Tree view</p>
            <TreeView
                data={treeData}
                value={selectedFile}
                onSelect={handleFileSelect}
            />
        </ResizablePanel>

        <ResizableHandle className="hover:bg-primary transition-colors" />

        <ResizablePanel defaultSize={70} minSize={50}>
            {selectedFile && files[selectedFile] ? (
            <div className="h-full w-full flex flex-col">
                <div className="border-b bg-sidebar px-4 py-2 flex justify-between items-center gap-x-2">
                    <FileBreadCrumb filePath={selectedFile} />
                    <Button
                        variant="outline"
                        size="icon"
                        className="ml-auto"
                        onClick={handleCopy}    
                        disabled={isCopied}
                    >
                        {isCopied ? <CopyCheckIcon/> : <CopyIcon/>}
                    </Button>
                </div>
                <div className="flex-1 overflow-auto">
                    <CodeView 
                        code={files[selectedFile]}
                        lang={getLanguageFromExtension(selectedFile)}
                    />
                </div>
            </div>
            ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
                Select a file to view it&apos;s content
            </div>
            )}
        </ResizablePanel>
    </ResizablePanelGroup>

  );
};
