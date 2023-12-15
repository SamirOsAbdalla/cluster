import React, { Children } from 'react'

interface Props {
    headerText: string,
    children: React.ReactNode
}
export default function DisplayCell({
    headerText,
    children
}: Props) {
    return (
        <div className="dt__cell">
            <div className="dt__cell__header">
                {headerText}
            </div>
            {children}
        </div>
    )
}
