import { db } from "@/lib/mongo/util/connectMongo";
import ProjectModel from "@/lib/mongo/models/ProjectModel";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { MemberInterface } from "@/lib/mongo/models/ProjectModel";

export async function POST(request: Request) {

    await db.connect()


    const body: MemberInterface = await request.json()
    const allProjects = await ProjectModel.find({ members: { $elemMatch: { memberEmail: `${body.memberEmail}` } } })

    if (allProjects) {
        return new Response(JSON.stringify(allProjects))
    }

    return new Response(JSON.stringify(null))
}

