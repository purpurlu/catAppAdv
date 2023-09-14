import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/Context"
import { useNavigate } from "react-router-dom"
import { ShowCats } from "../components/ShowCats"
import { Cat } from "../helpers/interfaces"
import { getCats } from "../helpers/utils"
import { LikedCatsContext } from "../context/LikedCatContext"
import { Button, Text, Box } from '@chakra-ui/react'

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
            <Text
                bgGradient="linear(to-r, gray.300, yellow.400, pink.200)"
                bgClip="text"
                fontSize="2xl"
                fontWeight="extrabold"> 
            Home Page 
            </Text>
            <Text 
                textColor={"red"}
                fontSize={"xl"}
                fontWeight={"semibold"}
            > Your liked cats </Text>
            <ShowCats cats={likedCats} />
            <Box p="4">
                <Button onClick={handleCatImages} className="button"> Show more cats </Button>
                <ShowCats cats={cats} />
            </Box>
            
        </div>
    )
}

