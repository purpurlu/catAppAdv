import { createContext, useState } from "react";
import { AuthProviderProps, Cat, LikedCatsContextInteface } from "../helpers/interfaces";
import { API_URL } from "../helpers/constants";

export const LikedCatsContext = createContext<LikedCatsContextInteface> ({
    likedCats: [],
    getLikedCats: async () => {}
})

export const LikedCatsProvider: React.FC<AuthProviderProps> = ({children}): React.JSX.Element => {
    const [likedCats, setLikedCats] = useState<Cat[]>([])

    const getLikedCats = async () => {
        const response = await fetch(`${API_URL}/savedCats`, {
            method: "GET",
            credentials: "include"
        })
        if (response.status === 200) {
            const liked = await response.json()
            const tmpCats: Cat[] = []
            for (const cat of liked) {
                tmpCats.push({
                    id: cat.cat_id,
                    url: cat.cat_url,
                    liked: true
                })
            }
            setLikedCats(tmpCats)
        }
    }

    return (
        <LikedCatsContext.Provider value={{likedCats, getLikedCats}}> 
            {children}
        </LikedCatsContext.Provider>
    )

}