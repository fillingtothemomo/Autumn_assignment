import React from "react";

const LoginPage = () => {
    

  const handleLoginRedirect = () => {
    // Redirect the user to the backend's login endpoint
    window.location.href = "http://127.0.0.1:8000/project_app/send_token_request/";
  };

  return (
    <div className="login-container">
      
      <h2>Login to ProTrack</h2>

      <p>
        To access this application, please click the button below to initiate the login process.
      </p>

      <button className="login-button ml-40" onClick={handleLoginRedirect}>
        Login
      </button>
    </div>
  );
};

export default LoginPage;
