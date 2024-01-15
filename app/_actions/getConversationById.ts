import { db } from "@/lib/db";
import { getCurrentUser } from "./getCurrentUser"

export const getConversationById = async (
    conversationId: string
) => {
    try {
        const { currentUserPrisma, currentUserClerk } = await getCurrentUser()

        if (!currentUserPrisma.phoneNumber) {
            return null;
        }

        const conversation = await db.conversation.findUnique({
            where: {
                id: conversationId
            },
            include: {
                users: true,
            }
        })

        return conversation
    } catch (error) {
        console.log(error, 'SERVER_ERROR')
        return null
    }
}