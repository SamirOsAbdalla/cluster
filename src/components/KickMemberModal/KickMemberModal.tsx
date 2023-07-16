import { MemberInterface } from "@/lib/mongo/models/GroupModel";
import "./KickMemberModal.css"
import React from 'react'
import { Dispatch, SetStateAction } from "react";

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
    const kickMember = async () => {

        const kickMemberBody = {
            userEmail: kickedMemberEmail,
            groupId
        }

        const kickMemberResponse = await fetch("http://localhost:3000/api/groupmember/removeGroupMember", {
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
        } else {
            //throw error
        }
    }
    return (
        <div className="kickmodal__wrapper">
            <div className="kickmodal__heading">
                <p>Are you sure you want to kick <span>{kickedMemberName}</span></p>
            </div>
            <div className="kickmodal__buttons">
                <button onClick={kickMember} className="kickmodal__button kickmodal__kick">
                    Kick
                </button>
                <button onClick={() => setKickModalStatus("closed")} className="kickmodal__button kickmodal__cancel">
                    Cancel
                </button>
            </div>
        </div>
    )
}
