import "./LoadingGroup.css"
import Image from "next/image"
import spaceship from "../../../public/ufo.svg"
import React from 'react'

export default function LoadingGroup() {
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
            <div className="loadinggroup__bottom">
                <div className="loadinggroup__message">
                    Finding Projects
                </div>
                <div className="loading__circles">
                    <div className="loading__circle"></div>
                    <div className="loading__circle"></div>
                    <div className="loading__circle"></div>
                </div>
            </div>
        </div>
    )
}
