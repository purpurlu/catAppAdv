import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/Context"
import { useNavigate } from "react-router-dom"
import { ShowCats } from "../components/ShowCats"
import { Cat } from "../helpers/interfaces"
import { getCats } from "../helpers/utils"
import { LikedCatsContext } from "../context/LikedCatContext"

export const Home = ():React.JSX.Element => {
    const navigate = useNavigate()
    const {isLoggedIn, checkUserLoggedIn} = useContext(AuthContext)
    const [cats, setCats] = useState<Cat[]>([])
    const {likedCats, getLikedCats}  = useContext(LikedCatsContext)


    useEffect(() => {
        const checkRedirect = async () => {
            await checkUserLoggedIn()
            if (!isLoggedIn) {
                navigate("/login")
            }
        }

        checkRedirect()

    }, [navigate, isLoggedIn, checkUserLoggedIn])

    useEffect(() => {
        getLikedCats()
    }, [])

    const handleCatImages = async () => {
        const nextImages = await getCats()
        setCats(nextImages)
    }

    return (
        <div style={{textAlign:"center"}}>
            <h1> Home Page </h1>
            <h2> Your liked cats </h2>
            <ShowCats cats={likedCats} />
            <button onClick={handleCatImages} className="button"> Show more cats </button>
            <ShowCats cats={cats} />
        </div>
    )
}

