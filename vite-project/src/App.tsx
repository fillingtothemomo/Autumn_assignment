import Home from "./Home"
import Project from "./Project"
import SideBar from "./SideBar";
import LoginPage from "./Login";
import {Route,Routes} from "react-router-dom"
import {CookiesProvider,useCookies} from "react-cookie";
const App = () => {
    

  return (
    
    <div>
      <SideBar/>
      <CookiesProvider>
      <Routes>
      
        <Route path="/"element ={<LoginPage/>}/>
        <Route path="/home" element={<Home/>}/>
        <Route path="/project/:id/:name" element={<Project/>}/>
        
      </Routes>
      </CookiesProvider>
    </div>
    
  )
}

export default App
