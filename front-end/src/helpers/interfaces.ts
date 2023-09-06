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