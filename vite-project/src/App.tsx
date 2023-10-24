import Home from "./Home"
import Project from "./Project"
import SideBar from "./SideBar";
import {Route,Routes} from "react-router-dom"
const App = () => {
    

  return (
    <div>
      <SideBar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/project/:id/:name" element={<Project/>}/>

      </Routes>
    </div>
  )
}

export default App
