import TaskModel, { TaskMemberType, TaskPriority, TaskStatusType } from "@/lib/mongo/models/TaskModel";
import { db } from "@/lib/mongo/util/connectMongo";
import mongoose from "mongoose";



export interface EditTaskBodyType {
    newTaskName: string,
    newTaskDescription: string,
    newTaskMembers: TaskMemberType[],
    newTaskStatus: TaskStatusType,
    newTaskPriority: TaskPriority,
    currentTaskId?: string
}
export async function POST(request: Request) {
    await db.connect()
    const body: EditTaskBodyType = await request.json()



    if (!body.currentTaskId) {
        return new Response(JSON.stringify(null))
    } else {
        const id = new mongoose.Types.ObjectId(body.currentTaskId!)

        const response = await TaskModel.findOneAndUpdate(
            { _id: id },
            {
                name: body.newTaskName, description: body.newTaskDescription, members: body.newTaskMembers,
                status: body.newTaskStatus, priority: body.newTaskPriority
            }
        )
        if (response) {
            return new Response(JSON.stringify(response))
        }
    }

    return new Response(JSON.stringify(null))
}