import React, { useEffect, useState } from 'react';
import SideBar from "./SideBar"
import Pfp from './assets/default-avatar-profile-icon-of-social-media-user-vector.jpg' ;
import axios from 'axios';
interface CardData {
  name: string;
  card: string;
}
function Home() {
 const [userData,setUserData]=useState();
  const [cards, setCards] = useState< CardData[]>([]);

  useEffect(()=>{
    axios.get('http://127.0.0.1:8000/project_app/login/').then((response)=>{
      setUserData(response.data);
      console.log(userData);
      console.log(response.data);
    }).catch((error)=>{
      console.error('hehe',error);
    });
  
 
    axios.get('http://127.0.0.1:8000/project_app/cards/')
      .then((response) => {
        setCards(response.data);
      })
      .catch((error) => {
        console.error('Error fetching cards data', error);
      });
  }, []);

  useEffect(() => {
    console.log('userData:', userData);


  }, [userData]); // This effect runs whenever userData changes
  
  return (
    <div string-name='home' className="w-full h-screen bg-slate-600">
      <div className="flex flex-row ml-56 mb-20 ">
  <img  src={Pfp} className="mt-10"></img>
  {userData ? (<div className="ml-20 mt-20 text-white text-xl">
  <ul>
    <li>Name :{userData[0].name} </li>
    <br></br>
    <li>Enrollment No. :{userData[0].enrollment_no}</li>  
    <br></br>
    <li>Email :{userData[0].email}</li>


  </ul>
  </div>):(<p>loading user data</p>)
  }
      </div>
      <div className=" bg-slate-800 ml-48 pl-24 p-3  text-white text-xl ">  Cards </div>

      <div className="flex flex-row ml-80 mt-">
        {cards.map((card, index) => (
          <div key={index} className="flex p-2 bg-slate-400 r flex-wrap mt-16 mr-12 ">
            <ul>
              <li className='mb-1'>{card.title}</li>
            </ul>
          </div>
        ))}
        
      
       
      </div>
    


    
   </div>
  );
}

export default Home;
