"use client"
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { InboxInterface, InboxItemInterface } from '@/lib/mongo/models/InboxModel'
import "./inbox.css"
import React from 'react'
import InboxItem from '@/components/InboxItem/InboxItem'

export default function Inbox() {
    const data = useSession()
    const userEmail = data?.data?.user.email
    const userName = data?.data?.user.name

    const [inbox, setInbox] = useState<InboxItemInterface[]>([])
    const [error, setError] = useState<string>("")
    useEffect(() => {
        const fetchInbox = async () => {

            if (!userEmail) {
                return;
            }
            const user = {
                userEmail: userEmail
            }
            const response = await fetch("http://localhost:3000/api/inbox/fetchInbox", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            });

            const respObject = await response.json()
            if (respObject) {
                let typecastedResp = respObject as InboxInterface
                setInbox(typecastedResp.inboxItems)
            } else {
                setError("failedInbox")
            }
        }

        fetchInbox()

    }, [userEmail])

    return (
        <div className="inbox__wrapper">
            {inbox.map((inboxItem: InboxItemInterface) => (
                <InboxItem
                    key={inboxItem._id}
                    inbox={inbox}
                    setInbox={setInbox}
                    groupName={inboxItem.groupName}
                    groupSenderName={inboxItem.senderName}
                    groupSenderEmail={inboxItem.senderEmail}
                    groupId={inboxItem.groupId}
                    inviteItemId={inboxItem._id as string}
                />
            ))}
        </div>
    )
}
