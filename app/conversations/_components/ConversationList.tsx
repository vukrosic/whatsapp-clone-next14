"use client"

import { useConversation } from "@/app/_hooks/useConversation";
import { FullConversationType } from "@/app/_types";
import { Input } from "@/components/ui/input";
import { useClerk } from "@clerk/nextjs";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ConversationListProps {
    conversations: FullConversationType[]
}

const ConversationList: React.FC<ConversationListProps> = ({
    conversations
}) => {
    const [items, seItems] = useState(conversations)
    const [searchText, setSearchText] = useState("")
    const router = useRouter()
    const { user } = useClerk()
    const { conversationId, isOpen } = useConversation()


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
                {/* {items.map((item) => (
                    <ConversationBox
                        key={item.id}
                        data={item}
                        selected={conversationId === item.id}
                    />
                ))} */}
            </div>
        </aside>
    );
}

export default ConversationList;