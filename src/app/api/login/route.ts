import UserModel from "@/lib/mongo/models/UserModel";
import { db } from "@/lib/mongo/util/connectMongo";
import { signJwtAccessToken } from "@/lib/jwt";
import * as bcrypt from "bcrypt"
interface ReqBody {
    email: string;
    password: string;
}

export async function POST(request: Request) {
    await db.connect()

    const body: ReqBody = await request.json();
    let email = body.email;
    let password = body.password;
    const user = await UserModel.findOne({ email })

    if (user && (await bcrypt.compare(password, user.password))) {
        const { password, ...userWithoutPassword } = user;
        const accessToken = signJwtAccessToken(userWithoutPassword)
        const result = {
            ...userWithoutPassword,
            accessToken
        }
        return new Response(JSON.stringify(result))

    } else {
        return new Response(JSON.stringify(null))
    }
}