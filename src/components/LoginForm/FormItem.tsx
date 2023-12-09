import React from 'react'

interface Props {
    value: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => any
    icon: React.ReactNode,
    inputType: string,
    placeholder: string
}
export default function FormItem({
    value,
    onChange,
    icon,
    inputType,
    placeholder
}: Props) {
    return (
        <div className="form__item">
            {icon}
            <input
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                type={inputType}
                required
                className="login__input" />
        </div>
    )
}
