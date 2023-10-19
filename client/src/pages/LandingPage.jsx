import React, { useEffect } from "react";
import Login from "../components/No Auth Components/Login";
import Signup from "../components/No Auth Components/Signup";
import Home from "../components/No Auth Components/Home";
import Navbar from "../components/No Auth Components/Navbar";
import { Outlet,Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";




function LandingPage() {

  const auth = useAuth();

  useEffect(()=>{

    document.body.style.backgroundColor ="#6063B1";

    return()=>{
      document.body.style.backgroundColor ="";

    }
  });

  // if(auth.user){
  //   return <Navigate to="/app" replace={true} />
  // }
  return (
    <>


        <Navbar />
        <Outlet/>
    </>
  );
}

export default LandingPage;


