import "./TaskMemberAdd.css"
import { Dispatch, SetStateAction, useState } from "react"
import { MemberInterface } from "@/lib/mongo/models/GroupModel"
import { TaskMemberType } from "@/lib/mongo/models/TaskModel";
import { useEffect } from "react";
interface Props {
    memberName: string,
    memberEmail: string
    addedMembers: TaskMemberType[];
    setAddedMembers: Dispatch<SetStateAction<TaskMemberType[]>>
    initialActiveStatus?: "active" | 'inactive'
}
export default function TaskMemberAdd({ memberName, memberEmail, addedMembers, setAddedMembers, initialActiveStatus }: Props) {

    const [activeStatus, setActiveStatus] = useState<"active" | "inactive">("inactive")

    useEffect(() => {
        if (initialActiveStatus == "active") {
            setActiveStatus("active")
        }
    }, [])

    const handleActiveStatusChange = () => {
        if (activeStatus == "active") {
            setActiveStatus("inactive")
            const tempAddedMembers = addedMembers.filter(member => member.memberEmail != memberEmail)
            setAddedMembers(tempAddedMembers)
            return;
        }

        setActiveStatus("active")
        let tempAddedMembers = [...addedMembers]
        tempAddedMembers.push({ memberEmail, memberName, status: "In Progress" })
        setAddedMembers(tempAddedMembers)
    }

    return (
        <div onClick={handleActiveStatusChange} className={`tm__wrapper ${"tm__wrapper__" + activeStatus}`}>
            <div className="tm__name">
                {memberName}
            </div>
            {activeStatus == "active" ? <span>*Added*</span> : <></>}
        </div>
    )
}
