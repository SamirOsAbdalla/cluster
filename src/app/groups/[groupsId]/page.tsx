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
import { TaskInterface, TaskMemberType } from '@/lib/mongo/models/TaskModel'
import DisplayedTask from '@/components/DisplayedTask/DisplayedTask'
import LoadingGroup from '@/components/LoadingGroup/LoadingGroup'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import Header from '@/components/Header/Header'

export default function GroupDetails({ params }: { params: { groupsId: string } }) {
    const session = useSession()
    const userEmail = session.data?.user.email
    const userName = session.data?.user.name
    const [groupName, setGroupName] = useState<string>("")
    const [groupDescription, setGroupDescription] = useState<string>("")
    const [groupMembers, setGroupMembers] = useState<MemberInterface[]>([])
    const [displayedTask, setDisplayedTask] = useState<TaskInterface>({} as TaskInterface)
    const [loading, setLoading] = useState<boolean>(false)
    const groupCreatorEmail = useRef("")
    const router = useRouter()
    const paramsId = params.groupsId
    useEffect(() => {
        //function that fetches current group information by id
        const fetchCurrentGroup = async () => {
            if (!paramsId) {
                return;
            }
            setLoading(true)
            const groupBody = {
                groupId: paramsId
            }

            const groupResponse = await fetch("/api/groups/fetchGroupById", {
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
            setLoading(false)
        }
        fetchCurrentGroup()
    }, [paramsId])

    // const groupQuery = useQuery({
    //     queryKey: ['group'],
    //     queryFn: fetchCurrentGroup,
    //     enabled: !!params.groupsId
    // })


    return (
        <PageWrapper>
            <Header headerText={groupName} />

            <div className="groupdetails__wrapper">
                {loading ? <LoadingGroup type="loadingGroups" /> : <>
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
                        groupName={groupName}
                        groupId={params.groupsId}
                        groupMembers={groupMembers}
                        taskTableType='group'
                        setDisplayedTask={setDisplayedTask}
                    />
                    {displayedTask.creator &&
                        <DisplayedTask
                            task={displayedTask}
                            setDisplayedTask={setDisplayedTask}
                        />
                    }
                </>}
            </div>


        </PageWrapper >

    )
}
