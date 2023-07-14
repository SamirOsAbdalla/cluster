import "./LeaveGroupModal.css"
import { GroupInterface } from "@/lib/mongo/models/GroupModel"
import { Dispatch, SetStateAction } from "react"
import { AiFillCloseCircle } from "react-icons/ai";
import { useSession } from "next-auth/react";
import React from 'react'

interface Props {
    groups: GroupInterface[],
    setGroups: Dispatch<SetStateAction<GroupInterface[]>>,
    leaveGroupModal: boolean,
    setLeaveGroupModal: Dispatch<SetStateAction<boolean>>,
    currentGroup: GroupInterface | null,
    currentPage: number,
    setCurrentPage: Dispatch<SetStateAction<number>>,
    groupsPerPage: number
}
export default function LeaveGroupModal({ currentGroup, leaveGroupModal, setLeaveGroupModal,
    groups, setGroups, currentPage, setCurrentPage, groupsPerPage }: Props) {
    let typecastedGroup = currentGroup as GroupInterface
    const data = useSession()
    const userEmail = data?.data?.user.email

    const editGroupTable = () => {
        const tmpGroups = groups.filter(group => group._id != typecastedGroup._id)
        if (tmpGroups.length % groupsPerPage == 0 && tmpGroups.length > 1) {
            setCurrentPage((prevState) => prevState - 1)
        }
        setLeaveGroupModal(false)
        setGroups(tmpGroups)
    }
    const leaveGroup = async () => {
        if (!userEmail) {
            return;
        }

        //delete entire group if group creator is the same as current user
        if (typecastedGroup && (typecastedGroup.creator.memberEmail == userEmail)) {
            const deleteGroupBody = {
                groupId: typecastedGroup._id
            }

            const resp = await fetch("http://localhost:3000/api/groups/deleteGroup", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(deleteGroupBody),
            });

            const finalResponse = await resp.json()
            if (finalResponse) {
                editGroupTable()
                //delete all tasks with the group id
            } else {

            }

        }//else just remove the current user
        else if (typecastedGroup && (typecastedGroup.creator.memberEmail != userEmail)) {
            const leaveGroupBody = {
                groupId: typecastedGroup._id,
                userEmail
            }
            const resp = await fetch("http://localhost:3000/api/groupmember/removeGroupMember", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(leaveGroupBody),
            });

            const finalResponse = await resp.json()
            if (finalResponse) {
                editGroupTable()
            } else {
                //handle error
            }
        }
    }
    return (
        <div className="leavemodal__wrapper">
            <AiFillCloseCircle onClick={() => setLeaveGroupModal(false)} className="leave__circle" />
            <div className="leave__heading">
                Are you sure you want to leave <span>{typecastedGroup.name}</span>?
            </div>
            <div className="leave__buttons">
                <button onClick={leaveGroup} className="leave__button leave">
                    Leave
                </button>
                <button onClick={() => setLeaveGroupModal(false)} className="leave__button cancel">
                    Cancel
                </button>
            </div>
        </div>
    )
}
