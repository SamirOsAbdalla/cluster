import React from 'react'
import "./ModalWrapper.css"

export default function ModalWrapper({
    children,
    closeModal
}: {
    children: React.ReactNode,
    closeModal: any
}) {
    return (
        <div onClick={(e) => {
            const target = e.target as HTMLElement
            if (target.classList.contains("modal__wrapper")) {
                closeModal()
            }

        }

        } className="modal__wrapper" >
            {children}
        </div >
    )
}
