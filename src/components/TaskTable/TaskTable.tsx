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
import CompleteTaskModal from "../CompleteTaskModal/CompleteTaskModal"
interface Props {
    groupId: string
    groupMembers: MemberInterface[]
}
export default function TaskTable({ groupId, groupMembers }: Props) {

    const session = useSession()
    const userName = session.data?.user.name
    const userEmail = session.data?.user.email


    const [tasks, setTasks] = useState<TaskInterface[]>([])
    const [currentDeleteTask, setCurrentDeleteTask] = useState<TaskInterface | null>(null)
    const [currentEditTask, setCurrentEditTask] = useState<TaskInterface | null>(null)
    const [deleteTaskModalStatus, setDeleteTaskModalStatus] = useState<"open" | "closed">("closed")
    const [newTaskModalStatus, setNewTaskModalStatus] = useState<"open" | "closed">("closed")
    const [taskEditModalStatus, setTaskEditModalStatus] = useState<"open" | "closed">("closed")
    const [completeTaskModalStatus, setCompleteTaskModalStatus] = useState<"open" | "closed">("closed")
    const [currentCompleteTaskInfo, setCurrentCompleteTaskInfo] = useState<{ taskId: string, taskName: string }>(
        { taskId: "", taskName: "" }
    )

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


    type TaskTableModalTypes = "delete" | "edit" | "complete" | "new"
    const configureModalStatus = (modalType: TaskTableModalTypes, taskInfo?: { taskId: string, taskName: string }, task?: TaskInterface) => {
        switch (modalType) {
            case "delete":
                setNewTaskModalStatus("closed")
                setTaskEditModalStatus("closed")
                setCompleteTaskModalStatus("closed")
                setDeleteTaskModalStatus("open")
                setCurrentDeleteTask(task!)
                break;
            case "edit":
                setDeleteTaskModalStatus("closed")
                setCompleteTaskModalStatus("closed")
                setNewTaskModalStatus("closed")
                setCurrentEditTask(task!)
                setTaskEditModalStatus("open")
                break;
            case "new":
                setDeleteTaskModalStatus("closed")
                setTaskEditModalStatus("closed")
                setCompleteTaskModalStatus("closed")
                setNewTaskModalStatus("open")
                break;
            case "complete":
                setNewTaskModalStatus("closed")
                setTaskEditModalStatus("closed")
                setDeleteTaskModalStatus("closed")
                setCurrentCompleteTaskInfo(taskInfo!)
                setCompleteTaskModalStatus("open")
                break;
        }
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
                <button onClick={() => configureModalStatus("new")}>New Task</button>
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
            {completeTaskModalStatus == "open" &&
                <CompleteTaskModal
                    tasks={tasks}
                    setTasks={setTasks}
                    setCompleteTaskModalStatus={setCompleteTaskModalStatus}
                    taskInfo={currentCompleteTaskInfo}
                    memberEmail={userEmail}
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
                                                    <button onClick={() => configureModalStatus("delete", { taskName: "", taskId: "" }, task)}>
                                                        Delete
                                                    </button>
                                                }
                                                {(task.creator.memberEmail == userEmail) && memberStatus == "Resolved" ?
                                                    <button>
                                                        Completed!
                                                    </button> :
                                                    <button onClick={() => configureModalStatus("complete", { taskId: task._id!, taskName: task.name })}>
                                                        Complete
                                                    </button>
                                                }

                                                {userEmail && task.creator.memberEmail == userEmail! &&
                                                    <button onClick={() => configureModalStatus("edit", { taskName: "", taskId: "" }, task)}>
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
