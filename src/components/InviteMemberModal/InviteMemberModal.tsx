import "./InviteMemberModal.css"
import { AiOutlinePlusCircle } from "react-icons/ai"
import { AiFillCloseCircle } from "react-icons/ai";
import { Dispatch, SetStateAction } from "react";
import { useState } from "react"
import React from 'react'
import { MemberInterface } from "@/lib/mongo/models/GroupModel";

interface Props {
    groupMembers: MemberInterface[]
    inviteMemberModalStatus: "open" | "closed"
    setInviteMemberModalStatus: Dispatch<SetStateAction<"open" | "closed">>
}
export default function InviteMemberModal({ groupMembers, inviteMemberModalStatus, setInviteMemberModalStatus }: Props) {
    const [inputInvitedMember, setInputInvitedMember] = useState<string>("")
    const [invitedMembers, setInvitedmembers] = useState<Set<string>>(new Set())
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
    const inviteMembers = async () => {

    }
    return (
        <div className="invitemodal__wrapper">
            <form className="invitemodal__form">
                <AiFillCloseCircle onClick={() => setInviteMemberModalStatus("closed")} className="invitemodal__close" />
                <div className="invitemodal__top">
                    <h2>Add member</h2>
                    <button type="button" className="invitemodal__add" onClick={addInvitedMember}>
                        <AiOutlinePlusCircle />
                        <span>Add</span>
                    </button>
                </div>
                <div className="invitemodal__invitedlist">
                    {Array.from(invitedMembers).map(invitedMember =>
                        <div key={invitedMember} className="invitemodal__invitedlistitem">
                            {invitedMember}
                        </div>)
                    }
                </div>
                <input
                    type="email"
                    placeholder="janedoe@gmail.com"
                    value={inputInvitedMember}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputInvitedMember(e.target.value)}
                    required
                />

                <div className="invitemodal__buttons">
                    <button type="submit" className="invitemodal__button invitemodal__submit">Submit</button>
                    <button onClick={() => setInviteMemberModalStatus("closed")} className="invitemodal__button invitemodal__cancel">Cancel</button>
                </div>
            </form>


        </div>
    )
}
