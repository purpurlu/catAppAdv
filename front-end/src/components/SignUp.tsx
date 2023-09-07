import { useContext, useEffect, useState } from "react"
import { signUp } from "../helpers/utils"
import { useNavigate } from "react-router-dom"
import "./signUp.css"
import { AuthContext } from "../context/Context"

export const SignUp = ():React.JSX.Element => {

    const navigate = useNavigate()
    const { isLoggedIn } = useContext(AuthContext)

    useEffect(() => {
        if(isLoggedIn) {
            navigate("/")
        }
    }, [isLoggedIn])

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
            // alert("Success!")
            navigate("/login")
        } else {
            setErrorMessage(res.errorMessage!)
        }
    }

    return (
        <div className="signup">
            <h1> Signup Page </h1>
            <form onSubmit={handleSubmit}>
                <input required type="text" name="username" placeholder="Username"/>
                <input required type='password' name="password" placeholder="Password"/>
                <input type="reset"/>
                <button type="submit" > Signup</button>
            </form>

            {
                errorMessage && 
                <p> { errorMessage } </p>
            }

        </div>
    )
}