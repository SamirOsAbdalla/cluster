import "./InboxItem.css"
import { AiOutlineMail } from "react-icons/ai"
import React from 'react'
import InvitationButton from "../InvitationButton/InvitationButton"
import { Dispatch, SetStateAction } from "react";
import { InboxItemInterface } from "@/lib/mongo/models/InboxModel";
interface Props {
    groupName: string,
    inviteItemId: string,
    groupSenderName: string,
    groupSenderEmail: string,
    groupId: string,
    inbox: InboxItemInterface[],
    setInbox: Dispatch<SetStateAction<InboxItemInterface[]>>
}
export default function InboxItem(
    { groupName, groupSenderName, groupSenderEmail, groupId, inbox, setInbox, inviteItemId }: Props) {
    return (
        <div className="item__wrapper">
            <div className="item__top">
                <AiOutlineMail className="item__logo" />
                <div className="item__heading">
                    <p>Invited to <span>{groupName}</span></p>
                </div>
            </div>
            <div className="item__bottom">
                <div className="item__bottom__left">
                    <span>{groupSenderName}</span> has sent you an invitation to join <span>{groupName}</span>
                </div>
                <div className="item__bottom__right">
                    <InvitationButton type="accept" inviteItemId={inviteItemId} groupId={groupId} inbox={inbox} setInbox={setInbox} />
                    <InvitationButton type="reject" inviteItemId={inviteItemId} groupId={groupId} inbox={inbox} setInbox={setInbox} />
                </div>
            </div>
        </div>
    )
}
