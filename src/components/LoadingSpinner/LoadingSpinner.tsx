import "./LoadingSpinner.css"

import React from 'react'
interface Props {
    type: "login" | "newGroup"
}
export default function LoadingSpinner({ type }: Props) {
    if (type == "newGroup") {
        return (
            <div className="loadingspinner__small"></div>
        )
    }
    return (
        <div className="loadingspinner__large"></div>
    )

}
