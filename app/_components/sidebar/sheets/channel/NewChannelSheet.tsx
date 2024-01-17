import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { UploadButton } from "@/lib/uploadthing";
import { Conversation } from "@prisma/client";
import axios from "axios";
import { ArrowLeft, Plus } from "lucide-react";
import { useState } from "react";

interface NewChannelSheetProps {
    show: boolean;
    onClose: () => void;
    setChannels: React.Dispatch<React.SetStateAction<Conversation[]>>
}

const NewChannelSheet = ({
    show,
    onClose,
    setChannels
}: NewChannelSheetProps) => {
    const [imageUrl, setImageUrl] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [disableSubmitButton, setDisableSubmitButton] = useState(false)

    const { toast } = useToast();

    const handleCreateChannel = () => {
        setDisableSubmitButton(true);
        toast({
            title: "Creating new channel...",
            duration: 30000,
        })
        axios.post('/api/conversations/channels', {
            name: name,
            description: description,
            profileImageUrl: imageUrl
        })
            .then((response) => {
                toast({
                    title: "New channel created!",
                    className: "bg-green-500",
                    duration: 2000
                })
                setDisableSubmitButton(false);
                setChannels((prevChannels: Conversation[]) => [...prevChannels, response.data]);
                onClose();
            })
            .catch((error) => {
                console.log(error)
            })
            .finally(() => {
                setName("");
                setDescription("");
                setImageUrl("");
            })
    }

    return (
        <Sheet open={show}>
            <SheetContent side="left" className="w-[330px] sm:w-[540px] p-0 overflow-y-auto">
                <SheetHeader className="bg-primary">
                    <div className="flex mt-14 mb-3 items-center">
                        <SheetClose asChild>
                            <ArrowLeft className="mr-7 ml-5 cursor-pointer text-white"
                                onClick={onClose} />
                        </SheetClose>
                        <SheetTitle className="text-white flex items-center justify-center">
                            New Channel
                        </SheetTitle>
                    </div>
                </SheetHeader>
                <div className="flex justify-center my-4">
                    <UploadButton
                        content={{
                            button({ ready }) {
                                return (
                                    <div>
                                        {imageUrl === "" ? (
                                            <div className="relative">
                                                <div className="w-[212px] h-[212px] rounded-full overflow-hidden">
                                                    <img src="/images/IconPlaceholder.svg"
                                                        className="w-full h-full text-[#d1d7db]"
                                                        alt="Placeholder"
                                                    />
                                                </div>
                                                <img
                                                    src="/images/Camera.svg"
                                                    className="absolute top-1/2 left-1/2 transform -translate-x-3 -translate-y-6"
                                                    alt="Camera Icon"
                                                />
                                                <p className="absolute top-1/2 left-1/2 transform -translate-x-14 text-[#ffffff] text-center text-xs">
                                                    ADD CHANNEL ICON
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="relative">
                                                <div className="w-[212px] h-[212px] rounded-full overflow-hidden border-zinc-300 border-4">
                                                    <img
                                                        src={imageUrl}
                                                        className="w-full h-full object-cover"
                                                        alt="Uploaded image"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )
                            }
                        }}
                        endpoint="statusImage"
                        appearance={{
                            allowedContent: { display: 'none' },
                            button: "!ring-0 border-0 bg-white cursor-pointer h-full w-full justify-start"
                        }}
                        className="w-fit uploadbtn"
                        onUploadError={(err: Error) => {
                            console.log(err)
                        }}
                        onUploadBegin={() => {
                            setDisableSubmitButton(true);
                            toast({
                                title: "Uploading image",
                                description: "Wait a moment...",
                                duration: 30000
                            })
                        }}
                        onClientUploadComplete={(res) => {
                            toast({
                                title: "Upload completed!",
                                className: "bg-green-500",
                                duration: 2000
                            })
                            setImageUrl(res[0].url)
                            setDisableSubmitButton(false)
                        }}
                    />
                    <Toaster />
                </div>

                <div className="space-y-10">
                    <Input
                        title="Channel name"
                        className="
                        w-10/12
                        m-auto
                        border-0
                        border-b-2
                        border-gray-400
                        focus:border-primary
                        "
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <Textarea
                        title="Channel description"
                        name="Channel description"
                        placeholder="Describe your channel. Include information to help people understand what your channel is about."
                        className="
                        w-10/12 
                        h-24 
                        bg-gray-100 
                        m-auto 
                        border-0
                        border-b-2
                        border-gray-400
                        focus:border-primary
                        "
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <Button
                    disabled={name === "" || disableSubmitButton}
                    className="
                        flex
                        w-[133.66px]
                        h-[38px]
                        rounded-full
                        m-auto
                        mt-8
                        bg-primary
                        hover:bg-secondary
                        hover:cursor-pointer
                        "
                    onClick={handleCreateChannel}
                >
                    Create channel
                </Button>


            </SheetContent>
        </Sheet>
    );
}

export default NewChannelSheet;