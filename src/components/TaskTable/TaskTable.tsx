"use client"
import "./TaskTable.css"
import React from 'react'
import { useState } from "react"
import NewTaskModal from "../NewTaskModal/NewTaskModal"
import { useQuery } from '@tanstack/react-query'
import { TaskInterface } from "@/lib/mongo/models/TaskModel"
import { useEffect } from "react"
import { useSession } from "next-auth/react"
import DeleteTaskModal from "../DeleteTaskModal/DeleteTaskModal"
import { MemberInterface } from "@/lib/mongo/models/GroupModel"
interface Props {
    groupId: string
    groupMembers: MemberInterface[]
}
export default function TaskTable({ groupId, groupMembers }: Props) {

    const session = useSession()
    const userName = session.data?.user.name
    const userEmail = session.data?.user.email
    useEffect(() => {
        const fetchCurrentTasks = async () => {
            if (!groupId) {
                return;
            }
            const fetchTasksBody = {
                groupId,
                memberEmail: userEmail
            }

            const fetchTasksResponse = await fetch("http://localhost:3000/api/tasks/fetchTasks", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(fetchTasksBody),
            })

            const fetchTasksResponseJSON = await fetchTasksResponse.json()
            if (!fetchTasksResponseJSON) {
                //throw error
            }

            setTasks(fetchTasksResponseJSON)
            return fetchTasksResponseJSON
        }
        fetchCurrentTasks()
    }, [userName])


    const handleDeleteClick = (task: TaskInterface) => {
        setNewTaskModalStatus("closed")
        setDeleteTaskModalStatus("open")
        setCurrentDeleteTask(task)
    }

    const [newTaskModalStatus, setNewTaskModalStatus] = useState<"open" | "closed">("closed")
    const [tasks, setTasks] = useState<TaskInterface[]>([])
    const [deleteTaskModalStatus, setDeleteTaskModalStatus] = useState<"open" | "closed">("closed")
    const [currentDeleteTask, setCurrentDeleteTask] = useState<TaskInterface | null>(null)

    const setTaskMemberStatus = async (taskId: string) => {
        const taskMemberStatusBody = {
            taskId,
            memberEmail: userEmail
        }

        const taskMemberStatusResponse = await fetch("http://localhost:3000/api/tasks/changeTaskMemberStatus", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(taskMemberStatusBody),
        })

        const taskMemberStatusResponseJSON = await taskMemberStatusResponse.json()
        if (!taskMemberStatusResponseJSON) {
            //throw error
        }

        const taskIndex = tasks.findIndex(task => task._id == taskId)
        if (taskIndex != -1) {

            const taskMemberIndex = tasks[taskIndex].members.findIndex(member => member.memberEmail == userEmail)
            if (taskMemberIndex != -1) {
                let tempTasks = [...tasks]
                tempTasks[taskIndex].members[taskMemberIndex].status = "Resolved"

                setTasks(tempTasks)
            }
        }
    }
    const isNotMemberResolvedTask: (currentTask: TaskInterface) => boolean = (currentTask: TaskInterface) => {

        const taskMemberIndex = currentTask.members.findIndex(member => member.memberEmail == userEmail)
        if (taskMemberIndex == -1) {
            return true;
        }

        if (currentTask.members[taskMemberIndex].status == "Resolved") {
            return false;
        }
        return true;

    }

    const findMemberStatus = (task: TaskInterface) => {
        const memberIndex = task.members.findIndex(member => member.memberEmail == userEmail)
        if (memberIndex == -1) {
            return "In Progress"
        }

        return task.members[memberIndex].status
    }


    return (
        <main className="tasktable__wrapper">
            <section className="tasktable__header">
                <h1>Tasks</h1>
                <button onClick={() => setNewTaskModalStatus("open")}>New Task</button>
            </section>
            {newTaskModalStatus == "open" &&
                <NewTaskModal
                    setNewTaskModalStatus={setNewTaskModalStatus}
                    tasks={tasks}
                    setTasks={setTasks}
                    groupId={groupId}
                    groupMembers={groupMembers}
                />
            }
            {deleteTaskModalStatus == "open" && currentDeleteTask &&
                <DeleteTaskModal
                    taskId={currentDeleteTask._id}
                    taskName={currentDeleteTask.name}
                    setDeleteTaskModalStatus={setDeleteTaskModalStatus}
                    tasks={tasks}
                    setTasks={setTasks}
                />
            }
            <section className="tasktable__body">
                <table className="tasktable__table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th className="tasktable__expand">Description</th>
                            <th>Creator</th>
                            <th>Priority</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>

                        {tasks.map(task => {

                            const memberStatus = findMemberStatus(task)

                            if ((task.creator.memberEmail != userEmail) && memberStatus == "Resolved") {
                                return (
                                    <React.Fragment key={task._id}>

                                    </React.Fragment>)
                            }
                            return (
                                <React.Fragment key={task._id}>
                                    <tr >
                                        <td data-cell="name: ">{task.name}</td>
                                        <td data-cell="description: ">{task.description}</td>
                                        <td data-cell="creator: ">{task.creator.memberName}</td>
                                        <td>
                                            <button type="button">
                                                {task.priority}
                                            </button>
                                        </td>
                                        <td>
                                            <div className="tasktable__buttons">
                                                {userEmail && task.creator.memberEmail == userEmail! &&
                                                    <button onClick={() => handleDeleteClick(task)}>
                                                        Delete
                                                    </button>
                                                }
                                                {(task.creator.memberEmail == userEmail) && memberStatus == "Resolved" ?
                                                    <button>
                                                        Completed!
                                                    </button> :
                                                    <button onClick={() => setTaskMemberStatus(task._id!)}>
                                                        Complete
                                                    </button>
                                                }

                                                {userEmail && task.creator.memberEmail == userEmail! &&
                                                    <button>
                                                        Edit
                                                    </button>
                                                }
                                            </div>

                                        </td>

                                    </tr>
                                </React.Fragment>
                            )
                        })}

                    </tbody>
                </table>
            </section>
        </main>
    )
}
