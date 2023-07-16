
import "./MemberCard.css"
import { BsPersonFill } from "react-icons/bs"
import React from 'react'
import { useSession } from "next-auth/react"
import { useState } from "react"
import { Dispatch, SetStateAction } from "react";

interface Props {
    memberName: string,
    memberEmail: string,
    memberProfilePicture?: string,
    isProjectCreator?: boolean,
    currentUserEmail?: string,
    kickModalStatus: "open" | "closed"
    setKickModalStatus: Dispatch<SetStateAction<"open" | "closed">>,
    setKickModalMemberName: Dispatch<SetStateAction<string>>
    setKickModalMemberEmail: Dispatch<SetStateAction<string>>
    setInviteMemberModalStatus?: Dispatch<SetStateAction<"open" | "closed">>
}
export default function MemberCard({
    setKickModalMemberEmail, setKickModalMemberName, memberName,
    memberEmail, memberProfilePicture, isProjectCreator,
    currentUserEmail, setKickModalStatus, setInviteMemberModalStatus }: Props) {
    const session = useSession()

    const generateKickMemberModal = () => {
        setKickModalStatus("open")
        if (setInviteMemberModalStatus) {
            setInviteMemberModalStatus("closed")
        }

        setKickModalMemberName(memberName)
        setKickModalMemberEmail(memberEmail)
    }

    return (
        <div className="membercard__wrapper">
            <div className="membercard__picture">
                {memberProfilePicture ? <></> :
                    <div className="member__emptypicture">
                        <BsPersonFill className="member__person" />
                    </div>}
            </div>
            <h1 className="membercard__name">
                {memberName}
            </h1>
            <div className="membercard__email">
                {memberEmail}
            </div>
            {isProjectCreator && currentUserEmail != memberEmail &&
                <button onClick={generateKickMemberModal} className="memberCard__button"
                >
                    Kick
                </button>
            }
        </div >

    )
}
