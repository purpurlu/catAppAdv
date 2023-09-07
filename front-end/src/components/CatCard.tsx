import { CatProps } from "../helpers/interfaces"
import "./catCard.css"

export const CatCard = (props: CatProps): React.JSX.Element => {

    return (
        <div className="catCard">
            <img src={props.cat.url} 
            width={props.cat.width} 
            height={props.cat.height}
            />
            <button className="cutie"> Cutie </button>
            <button className="patootie"> Patootie </button>

        </div>
    )
}