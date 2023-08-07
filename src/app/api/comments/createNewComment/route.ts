import { CommentInterface } from "@/lib/mongo/models/CommentModel";
import { db } from "@/lib/mongo/util/connectMongo";
import CommentModel from "@/lib/mongo/models/CommentModel";


export async function POST(request: Request) {
    await db.connect()
    const body: CommentInterface = await request.json()

    if (body.taskId) {
        const response = await CommentModel.create(body)
        if (response) {
            return new Response(JSON.stringify(response))
        }
    }
    return new Response(JSON.stringify(null))

}