import { useContext, useEffect, useState } from "react"
import { login } from "../helpers/utils"
import { useNavigate } from "react-router-dom"
import "../components/signUp.css"
import { AuthContext } from "../context/Context"

export const Login = ():React.JSX.Element => {
    const navigate = useNavigate()
    const [errorMessage, setErrorMessage] = useState<string>("")

    const { isLoggedIn } = useContext(AuthContext)

    useEffect(() => {
        if(isLoggedIn) {
            navigate("/")
        }
    }, [isLoggedIn])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const data = new FormData(e.currentTarget)
        const username = data.get('username')?.toString()
        const password = data.get('password')?.toString()
        console.log(data.get("username"))

        const res = await login(username!, password!)
        if (res.success) {
            setErrorMessage("")
            // console.log(await checkAuth())
            // alert("Success!")
            navigate("/")
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
                <button type="submit" > Login </button>
            </form>

            {
                errorMessage && 
                <p> { errorMessage } </p>
            }

        </div>
    )
}