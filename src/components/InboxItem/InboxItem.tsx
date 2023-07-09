import "./InboxItem.css"
import { AiOutlineMail } from "react-icons/ai"
import React from 'react'
import InvitationButton from "../InvitationButton/InvitationButton"
import { InboxInterface } from "@/lib/mongo/models/UserModel"
import { Dispatch, SetStateAction } from "react";
interface Props {
    projectName: string,
    inviteId: string,
    projectSenderName: string,
    projectSenderEmail: string,
    projectId: string,
    inbox: InboxInterface[],
    setInbox: Dispatch<SetStateAction<InboxInterface[]>>
}
export default function InboxItem(
    { projectName, projectSenderName, projectSenderEmail, projectId, inbox, setInbox, inviteId }: Props) {
    return (
        <div className="item__wrapper">
            <div className="item__top">
                <AiOutlineMail className="item__logo" />
                <div className="item__heading">
                    <p>Invited to <span>{projectName}</span></p>
                </div>
            </div>
            <div className="item__bottom">
                <div className="item__bottom__left">
                    <span>{projectSenderName}</span> has sent you an invitation to join <span>{projectName}</span>
                </div>
                <div className="item__bottom__right">
                    <InvitationButton type="accept" inviteId={inviteId} projectId={projectId} inbox={inbox} setInbox={setInbox} />
                    <InvitationButton type="reject" inviteId={inviteId} projectId={projectId} inbox={inbox} setInbox={setInbox} />
                </div>
            </div>
        </div>
    )
}
