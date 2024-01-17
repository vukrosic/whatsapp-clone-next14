import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Conversation, User } from "@prisma/client";
import axios from "axios";
import { ArrowLeft, Plus } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import NewChannelSheet from "./NewChannelSheet";
import ChannelBox from "./ChanelBox";

interface ChannelsSheetProps {
    currentUser: User
}

const ChannelsSheet = ({
    currentUser
}: ChannelsSheetProps) => {
    const [showNewChannelSheet, setShowNewChannelSheet] = useState(false);
    const [channels, setChannels] = useState<Conversation[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/conversations/channels');
                const channelData = response.data.filter((conversation: Conversation) => conversation.isChannel === true);
                setChannels(channelData);
            } catch (error) {
                console.log(error)
            }
        };

        fetchData()
    }, [])

    return (
        <Sheet>
            <SheetTrigger asChild>
                <button>
                    <Image className="hover:cursor-pointer"
                        src={"/images/Channels.svg"}
                        width={24}
                        height={24}
                        alt="Channels"
                    />
                </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[330px] sm:w-[540px] p-0 overflow-y-auto">
                <SheetHeader className="bg-primary">
                    <div className="flex mt-14 mb-3 items-center">
                        <SheetClose asChild>
                            <ArrowLeft className="mr-7 ml-5 cursor-pointer text-white" />
                        </SheetClose>
                        <SheetTitle className="text-white flex items-center justify-center">
                            Channels
                        </SheetTitle>
                        <div className="flex ml-auto">
                            <Plus
                                className="text-white cursor-pointer mr-4"
                                onClick={() => setShowNewChannelSheet(true)}
                            />
                            <NewChannelSheet
                                show={showNewChannelSheet}
                                onClose={() => setShowNewChannelSheet(false)}
                                setChannels={setChannels}
                            />
                        </div>
                    </div>
                </SheetHeader>
                <ScrollArea className="h-[520px]">
                    <div className="flex flex-wrap justify-center">
                        <div className="text-center w-[350px]">
                            <h4 className="text-[1.1875rem] m-5">
                                Stay updated on your favourite topics
                            </h4>
                            <p className="
                            text-muted-foreground
                            text-[1.0625rem]
                            mb-5
                            ">
                                Find channels to follow below
                            </p>
                        </div>
                        {channels.map((channel, index) => (
                            <ChannelBox
                                key={index}
                                channel={channel}
                                currentUser={currentUser}
                            />
                        ))}
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}

export default ChannelsSheet;