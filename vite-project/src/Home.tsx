import React, { useEffect, useState } from 'react';
import SideBar from "./SideBar"
import Pfp from './assets/default-avatar-profile-icon-of-social-media-user-vector.jpg' ;
import axios from 'axios';

interface CardData {
  title: string;
}

interface UserData {
  name: string;
  enrollment_no: string;
  email: string;
  is_admin: boolean;
}

function Home() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [cards, setCards] = useState<CardData[]>([]);
  const [authorizationCode, setAuthorizationCode] = useState('');
  const [name, setName] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleDisableUser = async () => {
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/project_app/users/disable/',
        { name },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authorizationCode}`,
          },
        }
      );

      if (response.status === 200) {
        console.log('User disabled successfully');
      } else {
        console.error(`Error disabling user: ${response.data.detail}`);
      }
    } catch (error) {
      console.error('Error disabling user:', error);
    }
  };

  useEffect(() => {
    const fetchAuthorizationCode = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/project_app/send_token_request/');
        const code = response.data.code;
        setAuthorizationCode(code);
        console.log('Authorization Code:', code);
      } catch (error) {
        console.error('Error fetching authorization code', error);
      }
    };

    fetchAuthorizationCode();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/project_app/login/', {
          headers: {
            Authorization: `Bearer ${authorizationCode}`,
          },
        });

        setUserData(response.data[2]);
        setIsAdmin(response.data[2]?.is_admin || false); // Assuming the response has is_admin property
        console.log(response.data[2]);
      } catch (error) {
        console.error('Error fetching user data', error);
      }
    };

    const fetchCardsData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/project_app/cards/', {
          headers: {
            Authorization: `Bearer ${authorizationCode}`,
          },
        });

        setCards(response.data);
      } catch (error) {
        console.error('Error fetching cards data', error);
      }
    };

    fetchUserData();
    fetchCardsData();
  }, [authorizationCode]);

  return (
    <div className="w-full h-screen bg-slate-600">
      <div className="flex flex-row ml-56 mb-20 ">
        <img src={Pfp} className="mt-10" alt="Profile" />
        {userData ? (
          <div className="ml-20 mt-20 text-white text-xl">
            <ul>
              <li>Name: {userData.name}</li>
              <br />
              <li>Enrollment No.: {userData.enrollment_no}</li>
              <br />
              <li>Email: {userData.email}</li>
            </ul>
          </div>
        ) : (
          <p>Loading user data</p>
        )}
      </div>

      <div className=" bg-slate-800 ml-48 pl-24 p-3 text-white text-xl ">Cards</div>

      <div className="flex flex-row ml-80 mt-">
        {cards.map((card, index) => (
          <div key={index} className="flex p-2 bg-slate-400 r flex-wrap mt-16 mr-12 ">
            <ul>
              <li className="mb-1">{card.title}</li>
            </ul>
          </div>
        ))}
      </div>

      {isAdmin && (
        <div>
          <label>
            User Name:
            <input type="text" value={name} onChange={handleNameChange} />
          </label>
          <button onClick={handleDisableUser}>Disable User</button>
        </div>
      )}
    </div>
  );
}

export default Home;
