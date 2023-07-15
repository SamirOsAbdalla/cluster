import React from 'react'
import { useSession } from 'next-auth/react'
import { InboxItemInterface } from '@/lib/mongo/models/InboxModel';
import { Dispatch, SetStateAction } from "react";
import { useState } from 'react';
import "./InvitationButton.css"
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
interface Props {
    type: "accept" | "reject",
    groupId: string,
    inviteItemId: string,
    inbox: InboxItemInterface[],
    setInbox: Dispatch<SetStateAction<InboxItemInterface[]>>
}
export default function InvitationButton({ type, groupId, inbox, setInbox, inviteItemId }: Props) {

    const data = useSession()
    const userEmail = data?.data?.user.email
    const userName = data?.data?.user.name

    const [loading, setLoading] = useState<boolean>(false)

    const removeInvitation = async () => {

        const inviteBody = {
            inviteItemId,
            userEmail
        }
        //backend call to remove invitation from user inbox list
        const acceptInviteResp = await fetch("http://localhost:3000/api/inbox/removeInvitation", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(inviteBody),
        });
        const inviteResponse = await acceptInviteResp.json()
        if (inviteResponse) {

        } else {
            //show error page
        }

        //remove item from current list of inbox items
        let tmpInbox = inbox.filter((invite: InboxItemInterface) => {
            return invite._id !== inviteItemId
        })

        setInbox(tmpInbox)
    }


    const handleAccept = async () => {
        if (userEmail && userName) {
            setLoading(true)
            const group = {
                groupId,
                userEmail,
                userName
            }
            //backend call to add member to group members list
            const addUserResp = await fetch("http://localhost:3000/api/groupmember/addGroupMember", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(group),
            });
            const newMemberResponse = await addUserResp.json()
            if (newMemberResponse) {

            } else {
                //show error page
            }

            removeInvitation()
            setLoading(false)
        }
    }

    const handleRejection = async () => {
        setLoading(true)
        await removeInvitation()
        setLoading(false)
    }

    if (type == "accept") {
        return (
            <button onClick={handleAccept} className="invbutton">
                {loading ? <LoadingSpinner type="button" /> : <span>Accept</span>}
            </button>
        )
    }
    return (
        <button onClick={handleRejection} data-testid="reject__button" className="invbutton">
            {loading ? <LoadingSpinner type="button" /> : <span>Reject</span>}
        </button>
    )

}
