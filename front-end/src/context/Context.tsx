import { createContext, useEffect, useState } from "react";
import { AuthContextInterface, AuthProviderProps } from "../helpers/interfaces";
import { checkAuth } from "../helpers/utils";

export const AuthContext = createContext <AuthContextInterface>({
    isLoggedIn: false, 
    checkUserLoggedIn: async () => {},
    setIsLoggedIn: () => {}

})
export const AuthProvider: React.FC<AuthProviderProps> = ({children}): React.JSX.Element => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

    const checkUserLoggedIn = async() => {
        try{
            const response = await checkAuth()
            setIsLoggedIn(response)
        } catch(error) {
            console.log(error)
        }
    }

    useEffect(() => {
        checkUserLoggedIn()
    }, [])

    return (
        <AuthContext.Provider value={{ isLoggedIn, checkUserLoggedIn, setIsLoggedIn }}> 
            {children} 
        </AuthContext.Provider>
    )
}