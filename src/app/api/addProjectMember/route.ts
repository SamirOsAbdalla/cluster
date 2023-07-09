import ProjectModel from "@/lib/mongo/models/ProjectModel"
import { InboxInterface } from "@/lib/mongo/models/UserModel"
import mongoose from "mongoose"
interface RequestBody {
    userEmail: string,
    userName: string,
    projectId: string
}

export async function POST(request: Request) {
    const body: RequestBody = await request.json()

    const id = new mongoose.Types.ObjectId(body.projectId)
    const userObject = {
        memberEmail: body.userEmail,
        memberName: body.userName
    }
    const response = await ProjectModel.findByIdAndUpdate(id,
        { $push: { members: userObject } })

    if (response) {
        return new Response(JSON.stringify(response))
    }
    return new Response(JSON.stringify(null))

}