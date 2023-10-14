import { Schema, model, connect, models } from 'mongoose';
import { MemberInterface, memberSchema } from './GroupModel';

export type TaskPriority = "Low" | "Medium" | "High" | "Urgent"
export type TaskStatusType = "In Progress" | "Resolved"


export type TaskMemberType = MemberInterface & {
    status: TaskStatusType
}

const taskMemberSchema = new Schema<TaskMemberType>({
    memberEmail: { type: String, required: true },
    memberName: { type: String, required: true },
    profilePicture: { type: String, required: false, default: "" },
    status: { type: String, required: true }
})

export interface TaskInterface {
    groupId: string;
    groupName: string;
    name: string;
    priority: TaskPriority;
    status: TaskStatusType
    description: string;
    creator: MemberInterface;
    dateCreated: Date;
    isUrgent: boolean;
    members: TaskMemberType[]
    _id?: string
}
const taskSchema = new Schema<TaskInterface>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    groupName: { type: String, required: true },
    creator: memberSchema,
    dateCreated: { type: Date, default: new Date() },
    isUrgent: { type: Boolean, default: false },
    priority: { type: String, required: true },
    groupId: { type: String, required: true },
    members: { type: [taskMemberSchema], required: true },
    status: { type: String, required: true }
})

const TaskModel = models.Task || model<TaskInterface>("Task", taskSchema)
export default TaskModel