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
import InviteMemberModal from '@/components/InviteMemberModal/InviteMemberModal'
import MembersSection from '@/components/MembersSection/MembersSection'
import TaskTable from '@/components/TaskTable/TaskTable'
import { useEffect } from 'react'
import { TaskMemberType } from '@/lib/mongo/models/TaskModel'
export default function GroupDetails({ params }: { params: { groupsId: string } }) {
    const session = useSession()
    const userEmail = session.data?.user.email
    const userName = session.data?.user.name
    const [groupName, setGroupName] = useState<string>("")
    const [groupDescription, setGroupDescription] = useState<string>("")
    const [groupMembers, setGroupMembers] = useState<MemberInterface[]>([])
    const groupCreatorEmail = useRef("")
    const router = useRouter()
    const tmpI = params.groupsId
    useEffect(() => {
        //function that fetches current group information by id
        const fetchCurrentGroup = async () => {
            if (!tmpI) {
                return;
            }

            const groupBody = {
                groupId: tmpI
            }

            const groupResponse = await fetch("http://localhost:3000/api/groups/fetchGroupById", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(groupBody),
            })

            const groupResponseJSON = await groupResponse.json()

            if (groupResponseJSON) {
                setGroupName(groupResponseJSON.name)
                setGroupDescription(groupResponseJSON.description)
                groupCreatorEmail.current = groupResponseJSON.creator.memberEmail
                setGroupMembers(groupResponseJSON.members)

            } else {
                //throw error
            }
        }
        fetchCurrentGroup()
    }, [tmpI])

    // const groupQuery = useQuery({
    //     queryKey: ['group'],
    //     queryFn: fetchCurrentGroup,
    //     enabled: !!params.groupsId
    // })


    return (
        <div className="groupdetails__wrapper">
            <div className="groupdetails__container">
                <h1>
                    {groupName}
                </h1>
                <div>
                    {groupDescription}
                </div>
            </div>
            <MembersSection
                groupCreatorEmail={groupCreatorEmail.current}
                groupName={groupName}
                userEmail={userEmail}
                groupMembers={groupMembers}
                setGroupMembers={setGroupMembers}
                groupId={params.groupsId}
                userName={userName}
            />
            <TaskTable
                groupId={params.groupsId}
                groupMembers={groupMembers}
            />
        </div>
    )
}
