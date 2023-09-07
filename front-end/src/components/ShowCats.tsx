import { useEffect, useState } from 'react'
import './showcats.css'
import { CatCard } from './CatCard'
import { getCats } from '../helpers/utils'
import { Cat } from '../helpers/interfaces'

export const ShowCats = () => {

    const [cats, setCats] = useState<Cat[]>([])

    useEffect(() => {
        const _getCats = async () => {
          const fetchedCats = await getCats()
          setCats(fetchedCats)
        }
    
        _getCats()
      }, [])
    
    const handleCatImages = async () => {
        const nextImages = await getCats()
        setCats(nextImages)
    }
    
    return (

        <div className="showcats">
    
          {/* <button onClick={handleCatImage} className="button"> Next </button> */}
          <button onClick={handleCatImages} className="button"> Next </button>
          <div className='box'> 
            {
              cats && cats.map((cat, index) => {
                return (
                  <CatCard cat={cat} key={index}/>
                )
              })
              
            }
    
          </div>
    
        </div>
      )
}