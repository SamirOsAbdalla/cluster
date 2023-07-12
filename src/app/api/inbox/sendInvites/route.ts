import InboxModel from "@/lib/mongo/models/InboxModel"
import { InboxInterface, InboxItemInterface } from "@/lib/mongo/models/InboxModel"
interface RequestBody {
    groupName: string,
    groupCreator: string,
    groupCreatorEmail: string,
    groupId: string,
    addedMembers: string[],
    userEmail: string
}

export async function POST(request: Request) {

    const body: RequestBody = await request.json()
    const inboxItemObject: InboxItemInterface = {
        groupName: body.groupName,
        senderName: body.groupCreator,
        senderEmail: body.groupCreatorEmail,
        groupId: body.groupId,
    }
    let members = body.addedMembers
    members.forEach(async (member) => {
        const response = await InboxModel.findOneAndUpdate({ userEmail: member }, { $push: { inboxItems: inboxItemObject } })
    })

    return new Response(JSON.stringify({ msg: "Invites sent" }))
}