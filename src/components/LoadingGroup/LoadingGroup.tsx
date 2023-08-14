import "./LoadingGroup.css"
import Image from "next/image"
import spaceship from "../../../public/ufo.svg"
import React from 'react'
import LoadingMessage from "../LoadingMessage/LoadingMessage"


interface Props {
    type: "groups" | "loadingGroups" | "user"
}
export default function LoadingGroup({ type }: Props) {
    return (
        <div className="loadinggroup__wrapper">
            <div className="loading__image__container">
                <Image
                    priority
                    src={spaceship}
                    fill
                    alt="Spaceship.svg"
                    className="spaceship__svg"
                />
            </div>
            <LoadingMessage type={type} />
        </div>
    )
}
