"use client"

import React from 'react'
import "./NewTaskModal.css"
import { useState, useEffect } from 'react'
import { AiFillCloseCircle } from "react-icons/ai";
import { Dispatch, SetStateAction } from 'react';
import { TaskInterface, TaskPriority } from '@/lib/mongo/models/TaskModel';
import { useSession } from 'next-auth/react';
import { MemberInterface } from '@/lib/mongo/models/GroupModel';
import TaskMemberAdd from '../TaskMemberAdd/TaskMemberAdd';


interface Props {
    setNewTaskModalStatus: Dispatch<SetStateAction<"open" | "closed">>
    groupId: string,
    tasks: TaskInterface[]
    setTasks: Dispatch<SetStateAction<TaskInterface[]>>
    groupMembers: MemberInterface[]
}


export default function NewTaskModal({ setNewTaskModalStatus, groupId, tasks, setTasks, groupMembers }: Props) {

    const [newTaskNameInput, setNewTaskNameInput] = useState<string>("")
    const [newTaskDescriptionInput, setNewTaskDescriptionInput] = useState<string>("")
    const [taskPriority, setTaskPriority] = useState<TaskPriority>("Medium")
    const [addedMembers, setAddedMembers] = useState<MemberInterface[]>([])
    const session = useSession()
    const userEmail = session.data?.user.email
    const userName = session.data?.user.name

    const createNewTask = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!userEmail || !userName) {
            return;
        }

        let tempAddedMembers = addedMembers
        tempAddedMembers.push({ memberEmail: userEmail!, memberName: userName! })
        const newTaskBody: TaskInterface = {
            name: newTaskNameInput,
            description: newTaskDescriptionInput,
            creator: {
                memberEmail: userEmail!,
                memberName: userName!
            },
            dateCreated: new Date(),
            priority: taskPriority,
            isUrgent: taskPriority == "Urgent" ? true : false,
            groupId,
            members: tempAddedMembers
        }

        const newTaskResponse = await fetch("http://localhost:3000/api/tasks/createNewTask", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newTaskBody),
        })

        const newTaskResponseJSON = await newTaskResponse.json()

        if (!newTaskResponseJSON) {
            //throw error
        }

        setNewTaskModalStatus("closed")
        const tempTasks = tasks
        tempTasks.push(newTaskResponseJSON)
        setTasks(tempTasks)
    }
    return (
        <div className="ntmodal__wrapper">
            <AiFillCloseCircle className="ntmodal__close" onClick={() => setNewTaskModalStatus("closed")} />
            <form onSubmit={createNewTask} className="ntmodal__form">
                <div className="ntmodal__item">
                    <div className="ntmodal__name">
                        Task Name
                    </div>
                    <input
                        required
                        placeholder='Task name'
                        value={newTaskNameInput}
                        onChange={(e) => setNewTaskNameInput(e.target.value)}
                    />
                </div>
                <div className="ntmodal__item">
                    <div className="ntmodal__description">
                        Task Description
                    </div>
                    <input
                        required
                        placeholder='Task description'
                        value={newTaskDescriptionInput}
                        onChange={(e) => setNewTaskDescriptionInput(e.target.value)}
                    />
                </div>
                <div className="ntmodal__priority__container">
                    <div className="ntmodal__priority__heading">
                        Priority
                    </div>
                    <div className="ntmodal__priority__buttons">
                        <button onClick={() => setTaskPriority("Low")} type="button" className="ntmodal__priority__button ntmodal__low">
                            Low
                        </button>
                        <button onClick={() => setTaskPriority("Medium")} type="button" className="ntmodal__priority__button ntmodal__medium">
                            Medium
                        </button>
                        <button onClick={() => setTaskPriority("High")} type="button" className="ntmodal__priority__button ntmodal__high">
                            High
                        </button>
                        <button onClick={() => setTaskPriority("Urgent")} type="button" className="ntmodal__priority__button ntmodal__urgent">
                            Urgent
                        </button>
                    </div>
                </div>
                <div className="tmadd__container">

                    <div className="ntmodal__addmember">
                        Add Members
                    </div>
                    {groupMembers.map(groupMember => {
                        if (groupMember.memberEmail == userEmail) {
                            return (
                                <React.Fragment key={groupMember.memberEmail}>

                                </React.Fragment>
                            )
                        }
                        return (
                            <React.Fragment key={groupMember.memberEmail}>
                                <TaskMemberAdd
                                    memberEmail={groupMember.memberEmail}
                                    memberName={groupMember.memberName}
                                    addedMembers={addedMembers}
                                    setAddedMembers={setAddedMembers}
                                />
                            </React.Fragment>)
                    }
                    )}
                </div>

                <div>
                    <button type="submit">
                        Create
                    </button>
                    <button type="button" onClick={() => setNewTaskModalStatus("closed")}>
                        Cancel
                    </button>
                </div>
            </form>

        </div>
    )
}
