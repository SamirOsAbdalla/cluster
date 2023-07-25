import { db } from "@/lib/mongo/util/connectMongo";
import TaskModel from "@/lib/mongo/models/TaskModel";


export async function POST(request: Request) {
    await db.connect()


    const { userEmail } = await request.json()
    if (userEmail) {
        const removeResponse = await TaskModel.updateMany(
            { $pull: { members: { memberEmail: userEmail } } }
        )
        if (removeResponse) {
            return new Response(JSON.stringify(removeResponse))
        }
    }

    return new Response(JSON.stringify(null))
}