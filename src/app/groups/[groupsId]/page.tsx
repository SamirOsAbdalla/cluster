"use client"
import React from 'react'
import { useSession } from 'next-auth/react'
import { useState, useRef } from 'react'
import { GroupInterface } from '@/lib/mongo/models/GroupModel'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import "./groupDetails.css"
export default function GroupDetails({ params }: { params: { groupsId: string } }) {
    const session = useSession()
    const [groupName, setGroupName] = useState<string>("")
    const [groupDescription, setGroupDescription] = useState<string>("")
    const groupCreator = useRef("")
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
            groupCreator.current = groupResponseJSON.creator.memberEmail
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
                    <div className="groupdetail__heading">
                        Group Name
                    </div>
                    <div className="groupdetail__name">
                        {groupName}
                    </div>
                </div>
                <div className="groupdetail__container">
                    <div className="groupdetail__heading">
                        Group Description
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
                    <button>
                        Add Member
                    </button>
                </div>
                <div className="members__list">
                    Members List
                </div>
            </div>
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
