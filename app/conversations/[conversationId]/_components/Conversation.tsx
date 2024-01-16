"use client"

import { FullMessageType } from "@/app/_types";
import { Conversation, User } from "@prisma/client";
import { useState } from "react";
import Body from "./Body";
import Header from "./Header";
import Form from "./Form";

interface ConversationProps {
    conversation: Conversation & {
        users: User[]
    },
    currentUserPrisma: User,
    messages: FullMessageType[]
}

const Conversation = ({
    conversation,
    currentUserPrisma,
    messages
}: ConversationProps) => {
    const [isInCall, setIsInCall] = useState(false)

    return (
        <div className="h-full w-full">
            <div className="h-full w-full flex flex-col">
                <Header
                    conversation={conversation}
                    isInCall={isInCall}
                    currentUserPrisma={currentUserPrisma}
                    setIsInCall={setIsInCall}
                />
                <Body
                    initialMessages={messages}
                    isInCall={isInCall}
                />
                {!isInCall &&
                    (!conversation.isChannel
                        || conversation.ownerId === currentUserPrisma.id) &&
                    <Form />}
            </div>
        </div>
    );
}

export default Conversation;