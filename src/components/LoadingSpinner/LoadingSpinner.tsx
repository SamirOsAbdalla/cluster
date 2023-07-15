import "./LoadingSpinner.css"

import React from 'react'
interface Props {
    type: "login" | "button"
}
export default function LoadingSpinner({ type }: Props) {
    if (type == "button") {
        return (
            <div className="loadingspinner__small"></div>
        )
    }
    return (
        <div className="loadingspinner__large"></div>
    )

}
