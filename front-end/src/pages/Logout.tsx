import { logout } from "../helpers/utils"
import { useNavigate } from "react-router-dom"

export const Logout = () => {

    const navigate = useNavigate()

    const handleLogout = async () => {
        const response = await logout()
        if (response.success) {
            navigate("/login")
        }
    }
    return (
        <a href="#" onClick={handleLogout} className="mylink"> Logout </a>
    )
}