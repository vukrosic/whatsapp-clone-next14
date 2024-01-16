"use client"

import { useOtherUser } from "@/app/_hooks/useOtherUser";
import { FullConversationType } from "@/app/_types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useClerk } from "@clerk/nextjs";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { format } from 'date-fns';
import { useCallback, useMemo } from "react";
import { Separator } from "@/components/ui/separator";

interface ConversationBoxProps {
    data: FullConversationType,
    selected?: boolean;
}

const ConversationBox: React.FC<ConversationBoxProps> = ({
    data,
    selected
}) => {
    const otherUser = useOtherUser(data)
    const clerkUser = useClerk().user
    const router = useRouter()

    const handleClick = useCallback(() => {
        router.push(`/conversations/${data.id}`)
    }, [data, router])

    const lastMessage = useMemo(() => {
        const messages = data.messages || [];
        return messages[messages.length - 1]
    }, [data.messages])

    const lastMessageText = useMemo(() => {
        if (lastMessage?.image) {
            return 'Sent an image'
        }
        if (lastMessage?.body) {
            return lastMessage?.body
        }
        return 'Started a conversation';
    }, [lastMessage])

    const userPhoneNumber = useMemo(() => clerkUser?.phoneNumbers[0].phoneNumber, [clerkUser?.phoneNumbers[0].phoneNumber])

    const hasSeen = useMemo(() => {
        if (!lastMessage) {
            return false;
        }

        const seenArray = lastMessage.seen || [];

        if (!userPhoneNumber) {
            return false;
        }

        return seenArray.filter((user) => user.phoneNumber === userPhoneNumber).length !== 0;
    }, [userPhoneNumber, lastMessage])

    return (
        <div>
            <div
                onClick={handleClick}
                className={clsx(`
            relative
            flex
            items-center
            space-x-3
            p-3
            hover:bg-neutral-100
            transition
            cursor-pointer
            `, selected ? 'bg-neutral-100' : 'bg-white')}
            >
                {data.isGroup ? (
                    <Avatar>
                        <AvatarImage src="/images/GroupPurple.svg" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                ) : (
                    <Avatar>
                        <AvatarImage src={clerkUser?.imageUrl || undefined} />
                        <AvatarFallback>{otherUser?.username?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                )}
                <div className="mix-w-0 flex-1">
                    <div className="focus:outline-0">
                        <span className="absolute inset-0" aria-hidden="true" />
                        <div className="flex justify-between tems-center mb-1">
                            <p className="text-md font-medium text-gray-900">{data.name || otherUser?.username}</p>
                            {lastMessage?.createdAt && (
                                <p>
                                    {format(new Date(lastMessage.createdAt), 'p')}
                                </p>
                            )}
                        </div>
                        <p className={clsx(`
                        truncate
                        text-sm
                        `, hasSeen ? 'text-gray-500' : 'text-black font-medium')}>
                            {lastMessageText}
                        </p>
                    </div>
                </div>

            </div>
            <Separator />
        </div >
    );
}

export default ConversationBox;