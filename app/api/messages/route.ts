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
            message,
            image,
            conversationId
        } = body;

        if (!currentUserPrisma?.id || !currentUserClerk?.phoneNumbers[0]?.phoneNumber) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const newMessage = await db.message.create({
            data: {
                body: message,
                image: image,
                conversation: {
                    connect: {
                        id: conversationId
                    }
                },
                sender: {
                    connect: {
                        id: currentUserPrisma.id
                    }
                },
                seen: {
                    connect: {
                        id: currentUserPrisma.id
                    }
                }
            },
            include: {
                seen: true,
                sender: true
            }
        });

        const updatedConversation = await db.conversation.update({
            where: {
                id: conversationId
            },
            data: {
                lastMessageAt: new Date(),
                messages: {
                    connect: {
                        id: newMessage.id
                    }
                }
            },
            include: {
                users: true,
                messages: {
                    include: {
                        seen: true
                    }
                }
            }
        })
        return NextResponse.json(newMessage)
    } catch (error) {
        console.log(error, 'ERROR_MESSAGE')
        return new NextResponse('Error', { status: 500 })
    }
} 