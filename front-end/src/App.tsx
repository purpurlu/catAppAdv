import { SignUp } from "./components/SignUp"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Home } from "./pages/Home"
import { NavBar } from "./components/NavBar"
import { Login } from "./pages/Login"
import { AuthProvider } from "./context/Context"


function App() {

  return (
    <>
      <AuthProvider> 
        <Router>
          <NavBar/>
          <Routes>
            <Route path="/signup" element={<SignUp/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/" element={<Home/>}/>
          </Routes>
        </Router>
      </AuthProvider>
      
    </>
  )
}

export default App
