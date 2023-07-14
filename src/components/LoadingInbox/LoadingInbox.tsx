import "./LoadingInbox.css"

import React from 'react'

export default function LoadingInbox() {
    return (
        <div className="loadinginbox__wrapper">
            <div className="moon">
                <div className="crater crater1"></div>
                <div className="crater crater2"></div>
                <div className="crater crater3"></div>
                <div className="crater crater4"></div>
                <div className="crater crater5"></div>
                <div className="shadow"></div>
            </div>
            <div className="orbit">
                <div className="rocket">
                    <div className="window"></div>
                </div>
            </div>
        </div>
    )
}
