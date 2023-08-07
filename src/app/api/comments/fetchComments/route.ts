import { CommentInterface } from "@/lib/mongo/models/CommentModel";
import { db } from "@/lib/mongo/util/connectMongo";
import CommentModel from "@/lib/mongo/models/CommentModel";
import mongoose from "mongoose";
interface ReqBody {
    taskId: string
}
export async function POST(request: Request) {
    await db.connect()

    const body: ReqBody = await request.json()


    if (body.taskId) {
        const response = await CommentModel.find({ taskId: body.taskId })
        if (response) {
            return new Response(JSON.stringify(response))
        }
    }
    return new Response(JSON.stringify(null))

}