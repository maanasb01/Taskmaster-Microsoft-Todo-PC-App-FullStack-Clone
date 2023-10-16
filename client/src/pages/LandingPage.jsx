import React from "react";
import todoListImg from "../assets/Landing page assets/to-do-list.svg"

function LandingPage() {
  return (
    <>
      <div className="h-screen w-screen  bg-[#6063B1] font-popins">
        <div className="flex justify-around pt-20">
            <div className="flex flex-col items-center justify-center">
                <p className="font-semibold text-5xl text-[#B8A2F7]">Get Yourself Together  </p>
                <p className="font-semibold text-5xl text-[#B8A2F7] mx-auto">with</p>
                <p className="font-bold text-8xl text-[#EDECEC]">Taskmaster</p>
            </div>
            <div>
                <img src={todoListImg} alt="" />
            </div>

        </div>
        <div className="text-[#333C6E] text-5xl w-full px-auto">
            Features
        </div>


        </div>
    </>
  );
}

export default LandingPage;


