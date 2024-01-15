"use client"

import { FullConversationType } from "@/app/_types";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

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

    // const handleClick = useCall


    return ( 

     );
}

export default ConversationBox;