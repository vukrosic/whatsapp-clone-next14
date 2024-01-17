"use client"

import { useConversation } from "@/app/_hooks/useConversation";
import { FullConversationType } from "@/app/_types";
import { Input } from "@/components/ui/input";
import { useClerk } from "@clerk/nextjs";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import ConversationBox from "./ConversationBox";
import { pusherClient } from "@/lib/pusher";
import { removePlusSign } from "@/lib/phoneNumberUtil";
import { find } from "lodash";

interface ConversationListProps {
    conversations: FullConversationType[]
}

const ConversationList: React.FC<ConversationListProps> = ({
    conversations
}) => {
    const [items, setItems] = useState(conversations)
    const [searchText, setSearchText] = useState("")
    const router = useRouter()
    const { user } = useClerk()
    const { conversationId, isOpen } = useConversation()

    const pusherKey = useMemo(() => {
        if (!user?.phoneNumbers[0].phoneNumber) {
            return null;
        }
        const phoneNumber = removePlusSign(user?.phoneNumbers[0].phoneNumber);
        return phoneNumber;
    }, [user?.phoneNumbers[0].phoneNumber])

    useEffect(() => {
        if (!pusherKey) {
            return;
        }
        pusherClient.subscribe(pusherKey)

        const updateHandler = (conversation: FullConversationType) => {
            setItems((current) => current.map((currentConversation) => {
                if (currentConversation.id === conversation.id) {
                    return {
                        ...currentConversation,
                        messages: conversation.messages
                    };
                }

                return currentConversation;
            }))
        }

        const newHandler = (conversation: FullConversationType) => {
            setItems((current) => {
                if (find(current, { id: conversation.id })) {
                    return current;
                }
                return [conversation, ...current]
            })
        }

        const removeHandler = (conversation: FullConversationType) => {
            setItems((current) => {
                return [...current.filter((conv) => conv.id !== conversation.id)]
            })
        }

        pusherClient.bind('conversation:update', updateHandler);
        pusherClient.bind('conversation:new', newHandler);
        pusherClient.bind('conversation:remove', removeHandler);

    }, [pusherKey, router])

    return (
        <aside className="h-[550px] overflow-y-auto">
            <div>
                <div className="space-y-auto">
                    <div className="flex bg-gray w-11/12 m-auto rounded-xl mt-2 ml-3 items-center">
                        <Search className="ml-3 mr-2" />
                        <Input
                            placeholder="Search or start a new conversation"
                            className="bg-transparent border-0 focus-visible:ring-0"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </div>
                </div>
                {items.map((item) => (
                    <ConversationBox
                        key={item.id}
                        data={item}
                        selected={conversationId === item.id}
                    />
                ))}
            </div>
        </aside>
    );
}

export default ConversationList;