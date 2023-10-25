import { useState } from "react";
import {ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import textFieldTheme from "./textFieldTheme";
import { Link, Navigate, redirect, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useLoading } from "../../contexts/LoadingContext";
import { HOST } from "../../config/config";



export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error,setError] = useState("");
  const [success, setSuccess] = useState("");
  const {user, setUser} = useAuth();
  const {setLoading} = useLoading();
  

  const navigate = useNavigate();


  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const isEmailValid = (email) => {
    // Simple email validation using a regular expression
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    return emailRegex.test(email);
  };

//Handle Login Request
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if(email.trim()==="" || password.trim()===""){
      setError("All Fields are Necessary.");
      return;
    }

    if(!isEmailValid(email)){
      setError("Enter a Valid Email");
      return;
    }

    // Create a data object to send to the API
    const data = {
      email:  email.trim(),
      password: password.trim(),
    };

    try {
      // Send a POST request to your authentication API
      const response = await fetch(`${HOST}/auth/login`, {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const data = await response.json();

        if (data.success) {
          setSuccess("Login successful!");
          setError("");
          setUser(data.user); 
          navigate("/app",{replace: true});

        } else {
          setError(data.message);
          setSuccess("");
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message);
        setSuccess("");
      }
    } catch (error) {
      console.error("An error occurred while logging in:", error);
      setError("An error occurred while logging in")
    }finally{
      setLoading(false);
    }
  };


  return (
    <>
    {user?
    <p className="text-gray-300 text-xl font-semibold fixed top-16 left-3">Redirecting to the App...</p>
    :
    null
  }
      {<div className="h-full flex flex-col items-center justify-center">
        <p className="font-popins text-4xl md:text-5xl font-semibold text-gray-200 mb-3 mt-20">LogIn</p>
        
        <div className="h-3 mb-8">
          {error && <p className="text-red-500 p-2">* {error}</p>}
          {success && <p className="text-white p-2">* {success}</p>}
        </div>

            <ThemeProvider theme={textFieldTheme}>
        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex flex-col space-y-8 items-center mx-auto w-3/6 md:w-2/6">

            <TextField
              variant="standard"
              label="Email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              className="w-full bg-[#6063B1]"
              />
            <TextField
              variant="standard"
              type="password"
              label="Password"
              value={password}
              onChange={handlePasswordChange}
              className="w-full"
              />
            <button type="submit" className="text-white bg-[#444684] px-4 py-2 rounded-lg text-lg hover:bg-[#4a4c8f]">
              Login
            </button>
          </div>
        </form>
            <div className="flex flex-col items-center space-y-2 mt-5">
              <p className="text-gray-200">New User?</p>
              <Link to={'/signup'}>
                <button className="bg-gray-200 hover:bg-gray-100 px-4 py-2 rounded-md">
                  Register Here
                </button>
              </Link>
            </div>
              </ThemeProvider>
      </div>}
    </>
  );
}
