
import { TaskInterface, TaskStatusType } from "@/lib/mongo/models/TaskModel"
import "./TaskItems.css"
import React from "react"
import { Dispatch, SetStateAction } from "react"
import { useRouter } from "next/navigation"
interface Props {
    tasks: TaskInterface[]
    userEmail?: string
    configureModalStatus: any;
    taskTableType: "group" | "urgent"
    setDisplayedTask: Dispatch<SetStateAction<TaskInterface>>

}
export default function TaskItems({ tasks, userEmail, configureModalStatus, taskTableType, setDisplayedTask }: Props) {

    const router = useRouter()
    const findMemberStatus = (task: TaskInterface) => {
        const memberIndex = task.members.findIndex(member => member.memberEmail == userEmail)
        if (memberIndex == -1) {
            return "In Progress"
        }

        return task.members[memberIndex].status
    }

    const clickHandler = taskTableType == "group" ?
        (task: TaskInterface) => {
            setDisplayedTask(task)
        } :
        (task: TaskInterface) => {

            router.push(`/groups/${task.groupId}`)
        }
    return (
        <>
            {tasks.map(task => {

                const memberStatus = findMemberStatus(task)

                if ((task.creator.memberEmail != userEmail) && memberStatus == "Resolved") {
                    return (
                        <React.Fragment key={task._id}>

                        </React.Fragment>)
                }
                return (
                    <React.Fragment key={task._id}>
                        <tr onClick={(e) => clickHandler(task)}>
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
        </>
    )
}
