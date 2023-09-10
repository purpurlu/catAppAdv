export interface ServerResponse {
    success: boolean
    errorMessage?: string
}

export interface AuthProviderProps {
    children: React.ReactNode
}

export interface AuthContextInterface {
    isLoggedIn: boolean
    checkUserLoggedIn: () => Promise<void>
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>

}

export interface LikedCatsContextInteface {
    likedCats: Cat[],
    getLikedCats: () => Promise<void>
}

/**
 * @interface Cat 
 * @description Cat interface
 * @param {string} id - Cat image ID
 * @param {string} url - Cat image URL
 * @param {number} width - Cat image width
 * @param {number} height - Cat image height
 * @param {any[]} breeds - Cat breeds
 */
export interface Cat {
    id: string,
    url: string,
    width?: number,
    height?: number,
    breeds?: any[],
    liked?: boolean
}

export interface CatProps {
    cat: Cat
}

export interface CatsProps {
    cats: Cat[]
}
