import { getCurrentUser } from "@/app/_actions/getCurrentUser";
import { db } from "@/lib/db";
import { removePlusSign } from "@/lib/phoneNumberUtil";
import { pusherServer } from "@/lib/pusher";
import { NextResponse } from "next/server";

interface IParams {
    conversationId?: string;
}

export async function DELETE(
    request: Request,
    { params }: { params: IParams }
) {
    try {
        const { conversationId } = params;
        const { currentUserPrisma } = await getCurrentUser();

        if (!currentUserPrisma?.id) {
            return NextResponse.json(null);
        }

        const existingConversation = await db.conversation.findUnique({
            where: {
                id: conversationId
            },
            include: {
                users: true
            }
        })

        if (!existingConversation) {
            return new NextResponse('Invalid ID', { status: 400 });
        }

        const deletedConversation = await db.conversation.deleteMany({
            where: {
                id: conversationId,
                userIds: {
                    hasSome: [currentUserPrisma.id]
                },
            },
        });

        existingConversation.users.forEach((user) => {
            if (user.id) {
                pusherServer.trigger(removePlusSign(user.phoneNumber), 'conversation:remove', existingConversation)
            }
        })

        return NextResponse.json(deletedConversation)
    } catch (error) {
        return NextResponse.json(null)
    }
}