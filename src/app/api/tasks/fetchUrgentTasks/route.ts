import { TaskInterface } from "@/lib/mongo/models/TaskModel";
import { db } from "@/lib/mongo/util/connectMongo";
import TaskModel from "@/lib/mongo/models/TaskModel";

export async function POST(request: Request) {
    await db.connect()

    const { memberEmail } = await request.json()

    const tasks = await TaskModel.find(
        {
            priority: "Urgent",
            "members.memberEmail": memberEmail
        })


    return new Response(JSON.stringify(tasks))

    //return new Response(JSON.stringify(null))
}