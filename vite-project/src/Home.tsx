import React from 'react';
import SideBar from "./SideBar"
import Pfp from './assets/default-avatar-profile-icon-of-social-media-user-vector.jpg' ;
function Home() {
 
  return (
    <div string-name='home' className="w-full h-screen bg-slate-600">
      <div className="flex flex-row ml-56 mb-20 ">
  <img  src={Pfp} className="mt-10"></img>
  <div className="ml-20 mt-20 text-white text-xl">
  <ul>
    <li>Name :</li>
    <br></br>
    <li>Enrollment No. :</li>  
    <br></br>
  
    <li>Email :</li>


  </ul>
  </div>
      </div>
      <span className=" bg-slate-400 shadow-2xl ml-80 p-3 rounded-md">  Cards </span>

      <div className="flex flex-row ml-80 mt-">
        <div className="flex bg-slate-400 shadow-2xl rounded-md pt-2 pl-2 pr-2 flex-wrap mt-16 mr-12 w- border  padding">
          <ul>
        <li className='mb-1'>project-name</li>
        <hr></hr>
        <li className="">title</li>
       </ul>
        </div>
        
        <div className="flex p-2 bg-slate-400  rounded-md flex-wrap mt-16 mr-12 border">
          <ul>
        <li className='mb-1'>project-name</li>
        <hr></hr>
        <li className="">title</li>
       </ul>
        </div>
        <div className="flex p-2 bg-slate-400  rounded-md flex-wrap mt-16 mr-12 border">
         
          <ul>
        <li className='mb-1'>project-name</li>
        <hr></hr>
        <li className="">title</li>
       </ul>
        </div>
      </div>
      <br></br>
      <hr></hr>
      <br></br>

      <span className=" bg-slate-400 shadow-2xl  p-3 ml-80 t-40 rounded-md">  Comments </span>
      <div className="flex flex-row ml-80 mt-">
        <div className="flex bg-slate-400 shadow-2xl rounded-md pt-2 pl-2 pr-2 flex-wrap mt-16 mr-12 w- border  padding">
          <ul>
        <li className='mb-1'>project-name</li>
        <hr></hr>
        <li className="">comment</li>
       </ul>
        </div>
        
        <div className="flex p-2 bg-slate-400  rounded-md flex-wrap mt-16 mr-12 border">
          <ul>
        <li className='mb-1'>project-name</li>
        <hr></hr>
        <li className="">comment</li>
       </ul>
        </div>
        <div className="flex p-2 bg-slate-400  rounded-md flex-wrap mt-16 mr-12 border">
         
          <ul>
        <li className='mb-1'>project-name</li>
        <hr></hr>
        <li className="">comment</li>
       </ul>
        </div>
      </div>
    <div  className="flex">
  
   

   </div>
   </div>
  );
}

export default Home;
