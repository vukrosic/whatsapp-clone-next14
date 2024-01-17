import { useConversation } from "@/app/_hooks/useConversation";
import { FullMessageType } from "@/app/_types";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import MessageBox from "./MessageBox";
import { pusherClient } from "@/lib/pusher";
import { find } from 'lodash';
import MediaRoom from "./MediaRoom";

interface BodyProps {
    initialMessages: FullMessageType[];
    isInCall: boolean;
}

const Body = ({
    initialMessages,
    isInCall
}: BodyProps) => {
    const bottomRef = useRef<HTMLDivElement>(null)
    const [messages, setMessages] = useState(initialMessages)
    const { conversationId } = useConversation()

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'instant' })
    }, [isInCall])

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    useEffect(() => {
        axios.post(`/api/conversations/${conversationId}/seen`)
    }, [conversationId])


    useEffect(() => {
        pusherClient.subscribe(conversationId);
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })

        const newMessageHander = (message: FullMessageType) => {
            axios.post(`/api/conversations/${conversationId}/seen`)

            setMessages((current) => {
                if (find(current, { id: message.id })) {
                    return current;
                }

                return [...current, message]
            });
        };

        const updateMessageHandler = (receivedMessages: FullMessageType[]) => {
            setMessages((current) => current.map((currentMessage) => {
                const matchingReceivedMessage = receivedMessages.find((receivedMessage) => receivedMessage.id === currentMessage.id)


                if (matchingReceivedMessage) {
                    return matchingReceivedMessage;
                }

                return currentMessage;
            }));
        }


        // executes on mount or when conversationId changes
        pusherClient.bind('messages:new', newMessageHander);
        pusherClient.bind('message:update', updateMessageHandler);

        // executes on unmount or when conversationId changes, but before the above
        return () => {
            pusherClient.unsubscribe(conversationId);
            pusherClient.unbind('messages:new', newMessageHander);
            pusherClient.unbind('message:update', updateMessageHandler);
        }
    }, [conversationId])

    return (
        <div className="flex-1 overflow-y-auto bg-pink-100">
            {isInCall && (
                <MediaRoom
                    chatId={conversationId}
                    video={true}
                    audio={true}
                />
            )}

            {!isInCall && (
                <div className="pt-24">
                    {messages.map((message, i) =>
                        <MessageBox
                            isLast={i === messages.length - 1}
                            key={message.id}
                            data={message}
                        />
                    )}
                </div>
            )}
            <div ref={bottomRef} />
        </div>
    );
}

export default Body;