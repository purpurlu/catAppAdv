import { API_URL ,  CAT_API_KEY, CAT_API_URL } from "./constants"
import { ServerResponse, Cat } from "./interfaces"

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
        // console.log(error)
        return {
            success: false,
            errorMessage: "Credentials are invalid"
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


/**
 * The function getCats gets cats from the cat API
 * @returns {Cat[]}
 */

export const getCats = async (): Promise <Cat[]> => {
    const response = await fetch (`${CAT_API_URL}?limit=4`, {
        headers: {
            "Authorization": CAT_API_KEY
        }
    })

    if (response.status !== 200) {
        return [] as Cat[]
    }

    const cats: Cat[] = await response.json()
    return cats 
}

export const saveCats = async( catID: string, catURL: string):  Promise <ServerResponse> => {

    try {
        const response = await fetch(`${API_URL}/saveCat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }, 
            body: JSON.stringify({ catID, catURL }),
            credentials: "include"
        })
        if (response.status === 200) {
            return { success: true }
        } else {
            return {
                success: false,
                errorMessage: await response.json()
            }
        }
    } catch (error: any) {
        return {
            success: false,
            errorMessage: error.toString()
        }
    }
}

export const removeSavedCat = async(catID: string): Promise<ServerResponse> => {
    try {
        const res = await fetch(`${API_URL}/savedCats/${catID}`, {
            method: "DELETE",
            credentials: "include"
        })
    
        if (res.status === 200) {
            return {success:true}
        } else {
            return {success: false, errorMessage: await res.json()}
        }
    } catch (error: any) {
        return {success: false, errorMessage: error}
    }

}
