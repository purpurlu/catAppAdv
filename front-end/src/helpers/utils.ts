import { API_URL } from "./constants"
import { SignUpResponse } from "./interfaces"



/**
 * function signUp sends the username and password to the db
 * @param {string} username - the username to sign up with 
 * @param {string} password - the password to sign up with
 * @returns {SignUpResponse}
 */
export const signUp = async ( username: string, password: string ): Promise <SignUpResponse> => {
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