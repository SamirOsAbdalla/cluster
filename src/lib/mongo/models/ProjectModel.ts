import { Schema, model, connect, models } from 'mongoose';
import { UserInterface, userSchema } from './UserModel';
import { FcDataEncryption } from 'react-icons/fc';

export interface CommentInterface {
    message: string;
    creator: string;
    dateCreated: Date;
}

const commentSchema = new Schema<CommentInterface>({
    message: { type: String, required: true },
    creator: { type: String, required: true },
    dateCreated: { type: Date, default: new Date() }
})


export interface TaskInterface {
    name: string;
    description: string;
    creator: string;
    dateCreated: Date;
    priority: string;
    status: "Completed" | "In Progress";
    comments: CommentInterface[]
}

export interface MemberInterface {
    memberEmail: string;
    memberName: string
}

const memberSchema = new Schema<MemberInterface>({
    memberEmail: { type: String, required: true },
    memberName: { type: String, required: true },
})



const taskSchema = new Schema<TaskInterface>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    creator: memberSchema,
    dateCreated: { type: Date, default: new Date() },
    priority: { type: String, required: true },
    status: { type: String, required: true },
    comments: [commentSchema]
})

export interface ProjectInterface {
    name: string;
    creator: MemberInterface;
    description: string;
    members: string[];
    tasks: TaskInterface[]
    dateCreated: Date;
}

const projectSchema = new Schema<ProjectInterface>({
    name: { type: String, required: true },
    creator: memberSchema,
    description: { type: String, required: true },
    members: [memberSchema],
    tasks: [taskSchema],
    dateCreated: { type: Date, default: new Date() },
})

const ProjectModel = models.Project || model<ProjectInterface>("Project", projectSchema)
export default ProjectModel