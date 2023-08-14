"use client"
import "./InviteMemberModal.css"
import { AiOutlinePlusCircle } from "react-icons/ai"
import { AiFillCloseCircle } from "react-icons/ai";
import { Dispatch, SetStateAction } from "react";
import { useState } from "react"
import React from 'react'
import { MemberInterface } from "@/lib/mongo/models/GroupModel";
import { BsFillPersonFill } from "react-icons/bs";
import { AiOutlineCloseCircle } from "react-icons/ai";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
interface Props {
    groupMembers: MemberInterface[]
    inviteMemberModalStatus: "open" | "closed"
    setInviteMemberModalStatus: Dispatch<SetStateAction<"open" | "closed">>
    groupName: string,
    userEmail?: string,
    userName?: string
    groupId: string
}
export default function InviteMemberModal({ groupName, userEmail, groupId,
    groupMembers, inviteMemberModalStatus, setInviteMemberModalStatus, userName }: Props) {
    const [inputInvitedMember, setInputInvitedMember] = useState<string>("")
    const [invitedMembers, setInvitedmembers] = useState<Set<string>>(new Set())
    const [loading, setLoading] = useState<boolean>(false)


    const setButtonsDisabled = () => {
        const acceptButton = document.querySelector(".invitemodal__submit") as HTMLButtonElement
        const rejectButton = document.querySelector(".invitemodal__cancel") as HTMLButtonElement
        acceptButton.disabled = true;
        rejectButton.disabled = true
    }

    const addInvitedMember = () => {
        for (let i = 0; i < groupMembers.length; i++) {
            if (groupMembers[i].memberEmail == inputInvitedMember) {
                return;
            }
        }
        const newSet = new Set(invitedMembers)
        newSet.add(inputInvitedMember)
        setInputInvitedMember("")
        setInvitedmembers(newSet)
    }
    const inviteMembers = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (invitedMembers.size > 0) {
            setLoading(true)
            setButtonsDisabled()
            const membersArray = Array.from(invitedMembers)
            const inviteBody = {
                groupName,
                groupId,
                senderName: userName,
                senderEmail: userEmail,
                addedMembers: membersArray
            }

            const inviteResponse = await fetch("http://localhost:3000/api/inbox/sendInvites", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(inviteBody),
            })

            const inviteResponseJSON = await inviteResponse.json()
            if (inviteResponseJSON) {
                setInviteMemberModalStatus("closed")
            } else {
                //throw error
            }
            setLoading(false)
        } else {
            setInviteMemberModalStatus("closed")
        }
    }

    const removeMember = (e: React.MouseEvent<SVGElement, MouseEvent>, name: string) => {
        e.preventDefault()
        const tmpSet = new Set(Array.from(invitedMembers))
        tmpSet.delete(name);
        setInvitedmembers(tmpSet)
    }
    return (
        <div className="invitemodal__wrapper">
            <form onSubmit={inviteMembers} className="invitemodal__form">
                <AiFillCloseCircle onClick={() => setInviteMemberModalStatus("closed")} className="invitemodal__close" />
                <div className="invitemodal__top">
                    <h2>Invite member</h2>
                    <button type="button" className="invitemodal__add" onClick={addInvitedMember}>
                        <AiOutlinePlusCircle />
                        <span>Invite</span>
                    </button>
                </div>
                {invitedMembers.size > 0 ? <div className="invited__members__list">
                    {Array.from(invitedMembers).map(member => (
                        <div className="invited__member" key={member}>
                            <div className="invited__member__left">
                                <BsFillPersonFill className="invited__member__icon" />
                                <div className="invited__member__name">
                                    {member}
                                </div>
                            </div>
                            <AiOutlineCloseCircle onClick={(e) => removeMember(e, member)} className="invited__remove" />

                        </div>
                    ))}
                </div> :
                    <></>
                }

                <input
                    type="email"
                    placeholder="newmember@gmail.com"
                    value={inputInvitedMember}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputInvitedMember(e.target.value)}
                />

                <div className="invitemodal__buttons">
                    <button type="submit" className="invitemodal__button invitemodal__submit">{loading ? <LoadingSpinner type="button" /> : "Submit"}</button>
                    <button onClick={() => setInviteMemberModalStatus("closed")} className="invitemodal__button invitemodal__cancel">Cancel</button>
                </div>
            </form>


        </div>
    )
}
