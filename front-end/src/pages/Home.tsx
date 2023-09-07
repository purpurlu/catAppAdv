import { useContext, useEffect } from "react"
import { AuthContext } from "../context/Context"
import { useNavigate } from "react-router-dom"
import { ShowCats } from "../components/ShowCats"

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
        <div style={{textAlign:"center"}}>
            <h1> Home Page </h1>
            <ShowCats/>
        </div>
    )
}

