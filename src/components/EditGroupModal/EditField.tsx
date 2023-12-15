import React, { Dispatch, SetStateAction } from 'react'

interface Props {
    text: string
    type: string
    value: string,
    changeHandler: Dispatch<SetStateAction<string>>,
    placeholder?: string
}
export default function EditField({
    text,
    type,
    value,
    changeHandler,
    placeholder
}: Props) {
    return (
        <div className="editgroupmodal__field">
            <div className="editgroup__text">
                {text}
            </div>
            <input
                value={value}
                onChange={(e) => changeHandler(e.target.value)}
                className={`editgroupmodal__input editgroupmodal__input__${type}`}
                type="text"
                placeholder={placeholder}
            />
        </div>
    )
}
