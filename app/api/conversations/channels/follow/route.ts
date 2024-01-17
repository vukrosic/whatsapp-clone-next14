import { getCurrentUser } from "@/app/_actions/getCurrentUser";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
    request: Request
) {
    try {
        const { currentUserPrisma, currentUserClerk } = await getCurrentUser();
        const body = await request.json();
        const {
            conversationId,
            user,
            follow
        } = body;

        if (!currentUserPrisma.id || !currentUserClerk?.phoneNumbers[0]?.phoneNumber) {
            return new NextResponse('Unauthorized', { status: 400 })
        }

        if (follow) {
            const updatedConversation = await db.conversation.update({
                where: {
                    id: conversationId,
                },
                data: {
                    users: {
                        connect: [
                            {
                                id: user.id
                            }
                        ]
                    }
                },
                include: {
                    users: true,
                }
            })
            return NextResponse.json(updatedConversation);
        }
        else {
            const updatedConversation = await db.conversation.update({
                where: {
                    id: conversationId,
                },
                data: {
                    users: {
                        disconnect: [
                            {
                                id: user.id
                            }
                        ]
                    }
                },
                include: {
                    users: true,
                }
            })
            return NextResponse.json(updatedConversation);
        }
    } catch (error) {
        return new NextResponse('Internal server error', { status: 500 })
    }
}