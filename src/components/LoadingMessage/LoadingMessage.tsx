import React from 'react'
import "./LoadingMessage.css"

interface Props {
    type: "inbox" | "groups"
}
export default function LoadingMessage({ type }: Props) {
    return (
        <div className="loadinggroup__bottom">
            {type == "inbox" && <div className="loadinggroup__message">
                Loading Inbox
            </div>}
            {type === "groups" && <div className="loadinggroup__message">
                Finding Groups
            </div>}
            <div className="loading__circles">
                <div className="loading__circle"></div>
                <div className="loading__circle"></div>
                <div className="loading__circle"></div>
            </div>
        </div>
    )
}
