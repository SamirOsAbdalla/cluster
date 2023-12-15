import React, { Dispatch, SetStateAction } from 'react'

interface Props {
    text: string,
    value: string,
    changeHandler: Dispatch<SetStateAction<string>>,
    placeholder: string
}
export default function ModalItem({
    text,
    value,
    changeHandler,
    placeholder
}: Props) {
    return (
        <div className="etmodal__item">
            <div>
                {text}
            </div>
            <input
                value={value}
                onChange={(e) => changeHandler(e.target.value)}
                placeholder={placeholder}
            />
        </div>
    )
}
