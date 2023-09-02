import { useState } from "react"
import { signUp } from "../helpers/utils"
import "./signUp.css"

export const SignUp = ():React.JSX.Element => {

    const [errorMessage, setErrorMessage] = useState<string>("")

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const data = new FormData(e.currentTarget)
        const username = data.get('username')?.toString()
        const password = data.get('password')?.toString()
        console.log(data.get("username"))

        const res = await signUp(username!, password!)
        if (res.success) {
            setErrorMessage("")
            alert("Success!")
        } else {
            setErrorMessage(res.errorMessage!)
        }
    }

    return (
        <div className="signup">
            <form onSubmit={handleSubmit}>
                <input required type="text" name="username" placeholder="Username"/>
                <input required type='password' name="password" placeholder="Password"/>
                <input type="reset"/>
                <button type="submit" > Submit</button>
            </form>

            {
                errorMessage && 
                <p> { errorMessage } </p>
            }

        </div>
    )
}