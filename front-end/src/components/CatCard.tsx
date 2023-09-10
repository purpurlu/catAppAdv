import { useContext } from "react"
import { CatProps } from "../helpers/interfaces"
import { removeSavedCat, saveCats } from "../helpers/utils"
import "./catCard.css"
import { LikedCatsContext } from "../context/LikedCatContext"

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
        <div className="catCard">
            <img src={props.cat.url} 
            width={props.cat.width} 
            height={props.cat.height}
            />
            {props.cat.liked ?
                    <button className="patootie" onClick={handlePatootieCat}> Patootie </button>

                :
                    <button className="cutie" onClick={handleCutieCat}> Cutie </button>
            }

        </div>
    )
}