import React, { useEffect } from "react";

const LoginPage = () => {
  const handleLoginRedirect = () => {
    window.location.href = "http://127.0.0.1:8000/project_app/send_token_request/";
  };

  useEffect(() => {
    const handleAuthenticationResponse = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (code) {
        // Handle the authentication code (e.g., send it to your server for token exchange)
        console.log("Authentication code:", code);

        // Redirect the user to the desired page after authentication
        window.location.href = "/home"; // Adjust the URL as needed
      }
    };

    handleAuthenticationResponse();
  }, []);

  return (
    <div className="login-container">
      <h2>Login to ProTrack</h2>
      <p>
        To access this application, please click the button below to initiate the login process.
      </p>
      <button className="login-button ml-60" onClick={handleLoginRedirect}>
        Login
      </button>
    </div>
  );
};

export default LoginPage;
