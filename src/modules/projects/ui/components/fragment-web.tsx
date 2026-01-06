import { useState } from "react";
import { ExternalLinkIcon,RefreshCcwIcon } from "lucide-react";
import { fragment } from "@/generated/prisma";
import { Button } from "@/components/ui/button";    
import { on } from "events";
import { is } from "date-fns/locale";

interface props{
    data:fragment;
}
export const FragmentWeb = ({data}:props) => {
    const [fragmentKey, setFragmentKey] = useState(0);
    const [isCopied, setIsCopied] = useState(false);
    const onRefresh = () => {
        setFragmentKey(((prev) => prev + 1));
    };
    const handleCopy = () => {
        if (data.sandboxUrl) {
            navigator.clipboard.writeText(data.sandboxUrl);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    }   

    return (
        <div className="flex flex-col w-full h-full">
            <div className="p-2 border-p bg-sidebar flex items-center gap-x-2">
                <Button size="sm" variant="outline" onClick={onRefresh}>
                    {/* TODO:ADD HOVER TEXT TO EVERY BUTTON */}
                    <RefreshCcwIcon />
                </Button>
                <Button 
                    size="sm"  
                    variant="outline" 
                    onClick={handleCopy}
                    disabled={!data.sandboxUrl || isCopied}
                    className="flex-1 justify-start text-start font-normal"
                    // {TODO:ADD HOVER TEXT TO EVERY BUTTON}
                >
                    <span className="truncate">
                        {data.sandboxUrl}
                    </span>
                </Button>
                
                <Button 
                    size="sm" 
                    variant="outline"
                    disabled={!data.sandboxUrl} 
                    // {TODO:ADD HOVER TEXT TO EVERY BUTTON}
                    onClick={()=>{
                        if(data.sandboxUrl){
                            // for opening in a new tab
                            window.open(data.sandboxUrl,"_blank");
                        }
                    }}>
                    <ExternalLinkIcon />
                    </Button>
            </div>
            <iframe
                key={fragmentKey}
                src={data.sandboxUrl}
                sandbox="allow-forms allow-scripts allow-same-origin"
                loading="lazy"
                className="w-full h-full"
                title="Fragment Preview"
            />

        </div>
    );
};