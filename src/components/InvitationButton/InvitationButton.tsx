import React from 'react'
import { useSession } from 'next-auth/react'
import { InboxItemInterface } from '@/lib/mongo/models/InboxModel';
import { Dispatch, SetStateAction } from "react";
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

            await removeInvitation()

        }
    }

    const handleRejection = async () => {
        await removeInvitation()
    }

    if (type == "accept") {
        return (
            <button onClick={handleAccept} className="invbutton">
                Accept
            </button>
        )
    }
    return (
        <button onClick={handleRejection} data-testid="reject__button" className="invbutton">
            Reject
        </button>
    )

}
