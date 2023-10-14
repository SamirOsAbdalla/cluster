import React from 'react'
import "./Header.css"   
interface Props {
    headerText: string
}
export default function Header({ headerText }: Props) {
    return (
        <div className="header">
            {headerText}
        </div>
    )
}
