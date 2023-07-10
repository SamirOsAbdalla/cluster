import ProjectModel from "@/lib/mongo/models/ProjectModel"
import mongoose from "mongoose"
interface RequestBody {
    projectId: string
    userEmail: string,
}
export async function POST(request: Request) {

    const body: RequestBody = await request.json()
    const id = new mongoose.Types.ObjectId(body.projectId)
    const response = await ProjectModel.findOneAndUpdate({ _id: id }, { $pull: { members: { memberEmail: body.userEmail } } })
    if (response) {
        return new Response(JSON.stringify(response))
    }

    return new Response(JSON.stringify(null))
}