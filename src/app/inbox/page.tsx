"use client"
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { InboxInterface, InboxItemInterface } from '@/lib/mongo/models/InboxModel'
import "./inbox.css"
import React from 'react'
import InboxItem from '@/components/InboxItem/InboxItem'
import LoadingInbox from '@/components/LoadingInbox/LoadingInbox'
import LoadingMessage from '@/components/LoadingMessage/LoadingMessage'
import EmptyPage from '@/components/EmptyPage/EmptyPage'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import Header from '@/components/Header/Header'

export default function Inbox() {
    const data = useSession()
    const userEmail = data?.data?.user.email
    const userName = data?.data?.user.name

    const [inbox, setInbox] = useState<InboxItemInterface[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string>("")
    useEffect(() => {
        const fetchInbox = async () => {

            if (!userEmail) {
                return;
            }
            const user = {
                userEmail: userEmail
            }
            const response = await fetch("/api/inbox/fetchInbox", {
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
            setLoading(false)
        }

        fetchInbox()

    }, [userEmail])


    return (
        <PageWrapper>
            <Header headerText='INBOX' />
            <div className="inbox__wrapper">
                {loading &&
                    <>
                        <LoadingInbox />
                        <LoadingMessage type="inbox" />
                    </>}
                {!loading && inbox.length > 0 &&
                    <div className="inboxitems">
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

                }
                {!loading && inbox.length == 0 &&
                    <EmptyPage type="inbox" />}
            </div>
        </PageWrapper>
    )
}
