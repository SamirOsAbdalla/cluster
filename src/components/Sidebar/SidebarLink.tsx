import React from 'react'
import Link from 'next/link'

interface Props {
    href: string,
    icon: React.ReactNode,
    text: string
}

export default function SidebarLink({
    href,
    icon,
    text
}: Props) {
    return (
        <Link href={href} className="sidebar__link">
            {icon}
            <div className="sidebar__link__text">
                {text}
            </div>
        </Link>
    )
}
