import { getCurrentUser } from "@/app/_actions/getCurrentUser";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const { currentUserPrisma, currentUserClerk } = await getCurrentUser();
        if (!currentUserPrisma?.id || !currentUserClerk?.phoneNumbers[0].phoneNumber) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const user = await db.user.findFirst({
            where: {
                id: currentUserPrisma.id
            }
        });
        return NextResponse.json(user);
    } catch (error) {
        console.log(error, "ERROR_MESSAGES")
        return new NextResponse("Error", { status: 500 })
    }
}


export async function POST(request: Request) {
    try {
        const { currentUserPrisma, currentUserClerk } = await getCurrentUser();
        const body = await request.json();
        const {
            statusImageUrl
        } = body;

        if (!currentUserPrisma?.id || !currentUserClerk?.phoneNumbers[0].phoneNumber) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const user = await db.user.update({
            data: {
                statusImageUrl: statusImageUrl
            },
            where: {
                id: currentUserPrisma.id
            }
        });
        return NextResponse.json(user);
    } catch (error) {
        console.log(error);
        return new NextResponse('Error', { status: 500 })
    }
}

export async function DELETE() {
    try {
        const { currentUserPrisma, currentUserClerk } = await getCurrentUser();
        if (!currentUserPrisma?.id || !currentUserClerk?.phoneNumbers[0].phoneNumber) {
            return new NextResponse('Unauthorized', { status: 401 })
        }
        const user = await db.user.update({
            data: {
                statusImageUrl: null
            },
            where: {
                id: currentUserPrisma.id
            }
        });
        return NextResponse.json(user);
    } catch (error) {
        console.log(error);
        return new NextResponse('Error', { status: 500 })
    }
}