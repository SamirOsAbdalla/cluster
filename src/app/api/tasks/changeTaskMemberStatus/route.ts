import { db } from "@/lib/mongo/util/connectMongo";
import TaskModel from "@/lib/mongo/models/TaskModel";
import mongoose from "mongoose";

interface ReqBody {
    taskId: string,
    memberEmail: string
}
export async function POST(request: Request) {
    await db.connect()
    const body: ReqBody = await request.json()

    if (body) {
        const objectTaskId = new mongoose.Types.ObjectId(body.taskId)
        const taskStatusResponse = await TaskModel.findOneAndUpdate(
            { _id: objectTaskId },
            {
                $set: {
                    "members.$[element].status": "Resolved"
                }
            },
            {
                "arrayFilters": [
                    {
                        "element.memberEmail": body.memberEmail
                    }
                ]
            }
        )
        if (taskStatusResponse) {
            return new Response(JSON.stringify(taskStatusResponse))
        }
    }

    return new Response(JSON.stringify(null))
}