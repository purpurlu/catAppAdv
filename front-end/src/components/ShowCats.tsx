import './showcats.css'
import { CatCard } from './CatCard'
import { CatsProps } from '../helpers/interfaces'

export const ShowCats = (props: CatsProps) => {
    return (
        <div className="showcats">
            <div className='box'> 
            {
              props && props.cats.map((cat, index) => {
                return (
                  <CatCard cat={cat} key={index}/>
                )
              })
            }
          </div>
        </div>
      )
}