import { ReactElement, ReactNode } from "react"
import "./PageWrapper.css"

export default function PageWrapper({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="page__wrapper">
            {children}
        </div>
    )
}