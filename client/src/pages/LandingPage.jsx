import React, { useEffect } from "react";
import Login from "../components/No Auth Components/Login";
import Signup from "../components/No Auth Components/Signup";
import Home from "../components/No Auth Components/Home";
import Navbar from "../components/No Auth Components/Navbar";



function LandingPage() {

  useEffect(()=>{

    document.body.style.backgroundColor ="#6063B1";

    return()=>{
      document.body.style.backgroundColor ="";

    }
  });
  return (
    <>


        <Navbar />
        <Signup/>
    </>
  );
}

export default LandingPage;


