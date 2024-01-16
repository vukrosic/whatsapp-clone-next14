import { Tooltip, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TooltipContent } from "@radix-ui/react-tooltip";
import { Video, VideoOff } from "lucide-react";


interface CallButtonProps {
    isInCall: boolean,
    setIsInCall: React.Dispatch<React.SetStateAction<boolean>>
}

const CallButton = ({
    isInCall,
    setIsInCall
}: CallButtonProps) => {
    const Icon = isInCall ? VideoOff : Video;
    const tooltipLabel = isInCall ? "End video call" : "Start video call";

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                    <div onClick={() => setIsInCall(!isInCall)}
                        className="hover:opacity-75 transition mr-4 cursor-pointer">
                        <Icon className="h-6 w-6 text-zinc-500" />
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{tooltipLabel}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

export default CallButton;