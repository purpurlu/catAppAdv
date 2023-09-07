import { Link } from "react-router-dom"
import "./navBar.css"
import { Logout } from "../pages/Logout"
import { AuthContext } from "../context/Context"
import { useContext } from "react"

export const NavBar = (): React.JSX.Element => {
  	const { isLoggedIn } = useContext(AuthContext)

    return (
        <div className="navigation">
		<Link to = "/" className="brand-name">
			<b> Cat App  </b>
		</Link>
		<div
			className="navigation-menu">
			<ul>

			{
				!isLoggedIn ?  
				<>
					<li>
						<Link to="/signup" className="mylink">SignUp</Link>
					</li>
					<li>
						<Link to="/login" className="mylink">Login</Link>
					</li>
				</> : 
				<>
					<li>
						<Logout/>
					</li>
				</>
			} 
        </ul>
      </div>
    </div>
    )
}