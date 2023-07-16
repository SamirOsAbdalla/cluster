"use client"
import React from 'react'
import { useSession } from 'next-auth/react'
import { useState, useRef } from 'react'
import { GroupInterface, MemberInterface } from '@/lib/mongo/models/GroupModel'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { AiOutlinePlusCircle } from 'react-icons/ai'
import { BsPencil } from 'react-icons/bs'
import "./groupDetails.css"
import MemberCard from '@/components/MemberCard/MemberCard'
import KickMemberModal from '@/components/KickMemberModal/KickMemberModal'
export default function GroupDetails({ params }: { params: { groupsId: string } }) {
    const session = useSession()
    const userEmail = session.data?.user.email
    const [groupName, setGroupName] = useState<string>("")
    const [groupDescription, setGroupDescription] = useState<string>("")
    const [groupMembers, setGroupMembers] = useState<MemberInterface[]>([])
    const [kickModalStatus, setKickModalStatus] = useState<"open" | "closed">("closed")
    const [kickModalMemberName, setKickModalMemberName] = useState<string>("")
    const [kickModalMemberEmail, setKickModalMemberEmail] = useState<string>("")

    const groupCreatorEmail = useRef("")
    const router = useRouter()

    //function that fetches current group information by id
    const fetchCurrentGroup = async () => {

        const groupBody = {
            groupId: params.groupsId
        }

        const groupResponse = await fetch("http://localhost:3000/api/groups/fetchGroupById", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(groupBody),
        })

        const groupResponseJSON: GroupInterface | null = await groupResponse.json()

        if (groupResponseJSON) {
            setGroupName(groupResponseJSON.name)
            setGroupDescription(groupResponseJSON.description)
            groupCreatorEmail.current = groupResponseJSON.creator.memberEmail
            setGroupMembers(groupResponseJSON.members)
            return groupResponseJSON
        } else {
            //throw error
        }
    }
    const groupQuery = useQuery({
        queryKey: ['group'],
        queryFn: fetchCurrentGroup,
        enabled: !!params.groupsId
    })
    //function that fetches all tasks with current group id
    const fetchCurrentGroupTasks = async () => {

    }

    return (
        <div className="groupdetails__wrapper">
            <div className="groupdetails__container">
                <div className="groupdetail__container">
                    <div className="groupdetails">
                        <div className="groupdetail__heading">
                            Group Name
                        </div>
                        {groupCreatorEmail.current == userEmail ?
                            <BsPencil className="pencil" />
                            :
                            <></>
                        }
                    </div>
                    <div className="groupdetail__name">
                        {groupName}
                    </div>
                </div>
                <div className="groupdetail__container">
                    <div className="groupdetails">
                        <div className="groupdetail__heading">
                            Group Description
                        </div>
                        {groupCreatorEmail.current == userEmail ?
                            <BsPencil className="pencil" />
                            :
                            <></>
                        }
                    </div>
                    <div className="groupdetail__name">
                        {groupDescription}
                    </div>
                </div>
            </div>
            <div className="members__section">
                <div className="members__section__container">
                    <div className="members__heading">
                        Members
                    </div>
                    <button className="member__button">
                        <AiOutlinePlusCircle className="memberbutton__circle" />
                        <span className="memberbutton__text">Invite Member</span>
                    </button>
                </div>
                <div className="members__list">
                    {
                        groupCreatorEmail.current == userEmail ?
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
                </div>
            </div>
            {kickModalStatus == "open" &&
                <KickMemberModal
                    groupId={params.groupsId}
                    kickedMemberEmail={kickModalMemberEmail}
                    kickedMemberName={kickModalMemberName}
                    setKickModalStatus={setKickModalStatus}
                />
            }
            <div className="groupdetail__tables">
                <div>
                    Task Table
                </div>
                <div>
                    Group History
                </div>
            </div>

        </div>
    )
}
