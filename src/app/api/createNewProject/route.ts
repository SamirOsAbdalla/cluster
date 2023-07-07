import { db } from "@/lib/mongo/util/connectMongo";
import ProjectModel from "@/lib/mongo/models/ProjectModel";
import { MemberInterface } from "@/lib/mongo/models/ProjectModel";
//can maybe use Pick to take from prexisting ProjectInterface in models folder
interface NewProjectReqBody {
    projectName: string;
    creator: MemberInterface;
    projectDescription: string;
    members: MemberInterface[];
}

export async function POST(request: Request) {
    await db.connect()


    let body: NewProjectReqBody = await request.json()
    const currentDate = new Date();

    if (body) {
        const project = await ProjectModel.create({
            name: body.projectName,
            description: body.projectDescription,
            members: body.members,
            creator: body.creator,
            tasks: [],
            dateCreated: currentDate
        })

        if (project) {
            return new Response(JSON.stringify(project))
        }
    }
    return new Response(JSON.stringify(null))
}