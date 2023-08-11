import { TaskInterface } from "@/lib/mongo/models/TaskModel";
import { db } from "@/lib/mongo/util/connectMongo";
import TaskModel from "@/lib/mongo/models/TaskModel";
import { NextResponse, NextRequest } from "next/server";
export async function POST(request: Request) {
    await db.connect()

    const { memberEmail } = await request.json()

    const tasks = await TaskModel.find(
        {
            priority: "Urgent",
            "members.memberEmail": memberEmail
        })

    return NextResponse.json(tasks)

    //return new Response(JSON.stringify(null))
}