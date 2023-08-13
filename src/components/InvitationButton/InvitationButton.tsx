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
    const userPicture = data?.data?.user.picture

    const [loadingAccept, setLoadingAccept] = useState<boolean>(false)
    const [loadingReject, setLoadingReject] = useState<boolean>(false)

    const setButtonsDisabled = () => {
        const acceptButton = document.querySelector(".invbutton__accept") as HTMLButtonElement
        const rejectButton = document.querySelector(".invbutton__reject") as HTMLButtonElement
        acceptButton.disabled = true;
        rejectButton.disabled = true
    }

    const setButtonsEnabled = () => {
        const acceptButton = document.querySelector(".invbutton__accept") as HTMLButtonElement
        const rejectButton = document.querySelector(".invbutton__reject") as HTMLButtonElement
        acceptButton.disabled = false;
        rejectButton.disabled = false;
    }
    const removeInvitation = async () => {
        setButtonsDisabled()
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
        if (!inviteResponse) {
            setButtonsEnabled()
            //throw error
        }

        //remove item from current list of inbox items
        let tmpInbox = inbox.filter((invite: InboxItemInterface) => {
            return invite._id !== inviteItemId
        })
        setButtonsEnabled()
        setInbox(tmpInbox)
    }


    const handleAccept = async () => {
        if (userEmail && userName) {
            setButtonsDisabled()
            setLoadingAccept(true)
            const group = {
                groupId,
                userEmail,
                userName,
                userPicture: userPicture || ""
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
            if (!newMemberResponse) {
                setButtonsEnabled()
                //throw error
            }
            setButtonsEnabled()
            removeInvitation()
            setLoadingAccept(false)
        }
    }

    const handleRejection = async () => {
        setLoadingReject(true)
        await removeInvitation()
        setLoadingReject(false)
    }

    if (type == "accept") {
        return (
            <button onClick={handleAccept} className="invbutton invbutton__accept">
                {loadingAccept ? <LoadingSpinner type="button" /> : <span >Accept</span>}
            </button>
        )
    }
    return (
        <button onClick={handleRejection} data-testid="reject__button" className="invbutton invbutton__reject">
            {loadingReject ? <LoadingSpinner type="button" /> : <span>Reject</span>}
        </button>
    )

}
