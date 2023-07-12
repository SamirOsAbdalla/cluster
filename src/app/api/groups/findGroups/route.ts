import { db } from "@/lib/mongo/util/connectMongo";
import GroupModel from "@/lib/mongo/models/GroupModel";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { MemberInterface } from "@/lib/mongo/models/GroupModel";

export async function POST(request: Request) {

    await db.connect()


    const body: MemberInterface = await request.json()
    const allGroups = await GroupModel.find({ members: { $elemMatch: { memberEmail: `${body.memberEmail}` } } })

    if (allGroups) {
        return new Response(JSON.stringify(allGroups))
    }

    return new Response(JSON.stringify(null))
}

