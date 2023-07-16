import "./KickMemberModal.css"
import React from 'react'
import { Dispatch, SetStateAction } from "react";

interface Props {
    kickedMemberName: string;
    kickedMemberEmail: string;
    groupId: string;
    setKickModalStatus: Dispatch<SetStateAction<"open" | "closed">>
}
export default function KickMemberModal({ groupId, kickedMemberName, kickedMemberEmail,
    setKickModalStatus }: Props) {
    const kickMember = async () => {

    }
    return (
        <div className="kickmodal__wrapper">
            <div className="kickmodal__heading">
                <p>Are you sure you want to kick <span>{kickedMemberName}</span></p>
            </div>
            <div className="kickmodal__buttons">
                <button onClick={kickMember} className="kickmodal__button kickmodal__kick">
                    Kick
                </button>
                <button onClick={() => setKickModalStatus("closed")} className="kickmodal__button kickmodal__cancel">
                    Cancel
                </button>
            </div>
        </div>
    )
}
