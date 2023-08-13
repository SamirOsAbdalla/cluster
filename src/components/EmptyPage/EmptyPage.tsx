
import Image from 'next/image'
import satellite from "../../../public/satty.svg"
import "./EmptyPage.css"
import React from 'react'

interface Props {
    type: "inbox" | "group"
}
export default function EmptyPage({ type }: Props) {
    return (
        <div className="emptypage__wrapper">
            <div className="satellite__wrapper">
                <div className="satellite__container">
                    <Image
                        fill
                        src={satellite}
                        alt="Satellite"
                    />
                </div>
            </div>


            {type == "inbox" &&
                <div className="emptypage__container">
                    <h1>
                        Your Inbox is Empty
                    </h1>
                    <div className="empty__message">
                        Looks like you have no new invitations at this time
                    </div>
                </div>
            }
            {type == "group" &&
                <div className="emptypage__container">
                    <h1>
                        You Have No Groups
                    </h1>
                    <div className="empty__message">
                        Looks like you are not a part of any groups at the moment
                    </div>
                </div>

            }
        </div>
    )
}
