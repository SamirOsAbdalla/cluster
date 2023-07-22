import { TaskInterface } from "@/lib/mongo/models/TaskModel";
import { db } from "@/lib/mongo/util/connectMongo";
import TaskModel from "@/lib/mongo/models/TaskModel";



export async function POST(request: Request) {
    await db.connect()
    let body: TaskInterface = await request.json();

    if (body) {
        const newTask = await TaskModel.create(body)
        if (newTask) {
            return new Response(JSON.stringify(newTask))
        }
    }

    return new Response(JSON.stringify(null))
}