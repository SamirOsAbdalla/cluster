import "./TaskMemberAdd.css"
import { Dispatch, SetStateAction, useState } from "react"
import { MemberInterface } from "@/lib/mongo/models/GroupModel"

interface Props {
    memberName: string,
    memberEmail: string
    addedMembers: MemberInterface[];
    setAddedMembers: Dispatch<SetStateAction<MemberInterface[]>>
}
export default function TaskMemberAdd({ memberName, memberEmail, addedMembers, setAddedMembers }: Props) {

    const [activeStatus, setActiveStatus] = useState<"active" | "inactive">("inactive")

    const handleActiveStatusChange = () => {
        if (activeStatus == "active") {
            setActiveStatus("inactive")
            const tempAddedMembers = addedMembers.filter(member => member.memberEmail != memberEmail)
            setAddedMembers(tempAddedMembers)
            return;
        }

        setActiveStatus("active")
        let tempAddedMembers = addedMembers
        tempAddedMembers.push({ memberEmail, memberName })
        setAddedMembers(tempAddedMembers)
    }

    return (
        <div onClick={handleActiveStatusChange} className={`tm__wrapper ${"tm__wrapper__" + activeStatus}`}>
            {memberName}
        </div>
    )
}
