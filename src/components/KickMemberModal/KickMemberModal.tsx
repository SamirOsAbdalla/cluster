import { MemberInterface } from "@/lib/mongo/models/GroupModel";
import "./KickMemberModal.css"
import React from 'react'
import { Dispatch, SetStateAction, useState } from "react";
import { TaskMemberType } from "@/lib/mongo/models/TaskModel";
import { AiFillCloseCircle } from "react-icons/ai";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import ModalWrapper from "../ModalWrapper/ModalWrapper";

interface Props {
    kickedMemberName: string;
    kickedMemberEmail: string;
    groupMembers: MemberInterface[]
    setGroupMembers: Dispatch<SetStateAction<MemberInterface[]>>
    groupId: string;
    setKickModalStatus: Dispatch<SetStateAction<"open" | "closed">>
}
export default function KickMemberModal({ groupId, kickedMemberName, kickedMemberEmail,
    setKickModalStatus, groupMembers, setGroupMembers }: Props) {

    const [loading, setLoading] = useState<boolean>(false)
    const setButtonsDisabled = () => {
        const confirmButton = document.querySelector(".kickmodal__kick") as HTMLButtonElement
        const cancelButton = document.querySelector(".kickmodal__cancel") as HTMLButtonElement
        confirmButton.disabled = true
        cancelButton.disabled = true
    }

    const kickMember = async () => {
        setButtonsDisabled()
        setLoading(true)
        const kickMemberBody = {
            userEmail: kickedMemberEmail,
            groupId
        }

        const kickMemberResponse = await fetch("/api/groupmember/removeGroupMember", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(kickMemberBody),
        })

        const kickMemberResponseJSON = await kickMemberResponse.json()
        if (kickMemberResponseJSON) {
            const filteredGroupMembers = groupMembers.filter(groupMember => groupMember.memberEmail != kickedMemberEmail)
            setGroupMembers(filteredGroupMembers)
            setKickModalStatus("closed")
            setLoading(false)
        } else {
            //throw error
        }
    }

    const closeModal = () => {
        setKickModalStatus("closed")

    }
    return (
        <ModalWrapper closeModal={closeModal}>
            <div className="modal">
                <AiFillCloseCircle onClick={() => setKickModalStatus("closed")} className="kickmodal__close" />
                <div className="kickmodal__heading">
                    <p>Are you sure you want to kick <span>{kickedMemberName}</span></p>
                </div>
                <div className="kickmodal__buttons">
                    <button onClick={kickMember} className="kickmodal__button kickmodal__kick blue__button">
                        {loading ? <LoadingSpinner type="button" /> : "Kick"}
                    </button>
                    <button onClick={() => setKickModalStatus("closed")} className="kickmodal__button kickmodal__cancel cancel">
                        Cancel
                    </button>
                </div>
            </div>
        </ModalWrapper>

    )
}
