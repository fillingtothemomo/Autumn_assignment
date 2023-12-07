import { BiHomeAlt2 } from 'react-icons/bi';
import logo from './assets/protrack-low-resolution-logo-white-on-black-background.png';
import { BiLogOut } from 'react-icons/bi';
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';

const SideBar: React.FC = () => {
  const [iconStates, setIconStates] = useState([false, false, false]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const handleLogout = () => {
    axios.get('http://127.0.0.1:8000/project_app/logout_user/')
      .then((response) => {
        console.log('User logged out successfully');
        window.location.href = '/';
      })
      .catch((error) => {
        console.error('Error logging out user', error);
      });
  };
  const handleClick = (index: number) => {
    const updatedIconStates = iconStates.map((state, i) => (i === index ? true : false));
    setIconStates(updatedIconStates);

    setSelectedProject(projects[index]);
  };

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/project_app/projects/")
      .then(response => {
        setProjects(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <div className="fixed top-0 left-0 h-screen w-48 flex flex-col bg-gray-700 text-white shadow-lg">
      <img className="pb-10" src={logo} alt="logo" />
      <i className="flex justify-center text-3xl font-calibri h-100 w-100 mb-20 hover:text-gray-400">
        <Link to="/home">
          <BiHomeAlt2 />
        </Link>
      </i>
      {projects.map((project, index) => (
        <div
          key={index}
          className={`sidebar-card ${iconStates[index] ? 'bg-slate-600' : ''}`}
          onClick={() => handleClick(index)}
        >
          <Link to={`/project/${project.id}/${project.name}`}>{project.name}</Link>
        </div>
      ))}
      <i className="flex justify-center text-3xl font-calibri h-100 w-100 mt-18 hover:text-gray-400" onClick={handleLogout}>
        <BiLogOut />
      </i>
    </div>
  );
};

export default SideBar;
