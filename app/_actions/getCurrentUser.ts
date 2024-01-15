import { db } from "@/lib/db"
import { currentUser } from "@clerk/nextjs"
import { User as ClerkUser } from "@clerk/nextjs/server"
import { User as PrismaUser } from "@prisma/client"
import { NextResponse } from "next/server"

interface CurrentUser {
    currentUserPrisma: PrismaUser & {
        following: PrismaUser[]
    };
    currentUserClerk: ClerkUser
}

export const getCurrentUser = async (): Promise<CurrentUser> => {
    const currentUserClerk = await currentUser();

    if (currentUserClerk === null) {
        throw new Error('Unauthorized');
    }

    const currentUserPrisma = await db.user.findUnique({
        where: {
            externalUserId: currentUserClerk.id
        },
        include: {
            following: true,
            followedBy: true
        }
    })

    if (currentUserPrisma === null) {
        throw new Error('User not found!')
    }

    return { currentUserPrisma, currentUserClerk }
}