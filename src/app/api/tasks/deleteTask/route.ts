import { db } from "@/lib/mongo/util/connectMongo";
import TaskModel from "@/lib/mongo/models/TaskModel";

import mongoose from "mongoose";
export async function POST(request: Request) {
    await db.connect()
    let { taskId } = await request.json();
    if (taskId) {
        const taskIdObject = new mongoose.Types.ObjectId(taskId)
        const response = await TaskModel.deleteOne({ _id: taskIdObject })
        if (response) {
            return new Response(JSON.stringify(response))
        }
    }

    return new Response(JSON.stringify(null))
}