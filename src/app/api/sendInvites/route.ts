import UserModel from "@/lib/mongo/models/UserModel"
import { InboxInterface } from "@/lib/mongo/models/UserModel"
interface RequestBody {
    projectName: string,
    projectCreator: string,
    projectCreatorEmail: string,
    projectId: string,
    addedMembers: string[]
}

export async function POST(request: Request) {

    const body: RequestBody = await request.json()
    const inboxObject: InboxInterface = {
        projectName: body.projectName,
        senderName: body.projectCreator,
        senderEmail: body.projectCreatorEmail,
        projectId: body.projectId
    }

    let members = body.addedMembers
    members.forEach(async (member) => {
        const response = await UserModel.findOneAndUpdate({ email: member }, { $push: { inbox: inboxObject } })
    })

    return new Response(JSON.stringify({ msg: "Invites sent" }))
}