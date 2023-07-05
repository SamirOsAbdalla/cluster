import { Schema, model, connect, models } from 'mongoose';
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
    creator: string;
    description: string;
    members: string[];
    tasks: TaskInterface[]
    dateCreated: Date;
}

const projectSchema = new Schema<ProjectInterface>({
    name: { type: String, required: true },
    creator: { type: String, required: true },
    description: { type: String, required: true },
    members: [String],
    tasks: [taskSchema],
    dateCreated: { type: Date, default: new Date() },
})

const ProjectModel = models.Project || model<ProjectInterface>("Project", projectSchema)
export default ProjectModel