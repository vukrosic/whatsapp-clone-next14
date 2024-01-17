import { getCurrentUser } from "@/app/_actions/getCurrentUser";
import { db } from "@/lib/db";
import { removePlusSign } from "@/lib/phoneNumberUtil";
import { pusherServer } from "@/lib/pusher";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const { currentUserPrisma } = await getCurrentUser()

        if (!currentUserPrisma?.id) {
            return new NextResponse('Unauthorized', { status: 400 })
        }

        const conversations = await db.conversation.findMany({
            orderBy: {
                lastMessageAt: 'desc'
            },
            where: {
                userIds: {
                    has: currentUserPrisma.id
                }
            }
        })

        return NextResponse.json(conversations)
    } catch (error) {
        return new NextResponse('Internal server error', { status: 500 })
    }
}

export async function POST(
    request: Request
) {
    try {
        const { currentUserPrisma, currentUserClerk } = await getCurrentUser()

        const body = await request.json()
        const {
            userId,
            isGroup,
            members,
            name
        } = body

        if (!currentUserPrisma.id || !currentUserClerk?.phoneNumbers[0]?.phoneNumber) {
            return new NextResponse('Unauthorized', { status: 400 })
        }

        if (isGroup) {
            const newConversation = await db.conversation.create({
                data: {
                    name,
                    isGroup,
                    isChannel: false,
                    ownerId: currentUserPrisma.id,
                    users: {
                        connect: [
                            ...members.map((member: {
                                value: string
                            }) => ({
                                id: member.value,
                            })),
                            {
                                id: currentUserPrisma.id
                            }
                        ]
                    }
                },
                include: {
                    users: true
                }
            })

            // Update all connections with new conversation
            newConversation.users.forEach((user) => {
                if (user.phoneNumber) {
                    pusherServer.trigger(removePlusSign(user.phoneNumber), 'conversation:new', newConversation)
                }
            })


            return NextResponse.json(newConversation)
        }


        const existingConversations = await db.conversation.findMany({
            where: {
                OR: [
                    {
                        userIds: {
                            equals: [currentUserPrisma.id, userId]
                        }
                    },
                    {
                        userIds: {
                            equals: [userId, currentUserPrisma.id]
                        }
                    }
                ]
            }
        })
        const singleConversation = existingConversations[0]
        if (singleConversation) {
            return NextResponse.json(singleConversation)
        }


        const newConversation = await db.conversation.create({
            data: {
                ownerId: currentUserPrisma.id,
                users: {
                    connect: [
                        {
                            id: currentUserPrisma.id
                        },
                        {
                            id: userId
                        }
                    ]
                }
            },
            include: {
                users: true
            }
        })

        newConversation.users.map((user) => {
            if (user.phoneNumber) {
                pusherServer.trigger(removePlusSign(user.phoneNumber), 'conversation:new', newConversation)
            }
        })

        return NextResponse.json(newConversation)
    } catch (error) {
        return new NextResponse('Internal Error', { status: 500 })
    }
}