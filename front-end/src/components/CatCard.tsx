import { useContext } from "react"
import { CatProps } from "../helpers/interfaces"
import { removeSavedCat, saveCats } from "../helpers/utils"
import "./catCard.css"
import { LikedCatsContext } from "../context/LikedCatContext"
import { Box, Image, Button } from '@chakra-ui/react'
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";


export const CatCard = (props: CatProps): React.JSX.Element => {

    const {getLikedCats} = useContext(LikedCatsContext)

    const handleCutieCat = async () => {
        const saveCatResult = await saveCats(props.cat.id, props.cat.url)
        if (saveCatResult.success) {
            await getLikedCats()
            toast.success("Saved the cat", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1500
              })
            // alert("Saved the cat")
        } else {
            toast.warn(saveCatResult.errorMessage, {
                position: toast.POSITION.BOTTOM_LEFT
              });
            // alert(saveCatResult.errorMessage)
        }
    }

    const handlePatootieCat = async() => {
        const removeCatResult = await removeSavedCat(props.cat.id) 
        if (removeCatResult.success) {
            await getLikedCats()
            // alert("The cat is patootie!")
            toast.success("The cat is patootie!", {
                position: toast.POSITION.TOP_CENTER
              })
        } else {
            // alert(removeCatResult.errorMessage)
            toast.warn(removeCatResult.errorMessage, {
                position: toast.POSITION.BOTTOM_LEFT
            });

        }
    }

    return (
        <Box maxW='sm'    
            width={[
            "100%",
            "50%",
            "23%", 
            ]} 
            borderWidth={['3px']} 
            borderRadius='2xl' 
            overflow='hidden' 
            className="catCard">
            <Image src={props.cat.url} 
            width={props.cat.width} 
            height={props.cat.height}
            />
            {props.cat.liked ?
                <Button backgroundColor={"greenyellow"} onClick={handlePatootieCat}> Patootie </Button>
                :
                <Button backgroundColor={"pink.300"} onClick={handleCutieCat}> Cutie </Button>
            }
            <ToastContainer />
        </Box>
    )
}