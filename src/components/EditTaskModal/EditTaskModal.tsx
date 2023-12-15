import { TaskInterface, TaskMemberType, TaskPriority, TaskStatusType } from "@/lib/mongo/models/TaskModel"
import "./EditTaskModal.css"
import { Dispatch, SetStateAction, useState, useEffect } from "react"
import { MemberInterface } from "@/lib/mongo/models/GroupModel"
import TaskMemberAdd from "../TaskMemberAdd/TaskMemberAdd"
import React from "react"
import { AiFillCloseCircle, AiOutlineCloseCircle } from "react-icons/ai"
import { EditTaskBodyType } from "@/app/api/tasks/editTask/route"
import TaskPriorityButtons from "../TaskPriorityButtons/TaskPriorityButtons"
import { useSession } from "next-auth/react"
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner"
import ModalWrapper from "../ModalWrapper/ModalWrapper"
import ModalItem from "./ModalItem"

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
    const [loading, setLoading] = useState<boolean>(false)
    const options: TaskStatusType[] = ["In Progress", "Resolved"]

    const session = useSession()
    const userEmail = session.data?.user.email
    useEffect(() => {
        if (!currentTask) {
            return;
        }
        const tmpMembers = [...currentTask.members]
        setAddedMembers(tmpMembers)
    }, [currentTask])


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


    const setButtonsDisabled = () => {
        const buttons = document.querySelectorAll(".etmodal__button")
        buttons.forEach(button => {
            const tmpButton = button as HTMLButtonElement
            tmpButton.disabled = true;
        })
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

        setButtonsDisabled()
        setLoading(true)
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

        const editTaskResponse = await fetch("/api/tasks/editTask", {
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
        setLoading(false)
    }

    const closeModal = () => {
        setTaskEditModalStatus("closed")

    }
    return (
        <ModalWrapper closeModal={closeModal}>
            <div className="modal etmodal__wrapper">
                <form onSubmit={handleTaskEditSubmit}>
                    <AiFillCloseCircle className="etmodal__close" onClick={() => setTaskEditModalStatus("closed")} />
                    <div className="etmodal__title">Edit Task</div>
                    <ModalItem
                        text="Task Name"
                        value={editTaskName}
                        changeHandler={setEditTaskName}
                        placeholder={currentTask.name}
                    />
                    <ModalItem
                        text="Task Description"
                        value={editTaskDescription}
                        changeHandler={setEditTaskDescription}
                        placeholder={currentTask.description}
                    />
                    <div className="et__middle">
                        <div className="et__middle__add">
                            <div>
                                Add members
                            </div>
                            <div className="etmodal__members__list">
                                {groupMembers.map(member => {
                                    if ((currentTask.creator.memberEmail == userEmail) && member.memberEmail == userEmail) {
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
                        </div>
                        <div className="et__middle__status">
                            <div>
                                Task Status
                            </div>
                            <select defaultValue={currentTask.status} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTaskStatus(e.target.value as TaskStatusType)}>
                                {options.map((option: TaskStatusType) => {

                                    return (
                                        <option className="etmodal__option" value={option} key={option}>
                                            {option}
                                        </option>)
                                })}
                            </select>
                        </div>
                    </div>
                    <div className="etmodal__priority">
                        <div>
                            Task Priority
                        </div>
                        <TaskPriorityButtons
                            setTaskPriority={setTaskPriority}
                        />
                    </div>

                    <div className="etmodal__buttons">
                        <button className="etmodal__button etmodal__save blue__button" type="submit">
                            {loading ? <LoadingSpinner type="button" /> : "Save"}
                        </button>
                        <button className="etmodal__button etmodal__cancel cancel" type="button" onClick={() => setTaskEditModalStatus("closed")}>
                            Cancel
                        </button>
                    </div>

                </form>
            </div>
        </ModalWrapper>

    )
}
