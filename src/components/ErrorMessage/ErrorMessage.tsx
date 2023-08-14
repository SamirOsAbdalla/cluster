import "./ErrorMessage.css"
import { BiErrorCircle } from "react-icons/bi"
interface ErrorMessageProps {
    type: string
}
export default function ErrorMessage({ type }: ErrorMessageProps) {
    if (type == "userExists") {
        return (
            <div className="error__wrapper">
                <BiErrorCircle className="error__circle" />
                <div className="error__message">
                    User already exists
                </div>
            </div>
        )
    }
    return (
        <div className="error__wrapper">
            <BiErrorCircle className="error__circle" />
            <div className="error__message">
                Incorrect username or password
            </div>
        </div>
    )
}