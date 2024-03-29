"use client"
import "./TaskTable.css"
import React, { Dispatch, SetStateAction } from 'react'
import { useState } from "react"
import NewTaskModal from "../NewTaskModal/NewTaskModal"
import { useQuery } from '@tanstack/react-query'
import { TaskInterface, TaskMemberType } from "@/lib/mongo/models/TaskModel"
import { AiOutlinePlusCircle } from "react-icons/ai"
import { useEffect } from "react"
import { useSession } from "next-auth/react"
import DeleteTaskModal from "../DeleteTaskModal/DeleteTaskModal"
import { MemberInterface } from "@/lib/mongo/models/GroupModel"
import CompleteTaskModal from "../CompleteTaskModal/CompleteTaskModal"
import EditTaskModal from "../EditTaskModal/EditTaskModal"
import TaskItems from "../TaskItems/TaskItems"
import { useRouter } from "next/router"
import Image from "next/image"
import TablePagination from "../TablePagination/TablePagination"
import EmptyPage from "../EmptyPage/EmptyPage"
import LoadingGroup from "../LoadingGroup/LoadingGroup"
interface Props {
    groupName?: string
    groupId?: string
    loading?: boolean
    groupMembers?: MemberInterface[],
    taskTableType: "group" | "urgent" | "user",
    setDisplayedTask?: Dispatch<SetStateAction<TaskInterface>>
}
export default function TaskTable({ loading, groupId, groupMembers, taskTableType, setDisplayedTask, groupName }: Props) {

    const session = useSession()
    const userName = session.data?.user.name
    const userEmail = session.data?.user.email


    const [tasks, setTasks] = useState<TaskInterface[]>([])
    const [taskLoading, setTaskLoading] = useState<boolean>(false)
    const [currentDeleteTask, setCurrentDeleteTask] = useState<TaskInterface | null>(null)
    const [currentEditTask, setCurrentEditTask] = useState<TaskInterface | null>(null)
    const [deleteTaskModalStatus, setDeleteTaskModalStatus] = useState<"open" | "closed">("closed")
    const [newTaskModalStatus, setNewTaskModalStatus] = useState<"open" | "closed">("closed")
    const [taskEditModalStatus, setTaskEditModalStatus] = useState<"open" | "closed">("closed")
    const [completeTaskModalStatus, setCompleteTaskModalStatus] = useState<"open" | "closed">("closed")
    const [currentCompleteTaskInfo, setCurrentCompleteTaskInfo] = useState<{ taskId: string, taskName: string }>(
        { taskId: "", taskName: "" }
    )

    const [currentPage, setCurrentPage] = useState<number>(1)
    const tasksPerPage = 3;
    const totalNumberOfPages = Math.ceil(tasks.length / tasksPerPage)
    const lastIndex = currentPage * tasksPerPage;
    const firstIndex = lastIndex - tasksPerPage
    const displayedTasks = tasks.slice(firstIndex, lastIndex)

    const fetchUrgentTasks = async () => {
        if (!taskTableType || !userEmail) {
            return;
        }

        const fetchUrgentTaskBody = {
            memberEmail: userEmail
        }

        const fetchUTResponse = await fetch("/api/tasks/fetchUrgentTasks", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(fetchUrgentTaskBody),
        })
        const fetchUTResponseJSON = await fetchUTResponse.json()

        //check for empty error too
        if (!fetchUTResponseJSON) {
            //throw error
        }

        setTasks(fetchUTResponseJSON)
    }

    const fetchCurrentGroupTasks = async () => {
        if (!groupId || !userEmail) {
            return;
        }
        const fetchTasksBody = {
            groupId,
            memberEmail: userEmail
        }

        const fetchTasksResponse = await fetch("/api/tasks/fetchTasks", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(fetchTasksBody),
        })

        const fetchTasksResponseJSON = await fetchTasksResponse.json()

        //check for empty error too
        if (!fetchTasksResponseJSON) {
            //throw error
        }

        setTasks(fetchTasksResponseJSON)
        return fetchTasksResponseJSON
    }

    const fetchUserTasks = async () => {
        if (!userEmail) {
            return;
        }

        const body = {
            memberEmail: userEmail
        }

        const fetchResp = await fetch("/api/tasks/fetchUserTasks", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        })

        const fetchRespJson = await fetchResp.json()
        if (!fetchRespJson) {
            //throw error
        }

        setTasks(fetchRespJson)
        setTaskLoading(false)
    }

    const decideTaskFunction = async () => {

        if (!taskTableType) {
            return;
        }


        if (taskTableType == "group") {
            await fetchCurrentGroupTasks()
        } else if (taskTableType == "urgent") {
            await fetchUrgentTasks()
        } else {
            setTaskLoading(true)
            fetchUserTasks()
        }

    }


    useEffect(() => {
        decideTaskFunction()
    }, [userEmail, taskTableType]
    )


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
    if (taskTableType == "urgent" && tasks.length == 0) {
        return (
            <></>
        )
    }

    if (taskTableType == "user") {
        if (taskLoading) {
            return <LoadingGroup type="user" />
        }

        if (!taskLoading && tasks.length == 0) {
            return (
                <EmptyPage type="user" />
            )
        }
    }

    return (
        <>{loading !== true &&
            <main className="tasktable__wrapper">

                {taskTableType == "urgent" && <div className="table__heading"><h1>Urgent Tasks</h1></div>}
                {taskTableType == "group" && <div className="table__heading">
                    <h1>Tasks</h1>
                    <button data-testid="newtask__button" className="taskable__newtaskbutton" onClick={() => configureModalStatus("new")}>
                        <AiOutlinePlusCircle />
                        New Task
                    </button>
                </div>}
                {taskTableType == "user" && <div className="table__heading"><h1>My Tasks</h1></div>}

                {newTaskModalStatus == "open" && groupId && groupMembers && taskTableType == "group" &&
                    <NewTaskModal
                        setNewTaskModalStatus={setNewTaskModalStatus}
                        groupName={groupName!}
                        tasks={tasks}
                        setTasks={setTasks}
                        groupId={groupId}
                        groupMembers={groupMembers}
                        tasksPerPage={tasksPerPage}
                        setCurrentPage={setCurrentPage}
                    />
                }
                {deleteTaskModalStatus == "open" && currentDeleteTask &&
                    <DeleteTaskModal
                        tasksPerPage={tasksPerPage}
                        setCurrentPage={setCurrentPage}
                        currentPage={currentPage}
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
                {taskEditModalStatus == "open" && currentEditTask && groupMembers &&
                    <EditTaskModal
                        groupMembers={groupMembers}
                        tasks={tasks}
                        setTasks={setTasks}
                        currentTask={currentEditTask}
                        setTaskEditModalStatus={setTaskEditModalStatus}
                    />
                }

                <table className="table tasktable__table">
                    <thead>
                        <tr>
                            <th className="tasktable__left">Name</th>
                            <th className="tasktable__expand">Description</th>
                            <th className="tasktable__expand">Group</th>
                            <th>Creator</th>
                            <th>Priority</th>
                            <th className="tasktable__right"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <TaskItems
                            tasks={displayedTasks}
                            configureModalStatus={configureModalStatus}
                            userEmail={userEmail}
                            setDisplayedTask={setDisplayedTask ? setDisplayedTask : () => { }}
                            taskTableType={taskTableType}
                        />
                    </tbody>
                </table>
                <TablePagination type={"task"} currentPage={currentPage} setCurrentPage={setCurrentPage} totalNumberOfPages={totalNumberOfPages} />

            </main>}</>


    )
}
