import "./LeaveGroupModal.css"
import { GroupInterface } from "@/lib/mongo/models/GroupModel"
import { Dispatch, SetStateAction } from "react"
import { AiFillCloseCircle } from "react-icons/ai";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import React from 'react'
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import ModalWrapper from "../ModalWrapper/ModalWrapper";
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
export default function LeaveGroupModal({
    currentGroup,
    leaveGroupModal,
    setLeaveGroupModal,
    groups,
    setGroups,
    currentPage,
    setCurrentPage,
    groupsPerPage
}: Props) {

    let typecastedGroup = currentGroup as GroupInterface
    const data = useSession()
    const userEmail = data?.data?.user.email

    const [loading, setLoading] = useState<boolean>(false)
    const editGroupTable = () => {
        const tmpGroups = groups.filter(group => group._id != typecastedGroup._id)
        if (tmpGroups.length % groupsPerPage == 0 && tmpGroups.length > 1 && currentPage != 1) {
            setCurrentPage((prevState) => prevState - 1)
        }
        setLeaveGroupModal(false)
        setGroups(tmpGroups)
    }


    const setButtonsDisabled = () => {
        const leaveButton = document.querySelector(".leave") as HTMLButtonElement
        const cancelButton = document.querySelector(".cancel") as HTMLButtonElement
        leaveButton.disabled = true;
        cancelButton.disabled = true
    }

    const setButtonsEnabled = () => {
        const leaveButton = document.querySelector(".leave") as HTMLButtonElement
        const cancelButton = document.querySelector(".cancel") as HTMLButtonElement
        leaveButton.disabled = false;
        cancelButton.disabled = false
    }


    const leaveGroup = async () => {
        if (!userEmail) {
            return;
        }
        setButtonsDisabled()
        setLoading(true)
        //delete entire group if group creator is the same as current user
        if (typecastedGroup && (typecastedGroup.creator.memberEmail == userEmail)) {
            const deleteGroupBody = {
                groupId: typecastedGroup._id
            }

            const resp = await fetch("/api/groups/deleteGroup", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(deleteGroupBody),
            });

            const finalGroupResponse = await resp.json()
            if (finalGroupResponse) {
                editGroupTable()

                const deleteAllTasksResponse = await fetch("/api/tasks/deleteAllGroupTasks", {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(deleteGroupBody),
                })

                const deleteAllTasksResponseJSON = await deleteAllTasksResponse.json()
                if (!deleteAllTasksResponseJSON) {

                    setButtonsEnabled()
                    //throw error
                }
            } else {
                setButtonsEnabled()
                //throw error
            }
        }//else just remove the current user
        else if (typecastedGroup && (typecastedGroup.creator.memberEmail != userEmail)) {
            const leaveGroupBody = {
                groupId: typecastedGroup._id,
                userEmail
            }
            const resp = await fetch("/api/groupmember/removeGroupMember", {
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
                const removeMemberBody = {
                    userEmail
                }
                const removeMemberFromTaskResponse = await fetch("/api/tasks/removeMemberFromAllTasks", {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(removeMemberBody),
                })
                const removeMemberFromTaskResponseJSON = await removeMemberFromTaskResponse.json()
                if (!removeMemberFromTaskResponseJSON) {
                    //throw error
                    setButtonsEnabled()
                }


            } else {
                setButtonsEnabled()
                //handle error
            }
        }
        setLoading(false)
    }

    const closeModal = () => {
        setLeaveGroupModal(false)
    }

    return (
        <ModalWrapper closeModal={closeModal}>
            <div className="modal leave__group">
                <AiFillCloseCircle onClick={() => setLeaveGroupModal(false)} className="leave__circle" />
                <div className="leave__heading">
                    Are you sure you want to leave <span className="leave__projectname">{typecastedGroup.name}</span>?
                </div>
                <div className="leave__buttons">
                    <button onClick={leaveGroup} className="leave__button leave">
                        {loading ? <LoadingSpinner type="button" /> : <span data-testid="modal__leavebutton">Leave</span>}
                    </button>
                    <button onClick={() => setLeaveGroupModal(false)} className="leave__button cancel">
                        Cancel
                    </button>
                </div>
            </div>
        </ModalWrapper>

    )
}
