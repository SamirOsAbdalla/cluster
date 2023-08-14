
import "./MemberCard.css"
import { BsPersonFill } from "react-icons/bs"
import React from 'react'
import { useSession } from "next-auth/react"
import { useState } from "react"
import { Dispatch, SetStateAction } from "react";
import Image from "next/image"
import defaultImage from "../../../public/default.png"

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
                {memberProfilePicture ?
                    <Image fill src={memberProfilePicture} alt="Profile Picture" className="memberprof__pic" /> :
                    <Image fill src={defaultImage} alt="Profile Picture" className="memberprof__pic" />
                }
            </div>
            <h1 className="membercard__name membercard__text">
                {memberName}
            </h1>
            <div className="membercard__email membercard__text">
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
