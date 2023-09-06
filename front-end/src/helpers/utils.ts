import { API_URL } from "./constants"
import { ServerResponse } from "./interfaces"

/**
 * function signUp sends the username and password to the db
 * @param {string} username - the username to sign up with 
 * @param {string} password - the password to sign up with
 * @returns {ServerResponse}
 */
export const signUp = async ( username: string, password: string ): Promise <ServerResponse> => {
    try {
        const response = await fetch (`${API_URL}/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }, 
            body: JSON.stringify({ username, password })
        })
    
        if (response.status === 200) {
            return { success: true }
        } else  {
            return { success:false, errorMessage: await response.json() }
        }
    } catch (error: any) {
        console.log(error)
        return {
            success: false,
            errorMessage: error.toString()
        }
    }
   
} 

export const checkAuth = async (): Promise <boolean> => {
    const response = await fetch(`${API_URL}/isAuth`, {
        method: "GET",
        credentials: "include"
    })

    console.log(response)
    if (response.status === 200) {
        console.log("Auth")
        return true
    } else {
        console.log("not auth ")
        return false
    }
}

export const login = async (username: string, password: string): Promise <ServerResponse>  => {
    try {
        const response = await fetch (`${API_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }, 
            body: JSON.stringify({ username, password }),
            credentials: "include"
        })
    
        if (response.status === 200) {
            console.log(response.headers)
            return { success: true }
        } else  {
            return { success:false, errorMessage: await response.json() }
        }
    } catch (error: any) {
        console.log(error)
        return {
            success: false,
            errorMessage: error.toString()
        }
    }

}

export const logout = async (): Promise<ServerResponse> => {
    try{
        const response = await fetch(`${API_URL}/logout`, {
            method: "GET",
            credentials: "include"
        })
        if (response.status === 200) {
            return { success: true }
        } else  {
            return { success:false, errorMessage: await response.json() }
        }

    } catch (error: any) {
        console.log(error)
        return {
            success: false,
            errorMessage: error.toString()
        }
    }
}