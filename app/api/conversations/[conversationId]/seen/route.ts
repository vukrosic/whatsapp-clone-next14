import { getCurrentUser } from "@/app/_actions/getCurrentUser"
import { db } from "@/lib/db";
import { removePlusSign } from "@/lib/phoneNumberUtil";
import { pusherServer } from "@/lib/pusher";
import { NextResponse } from "next/server";

interface IParams {
    conversationId?: string
}

export async function POST(
    request: Request,
    { params }: { params: IParams }
) {
    try {

        const { currentUserPrisma, currentUserClerk } = await getCurrentUser();
        const {
            conversationId
        } = params;

        if (!currentUserPrisma?.id || !currentUserPrisma?.phoneNumber) {
            return new NextResponse('Unauthorized', { status: 401 });
        }


        const unseenMessages = await db.message.findMany({
            where: {
                conversationId,
                NOT: {
                    seenIds: {
                        has: currentUserPrisma.id
                    }
                }
            }
        })
        const unseenMessagesIds = unseenMessages.map(message => message.id)


        await db.message.updateMany({
            where: {
                conversationId,
                NOT: {
                    seenIds: {
                        has: currentUserPrisma.id
                    }
                }
            },
            data: {
                seenIds: {
                    push: currentUserPrisma.id
                }
            }
        })

        const updatedMessages = await db.message.findMany({
            where: {
                id: {
                    in: unseenMessagesIds
                }
            }
        })


        await pusherServer.trigger(removePlusSign(currentUserPrisma.phoneNumber), 'conversation:update', { id: conversationId, messages: updatedMessages })

        await pusherServer.trigger(conversationId!, 'message:update', updatedMessages)
        return NextResponse.json(updatedMessages)

    } catch (error) {
        console.log(error)
        return new NextResponse('Error', { status: 500 })
    }
}