import { useContext, useEffect } from "react"
import { AuthContext } from "../context/Context"
import { useNavigate } from "react-router-dom"

export const Home = ():React.JSX.Element => {
    const navigate = useNavigate()
    const {isLoggedIn, checkUserLoggedIn} = useContext(AuthContext)

    useEffect(() => {
        const checkRedirect = async () => {
            await checkUserLoggedIn()
            if (!isLoggedIn) {
                navigate("/login")
            }
        }

        checkRedirect()

    }, [navigate, isLoggedIn, checkUserLoggedIn])

    return (
        <>
            <h1> Main Page </h1>
        </>
    )
}

