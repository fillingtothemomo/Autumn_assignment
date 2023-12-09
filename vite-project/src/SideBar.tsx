
import { BiHomeAlt2 } from 'react-icons/bi';
import logo from './assets/protrack-low-resolution-logo-white-on-black-background.png';
import { BiLogOut } from 'react-icons/bi';
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { IoIosAdd } from "react-icons/io";
import Modal from 'react-modal';
import axios from 'axios';

const SideBar: React.FC = () => {
  const [iconStates, setIconStates] = useState([false, false, false]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [isDialogOpen, setDialogOpen] = useState(false);

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

  const handleIconClick = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleCreateProject = () => {
    const data = {
      name: newName,
      desc: newDesc,
      members: ['14'],
    };
  
    axios.post('http://127.0.0.1:8000/project_app/create_project/', data)
      .then((response) => {
        const newProject = response.data;
        setProjects([...projects, newProject]); 
        handleCloseDialog();
      })
      .catch((error) => {
        console.error(error.response.data);
      });
  };
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/project_app/projects/')
      .then(response => {
        setProjects(response.data);
      })
      .catch(error => {
        console.error(error);
        console.error(error.response?.data);
        console.error(error.response?.headers);
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
      <i className="flex justify-center text-3xl font-calibri h-100 w-100 mb-20 hover:text-gray-400">
        <IoIosAdd onClick={handleIconClick} />
      </i>
      <Modal
        isOpen={isDialogOpen}
        onRequestClose={handleCloseDialog}
        contentLabel="New Project Dialog"
      >
        <div className="flex flex-row justify-between">
          <p className="text-lg bg-gray-400 p-3">New Project</p>
          <input
            className="border-4 ml-24"
            type="text"
            placeholder="Project name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <input
            className="border-4 ml-24"
            type="text"
            placeholder="Project description"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
          />
          <button className="create-list-button border-4 mr-28" onClick={handleCreateProject}>
            Create Project
          </button>
          <button onClick={handleCloseDialog}>Close</button>
        </div>
      </Modal>
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
