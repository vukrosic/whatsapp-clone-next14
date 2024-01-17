import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { UploadButton, Uploader, UploadDropzone } from "@/lib/uploadthing";
import { User } from "@prisma/client";
import axios from "axios";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import "@uploadthing/react/styles.css"
import StoryViewer from "./StoryViewer";

interface StatusButtonProps {
    user: User;
    statusTitle?: string;
    statusDescription?: string;
    hasStory?: boolean;
}

function StatusButton({
    user,
    statusTitle,
    statusDescription,
    hasStory
}: StatusButtonProps) {
    const AvatarTailwind = hasStory ? "border-green-400 border-2 rounded-full" : "";
    return (
        <div className="flex relative w-full pt-5 pl-4">
            <Avatar className={AvatarTailwind}>
                <AvatarImage src={user.profileImageUrl || undefined} />
                <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            {!hasStory && ( // change true to variable
                <span
                    className="
                    absolute
                    flex
                    rounded-full
                    bg-[#00a884]
                    top-11
                    left-12
                    ring-2
                    ring-white
                    h-[14px]
                    w-[14px]
                    items-center
                    justify-center
                    "
                >
                    <Plus className="text-white" />
                </span>
            )}
            <div className="text-left w-full">
                <h4 className="text-[1rem] text-black ml-5">{statusTitle}</h4>
                <p className="text-muted-foreground text-[0.8125rem] ml-5">{statusDescription}</p>
            </div>
        </div>
    )
}





interface StatusSidebarButtonProps {
    user: User
}

const StatusSidebarButton = ({
    user
}: StatusSidebarButtonProps) => {
    const [showStory, setShowStory] = useState(false);
    const { toast } = useToast();
    const [hasStory, setHasStory] = useState(user.statusImageUrl !== null ? true : false);

    useEffect(() => {
        setHasStory(user.statusImageUrl !== null ? true : false)
    }, [user.statusImageUrl, hasStory])

    const toggleShowStory = () => {
        setShowStory(!showStory);
    }
    const handleDeleteStory = () => {
        toggleShowStory();
        user.statusImageUrl = null;
        axios.delete('/api/status')
            .then(() => { })
            .catch(err => {
                console.log(err);
            })
    }

    return (
        <div>
            <input disabled />
            {hasStory ? (
                <div>
                    <button onClick={toggleShowStory}>
                        <StatusButton
                            user={user}
                            statusTitle="My Status"
                            statusDescription="today"
                            hasStory={hasStory}
                        />
                    </button>
                    {showStory && (
                        <StoryViewer
                            user={user}
                            onClose={() => toggleShowStory()}
                            onDeleteStory={() => handleDeleteStory()}
                        />
                    )

                    }
                </div>
            ) : (
                <UploadButton
                    content={{
                        button({ ready }) {
                            const statusTitle = ready ? "My Status" : "Loading...";
                            const statusDescription = ready ? "Add to my status" : "Wait a moment";
                            return (
                                <StatusButton
                                    statusTitle={statusTitle}
                                    statusDescription={statusDescription}
                                    user={user}
                                    hasStory={hasStory}
                                />
                            )
                        }
                    }}
                    endpoint="statusImage"
                    appearance={{
                        allowedContent: { display: 'none' },
                        button: "!ring-0 border-0 bg-white cursor-pointer h-full w-full justify-start"
                    }}
                    className="uploadbtn"
                    onUploadError={(err: Error) => {
                        console.log(err)
                    }}
                    onUploadBegin={() => {
                        toast({
                            title: "Uploading story",
                            description: "Wait a minute...",
                            duration: 30000,
                        })
                    }}
                    onClientUploadComplete={(res) => {
                        axios.post('/api/status', { statusImageUrl: res[0].url })
                            .then(res => {
                                user.statusImageUrl = res.data.statusImageUrl;
                                toast({
                                    title: "Upload complete!",
                                    className: "bg-green-500",
                                    duration: 2000,
                                })
                            })
                            .catch(error => { console.log(error) })
                    }}
                />
            )}
            <Toaster />
        </div>
    );
}

export default StatusSidebarButton;