import { Schema, model, connect } from 'mongoose';
import { UserInterface, userSchema } from './UserModel';
import { FcDataEncryption } from 'react-icons/fc';

interface CommentInterface {
    message: string;
    creator: string;
    dateCreated: Date;
}

const commentSchema = new Schema<CommentInterface>({
    message: { type: String, required: true },
    creator: { type: String, required: true },
    dateCreated: { type: Date, default: new Date() }
})


interface TaskInterface {
    name: string;
    description: string;
    creator: string;
    dateCreated: Date;
    priority: string;
    status: "Completed" | "In Progress";
    comments: CommentInterface[]
}



const taskSchema = new Schema<TaskInterface>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    creator: { type: String, required: true },
    dateCreated: { type: Date, default: new Date() },
    priority: { type: String, required: true },
    status: { type: String, required: true },
    comments: [commentSchema]
})

interface ProjectInterface {
    name: string;
    description: string;
    members: UserInterface;
    dateCreated: Date;
}

const projectSchema = new Schema<ProjectInterface>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    members: [userSchema],
    dateCreated: { type: Date, default: new Date() },
})

const ProjectModel = model<ProjectInterface>("Project", projectSchema)