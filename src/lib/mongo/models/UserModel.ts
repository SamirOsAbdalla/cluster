import { Schema, model } from 'mongoose';
import * as bcrypt from "bcrypt"
interface InboxInterface {
    message: string;
    projectName: string;
    sender: string;
}

const inboxSchema = new Schema<InboxInterface>({
    message: { type: String, required: true },
    projectName: { type: String, required: true },
    sender: { type: String, required: true }
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
    inbox: { type: inboxSchema }
})

userSchema.pre("save", async function (next: (err?: Error) => void) {
    if (!this.isModified("password")) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
})


export const UserModel = model<UserInterface>("User", userSchema)