import React from 'react'
import { useSession } from 'next-auth/react'
import { InboxInterface } from '@/lib/mongo/models/UserModel'
import { Dispatch, SetStateAction } from "react";
interface Props {
    type: "accept" | "reject",
    projectId: string,
    inviteId: string,
    inbox: InboxInterface[],
    setInbox: Dispatch<SetStateAction<InboxInterface[]>>
}
export default function InvitationButton({ type, projectId, inbox, setInbox, inviteId }: Props) {

    const data = useSession()
    const userEmail = data?.data?.user.email
    const userName = data?.data?.user.name

    const removeInvitation = async () => {

        const inviteBody = {
            inviteId,
            userEmail
        }
        //backend call to remove invitation from user inbox list
        const acceptInviteResp = await fetch("http://localhost:3000/api/removeInvitation", {
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
        let tmpInbox = inbox.filter((invite: InboxInterface) => {
            return invite._id !== inviteId
        })

        setInbox(tmpInbox)
    }
    const handleAccept = async () => {
        if (userEmail && userName) {
            const project = {
                projectId,
                userEmail,
                userName
            }
            //backend call to add member to project members list
            const addUserResp = await fetch("http://localhost:3000/api/addProjectMember", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(project),
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
