

import "./MembersSection.css"

import React from 'react'
import MemberCard from "../MemberCard/MemberCard"
import { AiOutlinePlusCircle } from "react-icons/ai"
import KickMemberModal from "../KickMemberModal/KickMemberModal"
import { useState } from "react"
import { MemberInterface } from "@/lib/mongo/models/GroupModel"
import { Dispatch, SetStateAction } from "react"
import InviteMemberModal from "../InviteMemberModal/InviteMemberModal"
import { GrGroup } from "react-icons/gr"
import { TaskMemberType } from "@/lib/mongo/models/TaskModel"
interface Props {
    groupCreatorEmail: string;
    userEmail?: string;
    groupName: string
    groupMembers: MemberInterface[]
    setGroupMembers: Dispatch<SetStateAction<MemberInterface[]>>
    groupId: string;
    userName?: string
}
export default function MembersSection({ groupName, groupId, groupCreatorEmail,
    userEmail, groupMembers, setGroupMembers, userName }: Props) {
    const [inviteMemberModalStatus, setInviteMemberModalStatus] = useState<"open" | "closed">("closed")
    const [kickModalStatus, setKickModalStatus] = useState<"open" | "closed">("closed")
    const [kickModalMemberName, setKickModalMemberName] = useState<string>("")
    const [kickModalMemberEmail, setKickModalMemberEmail] = useState<string>("")
    const [showMemberButtonStatus, setShowMemberButtonStatus] = useState<"Show more" | "Show less">("Show more")
    const toggleMemberButtonStatus = () => {
        if (showMemberButtonStatus == "Show less") {
            setShowMemberButtonStatus("Show more")
            return
        }
        setShowMemberButtonStatus("Show less")
    }
    return (
        <div className="memberssection__wrapper">


            <div className="members__section">

                <div className="members__section__container">
                    <div className="memberssection__icon__container">
                        <GrGroup className="memberssection__icon" />
                    </div>

                    <div className="members__heading">
                        Group Members
                    </div>
                    <button
                        onClick={() => {
                            setInviteMemberModalStatus("open")
                            setKickModalStatus("closed")
                        }}
                        className="member__button"
                    >
                        <AiOutlinePlusCircle className="memberbutton__circle" />
                        <span className="memberbutton__text">Invite Member</span>
                    </button>
                </div>
                {inviteMemberModalStatus == "open" &&
                    <InviteMemberModal
                        groupName={groupName}
                        groupId={groupId}
                        userEmail={userEmail}
                        groupMembers={groupMembers}
                        inviteMemberModalStatus={inviteMemberModalStatus}
                        setInviteMemberModalStatus={setInviteMemberModalStatus}
                        userName={userName}
                    />
                }
                {showMemberButtonStatus == "Show less" &&
                    <div className="members__list">
                        {
                            groupCreatorEmail == userEmail ?
                                groupMembers.map(member =>
                                    <MemberCard key={member.memberEmail}
                                        setKickModalStatus={setKickModalStatus}
                                        setKickModalMemberEmail={setKickModalMemberEmail}
                                        kickModalStatus={kickModalStatus}
                                        setKickModalMemberName={setKickModalMemberName}
                                        memberEmail={member.memberEmail}
                                        memberName={member.memberName}
                                        memberProfilePicture={member.profilePicture}
                                        currentUserEmail={userEmail}
                                        isProjectCreator={true}
                                        setInviteMemberModalStatus={setInviteMemberModalStatus}
                                    />) :
                                groupMembers.map(member =>
                                    <MemberCard key={member.memberEmail}
                                        setKickModalMemberEmail={setKickModalMemberEmail}
                                        setKickModalMemberName={setKickModalMemberName}
                                        kickModalStatus={kickModalStatus}
                                        setKickModalStatus={setKickModalStatus}
                                        memberEmail={member.memberEmail}
                                        memberName={member.memberName}
                                        memberProfilePicture={member.profilePicture}
                                    />)
                        }
                    </div>}
                {groupMembers.length > 0 &&
                    <button onClick={toggleMemberButtonStatus} className="showmembers__button">
                        {showMemberButtonStatus}
                    </button>
                }

            </div>
            {kickModalStatus == "open" &&
                <KickMemberModal
                    groupId={groupId}
                    groupMembers={groupMembers}
                    setGroupMembers={setGroupMembers}
                    kickedMemberEmail={kickModalMemberEmail}
                    kickedMemberName={kickModalMemberName}
                    setKickModalStatus={setKickModalStatus}
                />
            }

        </div>
    )
}
