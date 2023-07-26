import { TaskInterface, TaskMemberType } from "@/lib/mongo/models/TaskModel"
import "./EditTaskModal.css"
import { Dispatch, SetStateAction, useState, useEffect } from "react"
import { MemberInterface } from "@/lib/mongo/models/GroupModel"
import TaskMemberAdd from "../TaskMemberAdd/TaskMemberAdd"
import React from "react"
import { AiOutlineCloseCircle } from "react-icons/ai"
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

    useEffect(() => {
        if (!currentTask) {
            return;
        }
        const tmpMembers = [...currentTask.members]
        setAddedMembers(tmpMembers)
    }, [])

    const handleTaskEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
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
                <div>
                    <div>
                        Add members
                    </div>
                    {groupMembers.map(member => {
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
                    <button type="submit">
                        Save
                    </button>
                    <button onClick={() => setTaskEditModalStatus("closed")}>
                        Cancel
                    </button>
                </div>

            </form>
        </div>
    )
}
