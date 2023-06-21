
import { GoGear } from "react-icons/go"
export default function SignIn() {
    return (
        <div className="login__form__wrapper">
            <div className="login__form__container">
                <div className="login__picture__container">
                    <GoGear />
                </div>
                <div className="login__header">
                    <h1>Sign in</h1>
                    <div>
                        Please login to get started
                    </div>
                </div>
            </div>
        </div>
    )
}