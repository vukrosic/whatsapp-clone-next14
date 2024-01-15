import { User } from "@prisma/client";
import { FullConversationType } from "../_types";
import { useClerk } from "@clerk/nextjs";
import { useMemo } from "react";

export const useOtherUser = (conversation: FullConversationType | {
    users: User[]
}) => {
    const { user } = useClerk();
    const otherUser = useMemo(() => {
        const currentUserPhone = user?.primaryPhoneNumber?.phoneNumber;
        const otherUser = conversation.users.filter((user) => user.phoneNumber !== currentUserPhone);
        return otherUser[0]
    }, [user?.primaryPhoneNumber?.phoneNumber, conversation.users])

    return otherUser;
}