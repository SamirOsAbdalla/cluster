import React from 'react'
import Image from 'next/image'
import rocket from "../../../public/rocket.png"


export default function SidebarHeading() {

    const sidebarToggle = (e: React.MouseEvent<HTMLElement>) => {
        const sidebar = document.querySelector(".sidebar__wrapper")
        sidebar?.classList.toggle("active")
    }

    return (
        <div className="sidebar__heading">
            <div className="sidebar__heading--left">
                <h1 className='sidebar__title' >
                    Cluster
                </h1>
                <div className="rocky__wrapper">
                    <div className="rocky__container">
                        <Image fill src={rocket} alt="rocket icon" />
                    </div>
                </div>
            </div>
            <div className="sidebar__menu" onClick={(e) => sidebarToggle(e)}>
                <div className="sidebar__menu__burger"></div>
            </div>
        </div>
    )
}
