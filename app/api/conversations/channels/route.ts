import { getCurrentUser } from "@/app/_actions/getCurrentUser";
import { db } from "@/lib/db";
import { removePlusSign } from "@/lib/phoneNumberUtil";
import { pusherServer } from "@/lib/pusher";
import { User } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const { currentUserPrisma } = await getCurrentUser();
        if (!currentUserPrisma?.id) {
            return new NextResponse('Unauthorized', { status: 400 })
        }

        const channels = await db.conversation.findMany({
            orderBy: {
                name: 'asc'
            },
            include: {
                users: true,
            }
        })

        return NextResponse.json(channels)
    } catch (error) {
        console.log(error)
    }
}


export async function POST(
    request: Request
) {
    try {
        const { currentUserPrisma, currentUserClerk } = await getCurrentUser()
        const body = await request.json()
        const {
            name,
            description,
            profileImageUrl
        } = body;

        if (!currentUserPrisma.id || !currentUserClerk?.phoneNumbers[0]?.phoneNumber) {
            return new NextResponse('Unauthorized', { status: 400 })
        }

        const newChannel = await db.conversation.create({
            data: {
                name,
                description,
                isGroup: false,
                isChannel: true,
                profileImageUrl,
                ownerId: currentUserPrisma.id,
                users: {
                    connect: [
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

        newChannel.users.forEach((user: User) => {
            if (user.phoneNumber) {
                pusherServer.trigger(removePlusSign(user.phoneNumber), 'conversation:new', newChannel)
            }
        })

        return NextResponse.json(newChannel)
    } catch (error) {
        return new NextResponse('Internal server error', { status: 500 })
    }
}