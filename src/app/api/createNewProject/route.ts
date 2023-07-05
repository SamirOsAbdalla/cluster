import { db } from "@/lib/mongo/util/connectMongo";


interface ReqBody {
    email: string;
    password: string;
}

export async function POST(request: Request) {
    await db.connect()

    const currentDate = new Date();

}