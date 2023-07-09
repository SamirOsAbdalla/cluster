"use client"
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { InboxInterface } from '@/lib/mongo/models/UserModel'
import "./inbox.css"
import React from 'react'
import InboxItem from '@/components/InboxItem/InboxItem'

export default function Inbox() {
    const data = useSession()
    const userEmail = data?.data?.user.email
    const userName = data?.data?.user.name

    const [inbox, setInbox] = useState<InboxInterface[]>([])
    const [error, setError] = useState<string>("")
    useEffect(() => {
        const fetchInbox = async () => {

            const user = {
                userEmail: userEmail
            }
            const response = await fetch("http://localhost:3000/api/fetchInbox", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            });

            const respObject = await response.json()
            if (respObject) {
                setInbox(respObject)
            } else {
                setError("failedInbox")
            }
        }

        fetchInbox()

    }, [userEmail])
    return (
        <div className="inbox__wrapper">
            {inbox.map((inboxItem: InboxInterface) => (
                <InboxItem
                    key={inboxItem._id}
                    inbox={inbox}
                    setInbox={setInbox}
                    projectName={inboxItem.projectName}
                    projectSenderName={inboxItem.senderName}
                    projectSenderEmail={inboxItem.senderEmail}
                    projectId={inboxItem.projectId}
                    inviteId={inboxItem._id as string}
                />
            ))}
        </div>
    )
}
