import { TaskInterface, TaskMemberType, TaskPriority, TaskStatusType } from "@/lib/mongo/models/TaskModel"
import "./EditTaskModal.css"
import { Dispatch, SetStateAction, useState, useEffect } from "react"
import { MemberInterface } from "@/lib/mongo/models/GroupModel"
import TaskMemberAdd from "../TaskMemberAdd/TaskMemberAdd"
import React from "react"
import { AiOutlineCloseCircle } from "react-icons/ai"
import { EditTaskBodyType } from "@/app/api/tasks/editTask/route"
import TaskPriorityButtons from "../TaskPriorityButtons/TaskPriorityButtons"
import { useSession } from "next-auth/react"
interface Props {
    tasks: TaskInterface[]
    setTasks: Dispatch<SetStateAction<TaskInterface[]>>
    currentTask: TaskInterface
    setTaskEditModalStatus: Dispatch<SetStateAction<"open" | "closed">>
    groupMembers: MemberInterface[]

}

export default function EditTaskModal({ tasks, setTasks, currentTask, setTaskEditModalStatus, groupMembers }: Props) {
    const [editTaskName, setEditTaskName] = useState<string>("")
    const [editTaskDescription, setEditTaskDescription] = useState<string>("")
    const [addedMembers, setAddedMembers] = useState<TaskMemberType[]>([])
    const [taskPriority, setTaskPriority] = useState<TaskPriority>(currentTask.priority)
    const [taskStatus, setTaskStatus] = useState<TaskStatusType>(currentTask.status)
    const options: TaskStatusType[] = ["In Progress", "Resolved"]

    const session = useSession()
    const userEmail = session.data?.user.email
    useEffect(() => {
        if (!currentTask) {
            return;
        }
        const tmpMembers = [...currentTask.members]
        setAddedMembers(tmpMembers)
    }, [])

    const taskMembersChanged = () => {
        if (currentTask.members.length != addedMembers.length) {
            return true;
        }
        const map = new Map<string, number>()
        for (let i = 0; i < currentTask.members.length; i++) {
            map.set(currentTask.members[i].memberEmail, 1)
        }

        for (let j = 0; j < addedMembers.length; j++) {
            if (!(map.get(addedMembers[j].memberEmail))) {
                return true;
            }
        }

        return false;
    }
    const handleTaskEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const didTaskMembersChange: boolean = taskMembersChanged()
        //if nothing changed don't make api call
        if (!editTaskName &&
            !editTaskDescription &&
            !didTaskMembersChange &&
            currentTask.priority == taskPriority &&
            currentTask.status == taskStatus) {
            setTaskEditModalStatus("closed")
            return;
        }
        const didNameChange: boolean = !!editTaskName
        const didDescriptionChange: boolean = !!editTaskDescription
        const newTaskName = didNameChange ? editTaskName : currentTask.name
        const newTaskDescription = didDescriptionChange ? editTaskDescription : currentTask.description
        const newTaskStatus = taskStatus
        const newTaskPriority = taskPriority
        const editTaskBody: EditTaskBodyType = {
            newTaskName,
            newTaskDescription,
            newTaskStatus,
            newTaskPriority,
            newTaskMembers: addedMembers,
            currentTaskId: currentTask._id
        }

        const editTaskResponse = await fetch("http://localhost:3000/api/tasks/editTask", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(editTaskBody),
        })

        const editTaskResponseJSON = await editTaskResponse.json()
        if (!editTaskResponseJSON) {
            //throw error
        }

        //update original task in tasks with new members
        const taskIndex = tasks.findIndex(currentOriginalTask => currentOriginalTask._id == currentTask._id)
        if (taskIndex == -1) {
            //throw error
        }
        const tempTasks = [...tasks]
        tempTasks[taskIndex].members = [...addedMembers]
        tempTasks[taskIndex].name = newTaskName
        tempTasks[taskIndex].description = newTaskDescription
        tempTasks[taskIndex].status = newTaskStatus
        tempTasks[taskIndex].priority = newTaskPriority
        setTasks(tempTasks)
        setTaskEditModalStatus("closed")
    }
    return (
        <div className="etmodal__wrapper">
            <form onSubmit={handleTaskEditSubmit}>
                <AiOutlineCloseCircle onClick={() => setTaskEditModalStatus("closed")} />
                <div>
                    <div>
                        Task Name
                    </div>
                    <input
                        value={editTaskName}
                        onChange={(e) => setEditTaskName(e.target.value)}
                        placeholder={currentTask.name}
                    />
                </div>
                <div>
                    <div>
                        Task Description
                    </div>
                    <input
                        value={editTaskDescription}
                        onChange={(e) => setEditTaskDescription(e.target.value)}
                        placeholder={currentTask.description}
                    />
                </div>
                <div className="et__middle">
                    <div>
                        <div>
                            Add members
                        </div>
                        {groupMembers.map(member => {
                            if (currentTask.creator.memberEmail == userEmail) {
                                return <React.Fragment key={member.memberEmail}>

                                </React.Fragment>
                            }
                            if (currentTask.members.findIndex(currentTaskMember => currentTaskMember.memberEmail == member.memberEmail) != -1) {
                                return (
                                    <React.Fragment key={member.memberEmail}>
                                        <TaskMemberAdd
                                            memberEmail={member.memberEmail}
                                            memberName={member.memberName}
                                            addedMembers={addedMembers}
                                            setAddedMembers={setAddedMembers}
                                            initialActiveStatus="active"
                                        />
                                    </React.Fragment>
                                )
                            }
                            return (
                                <React.Fragment key={member.memberEmail}>
                                    <TaskMemberAdd
                                        memberEmail={member.memberEmail}
                                        memberName={member.memberName}
                                        addedMembers={addedMembers}
                                        setAddedMembers={setAddedMembers}
                                    />
                                </React.Fragment>
                            )
                        })}
                    </div>
                    <div>
                        <div>
                            Task Status
                        </div>
                        <select defaultValue={currentTask.status} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTaskStatus(e.target.value as TaskStatusType)}>
                            {options.map((option: TaskStatusType) => {

                                return (
                                    <option value={option} key={option}>
                                        {option}
                                    </option>)
                            })}
                        </select>
                    </div>
                </div>
                <div>
                    <div>
                        Task Priority
                    </div>
                    <TaskPriorityButtons
                        setTaskPriority={setTaskPriority}
                    />
                </div>

                <div>
                    <button type="submit">
                        Save
                    </button>
                    <button type="button" onClick={() => setTaskEditModalStatus("closed")}>
                        Cancel
                    </button>
                </div>

            </form>
        </div>
    )
}
