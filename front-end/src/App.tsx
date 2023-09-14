import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Home } from "./pages/Home"
import { NavBar } from "./components/NavBar"
import { AuthProvider } from "./context/Context"
import { NotFound } from "./pages/NotFound"
import { LikedCatsProvider } from "./context/LikedCatContext"
import { HandleAuthentication } from "./components/HandleAuthentication"
import { login, signUp } from "./helpers/utils"


function App() {

  return (
    <>
      <AuthProvider> 
        <LikedCatsProvider>
          <Router>
            <NavBar/>
            <Routes>
              <Route 
              path="/signup" 
              element={
                <HandleAuthentication 
                title="Signup"
                action={signUp}
                path="/login"
                />
              }
              />
              <Route 
              path="/login" 
              element={
                <HandleAuthentication 
                title="Login"
                action={login}
                path="/"
                />
              }
              />
              <Route path="/" element={<Home/>}/>
              <Route path="*" element={<NotFound/>}/>
            </Routes>
          </Router>
        </LikedCatsProvider>
      </AuthProvider>
      
    </>
  )
}

export default App
