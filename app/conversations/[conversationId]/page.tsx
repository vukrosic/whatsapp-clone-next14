import { getConversationById } from "@/app/_actions/getConversationById";
import { getCurrentUser } from "@/app/_actions/getCurrentUser";
import { getMessages } from "@/app/_actions/getMessages";
import EmptyState from "@/app/_components/EmptyState";
import Conversation from "./_components/Conversation";

interface IParams {
    conversationId: string;
}

const ConversationId = async ({ params }: { params: IParams }) => {
    const conversation = await getConversationById(params.conversationId)
    const messages = await getMessages(params.conversationId)
    const { currentUserPrisma } = await getCurrentUser()

    if (!conversation) {
        return (
            <div className="lg:pl-80 h-full">
                <div className="h-full flex flex-col">
                    <EmptyState currentUser={currentUserPrisma} />
                </div>
            </div>
        )
    }

    return (
        <Conversation
            conversation={conversation}
            currentUserPrisma={currentUserPrisma}
            messages={messages}
        />
    );
}

export default ConversationId;