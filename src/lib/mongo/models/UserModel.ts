import { Schema, model, models } from 'mongoose';
import * as bcrypt from "bcrypt"
export interface InboxInterface {
    projectName: string;
    senderEmail: string;
    senderName: string;
    projectId: string;
    _id?: string
}

const inboxSchema = new Schema<InboxInterface>({
    projectName: { type: String, required: true },
    projectId: { type: String, required: true },
    senderEmail: { type: String, required: true },
    senderName: { type: String, required: true }
})

export interface UserInterface {
    name: string;
    email: string;
    password: string;
    picture: string;
    inbox?: InboxInterface[]
}

export const userSchema = new Schema<UserInterface>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    picture: { type: String, required: false },
    inbox: { type: [inboxSchema] }
})

userSchema.pre("save", async function (next: (err?: Error) => void) {
    if (!this.isModified("password")) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
})


const UserModel = models.User || model<UserInterface>("User", userSchema)
export default UserModel