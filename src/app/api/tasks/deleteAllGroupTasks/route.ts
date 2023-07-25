import { db } from "@/lib/mongo/util/connectMongo";
import TaskModel from "@/lib/mongo/models/TaskModel";

export async function POST(request: Request) {
    await db.connect()
    const { groupId } = await request.json()

    if (groupId) {
        const deleteResponse = await TaskModel.deleteMany({ groupId: groupId })
        if (deleteResponse) {
            return new Response(JSON.stringify(deleteResponse))
        }
    }

    return new Response(JSON.stringify(null))

}