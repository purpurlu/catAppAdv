import { useContext } from "react"
import { CatProps } from "../helpers/interfaces"
import { removeSavedCat, saveCats } from "../helpers/utils"
import "./catCard.css"
import { LikedCatsContext } from "../context/LikedCatContext"
import { Box, Image } from '@chakra-ui/react'

export const CatCard = (props: CatProps): React.JSX.Element => {

    const {getLikedCats} = useContext(LikedCatsContext)

    const handleCutieCat = async () => {
        const saveCatResult = await saveCats(props.cat.id, props.cat.url)
        if (saveCatResult.success) {
            await getLikedCats()
            alert("Saved the cat")
        } else {
            alert(saveCatResult.errorMessage)
        }
    }

    const handlePatootieCat = async() => {
        const removeCatResult = await removeSavedCat(props.cat.id) 
        if (removeCatResult.success) {
            await getLikedCats()
            alert("The cat is patootie!")
        } else {
            alert(removeCatResult.errorMessage)
        }


        
    }

    return (
        <Box maxW='sm'    width={[
      "100%", // 0-30em
      "50%", // 30em-48em
    //   "25%", // 48em-62em
      "23%", // 62em+
    ]} borderWidth={['1px', ]} borderRadius='xl' overflow='hidden' className="catCard">
            <Image src={props.cat.url} 
            width={props.cat.width} 
            height={props.cat.height}
            />
            {props.cat.liked ?
                    <button className="patootie" onClick={handlePatootieCat}> Patootie </button>

                :
                    <button className="cutie" onClick={handleCutieCat}> Cutie </button>
            }

        </Box>
    )
}