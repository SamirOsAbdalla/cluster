
import { db } from "@/lib/mongo/util/connectMongo";
import UserModel from "@/lib/mongo/models/UserModel";
export async function POST(request: Request) {
    await db.connect()
    const { memberEmail } = await request.json()
    try {
        if (memberEmail) {
            const response = await UserModel.findOne({ email: memberEmail })
            if (response) {
                return new Response(JSON.stringify(response.picture))
            }
        }
    } catch (error) {
        return new Response(JSON.stringify(null))
    }
}
