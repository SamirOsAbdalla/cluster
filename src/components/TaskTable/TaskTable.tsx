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
interface Props {
    groupId: string
}
export default function TaskTable({ groupId }: Props) {

    const session = useSession()
    const userName = session.data?.user.name

    useEffect(() => {
        const fetchCurrentTasks = async () => {
            if (!groupId) {
                return;
            }
            const fetchTasksBody = {
                groupId
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
    // const taskQuery = useQuery({
    //     queryKey: ['task'],
    //     queryFn: fetchCurrentTasks
    // })
    const [newTaskModalStatus, setNewTaskModalStatus] = useState<"open" | "closed">("closed")
    const [tasks, setTasks] = useState<TaskInterface[]>([])
    const [deleteTaskModalStatus, setDeleteTaskModalStatus] = useState<"open" | "closed">("closed")
    const [currentDeleteTask, setCurrentDeleteTask] = useState<TaskInterface | null>(null)
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

                        {tasks.map(task =>
                            <React.Fragment key={task._id}>
                                <tr>
                                    <td data-cell="name: ">{task.name}</td>
                                    <td data-cell="description: ">{task.description}</td>
                                    <td data-cell="creator: ">{task.creator.memberName}</td>
                                    <td>
                                        <button>
                                            {task.priority}
                                        </button>
                                    </td>
                                    <td>
                                        <button onClick={() => handleDeleteClick(task)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            </React.Fragment>
                        )}


                    </tbody>
                </table>
            </section>
        </main>
    )
}
