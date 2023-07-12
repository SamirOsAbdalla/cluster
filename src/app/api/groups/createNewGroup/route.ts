import { db } from "@/lib/mongo/util/connectMongo";
import GroupModel from "@/lib/mongo/models/GroupModel";
import { MemberInterface } from "@/lib/mongo/models/GroupModel";
//can maybe use Pick to take from prexisting GroupInterface in models folder
interface NewGroupReqBody {
    groupName: string;
    creator: MemberInterface;
    groupDescription: string;
    members: MemberInterface[];
}

export async function POST(request: Request) {
    await db.connect()


    let body: NewGroupReqBody = await request.json()
    const currentDate = new Date();

    if (body) {
        const group = await GroupModel.create({
            name: body.groupName,
            description: body.groupDescription,
            members: body.members,
            creator: body.creator,
            tasks: [],
            dateCreated: currentDate
        })

        if (group) {
            return new Response(JSON.stringify(group))
        }
    }
    return new Response(JSON.stringify(null))
}