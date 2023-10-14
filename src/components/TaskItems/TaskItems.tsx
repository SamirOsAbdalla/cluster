
import { TaskInterface, TaskStatusType } from "@/lib/mongo/models/TaskModel"
import "./TaskItems.css"
import React from "react"
import { Dispatch, SetStateAction } from "react"
import { useRouter } from "next/navigation"
interface Props {
    tasks: TaskInterface[]
    userEmail?: string
    configureModalStatus: any;
    taskTableType: "group" | "urgent" | "user"
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
                        <tr data-testid="tasktable__tr" onClick={(e) => {
                            if (e.currentTarget != e.target) {
                                return;
                            }
                            clickHandler(task)
                        }}
                        >
                            <td onClick={(e) => {
                                if (e.currentTarget != e.target) {
                                    return;
                                }
                                clickHandler(task)
                            }} className="name__cell" data-cell="NAME ">{task.name}</td>
                            <td onClick={(e) => {
                                if (e.currentTarget != e.target) {
                                    return;
                                }
                                clickHandler(task)
                            }} data-cell="DESCRIPTION " className="description__cell">{task.description}</td>
                            <td onClick={(e) => {
                                if (e.currentTarget != e.target) {
                                    return;
                                }
                                clickHandler(task)
                            }} data-cell="GROUP " className="group__cell">{task.groupName}</td>
                            <td onClick={(e) => {
                                if (e.currentTarget != e.target) {
                                    return;
                                }
                                clickHandler(task)
                            }} className="creator__cell" data-cell="CREATOR ">{task.creator.memberName}</td>
                            <td onClick={(e) => {
                                if (e.currentTarget != e.target) {
                                    return;
                                }
                                clickHandler(task)
                            }} className="priority__cell">
                                <button type="button" className={`${task.priority}__button taskitem__button`}>
                                    {task.priority}
                                </button>
                            </td>
                            <td onClick={(e) => {
                                if (e.currentTarget != e.target) {
                                    return;
                                }
                                clickHandler(task)
                            }} className="tasktable__td tasktablebuttons__container">
                                <div className="tasktable__buttons">
                                    {userEmail && task.creator.memberEmail == userEmail! &&
                                        <button className="taskitem__delete" onClick={() => configureModalStatus("delete", { taskName: "", taskId: "" }, task)}>
                                            Delete
                                        </button>
                                    }
                                    {(task.creator.memberEmail == userEmail) && memberStatus == "Resolved" ?
                                        <button className="taskitem__completed">
                                            Completed!
                                        </button> :
                                        <button className="taskitem__complete" onClick={() => configureModalStatus("complete", { taskId: task._id!, taskName: task.name })}>
                                            Complete
                                        </button>
                                    }

                                    {userEmail && task.creator.memberEmail == userEmail! && taskTableType == "group" &&
                                        <button className="taskitem__edit blue__button" onClick={() => configureModalStatus("edit", { taskName: "", taskId: "" }, task)}>
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
