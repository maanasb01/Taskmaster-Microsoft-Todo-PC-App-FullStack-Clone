import React, { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import emailIcon from "../../assets/email_icon.svg";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { HOST } from "../../config/config";

//Profile Navbar

function ProfileNav({ handleLogout }) {
  return (
    <header className="">
      <div className="mx-auto flex justify-between p-3 items-center">
        <Link to="/app" className="mb-0 cursor-pointer">
          <span className="ml-3 text-2xl md:text-4xl font-bold text-gray-100">
            Taskmaster
          </span>
        </Link>
        <nav className="ml-auto text-base">
          <Link
            to="/app"
            className={`text-gray-300 mr-4 font-medium text-sm md:text-lg cursor-pointer`}
          >
            Home
          </Link>
          <a
            onClick={handleLogout}
            className={`text-gray-300 mr-4 font-medium text-sm md:text-lg cursor-pointer`}
          >
            LogOut
          </a>
        </nav>
      </div>
    </header>
  );
}

//The right side displayed user info. (Inside the space which get replaced with Edit forms)

export function UserInfo() {
  const { user, setUser } = useAuth();

  return (
    <>
      <div className="w-full sm:w-2/3 sm:pl-8 sm:py-8  mt-4 pt-4 sm:mt-0 text-center sm:text-left">
        <div className="text-gray-300 flex items-center  mx-auto border-b pb-10 mb-10 border-gray-200 sm:flex-row flex-col w-full">
          <div className="w-11 h-11 md:w-14 md:h-14  sm:mr-10 inline-flex items-center justify-center rounded-full bg-purple-100 text-[#859080] text-4xl font-semibold">
            {user.name.trim().split()[0][0].toUpperCase()}
          </div>
          <div className="flex-grow sm:text-left text-center mt-6 sm:mt-0">
            <h2 className=" text-2xl title-font font-bold mb-2">Full Name</h2>
            <p className="leading-relaxed text-base">{user.name}</p>
            <Link
              to={"/app/profile/editname"}
              className="mt-3 bg-gray-300 text-slate-700 rounded-md px-3 py-1  inline-flex items-center cursor-pointer"
            >
              Edit
              <svg
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                className="w-4 h-4 ml-2"
                viewBox="0 0 24 24"
              >
                <path d="M5 12h14M12 5l7 7-7 7"></path>
              </svg>
            </Link>
          </div>
        </div>

        <div className="text-gray-300 flex items-center  mx-auto border-b pb-10 mb-10 border-gray-200 sm:flex-row flex-col">
          <div className="w-11 h-11 md:w-14 md:h-14  sm:mr-10 inline-flex items-center justify-center rounded-full bg-purple-100 text-purple-500 flex-shrink-0">
            <img src={emailIcon} alt="" className="h-28" />
          </div>
          <div className="flex-grow sm:text-left text-center mt-6 sm:mt-0">
            <h2 className=" text-2xl title-font font-bold mb-2">Email</h2>
            <p className="leading-relaxed text-base">{user.email}</p>
            <Link
              to={"/app/profile/editemail"}
              className="mt-3 bg-gray-300 text-slate-700 rounded-md px-3 py-1  inline-flex items-center cursor-pointer"
            >
              Edit
              <svg
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                className="w-4 h-4 ml-2"
                viewBox="0 0 24 24"
              >
                <path d="M5 12h14M12 5l7 7-7 7"></path>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

function Profile() {
  const { user, setUser } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.backgroundColor = "#5c70be";

    return () => {
      document.body.style.backgroundColor = "";
    };
  });

  const handleWarningModalOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  async function handleLogout() {
    try {
      const response = await fetch(`${HOST}/auth/logout`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();

      if (response.ok) {
        if (data.success) {
          setUser(null);
          navigate("/login", { replace: true });
        }
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("An error occurred while logging out:", error.message);
    }
  }

  async function handleDeleteAccount() {
    try {
      const res = await fetch(`${HOST}/deleteuser`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setOpen(false);
        setUser(null);
        navigate("/", { replace: true });
        return;
      } else {
        alert("Something went wrong while deleting your account! ");
        return;
      }
    } catch (error) {
      console.error("Something went wrong: " + error.message);
      alert("Something went wrong while deleting your account! ");
    }
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete Account Permanently?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete your account from Taskmaster
            permanently?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <button
            className="mr-2 bg-gray-500 cursor-pointer hover:bg-gray-600 text-white py-1 px-2 rounded-md"
            onClick={handleClose}
            autoFocus
          >
            Cancel
          </button>
          <button
            className="mr-2 bg-red-800 cursor-pointer hover:bg-red-900 text-white py-1 px-2 rounded-md"
            onClick={handleDeleteAccount}
          >
            Proceed
          </button>
        </DialogActions>
      </Dialog>

      <ProfileNav handleLogout={handleLogout} />

      <section className="">
        <div className="container px-5 py-10 mx-auto flex flex-col">
          <div className="lg:w-4/6 mx-auto">
            <div className="flex flex-col sm:flex-row mt-10 ">
              <div className="w-full md:w-1/3 text-center sm:pr-8 sm:py-8 flex flex-col items-center justify-center sm:border-r border-gray-200 sm:border-b-0 border-b pb-6">
                <div className="w-20 h-20 rounded-full inline-flex items-center justify-center bg-gray-200 text-gray-400">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    className="w-10 h-10"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <div className="flex flex-col items-center text-center justify-center">
                  <h2 className="font-semibold title-font mt-4 text-gray-300 text-2xl">
                    {user.name.trim()}
                  </h2>
                  <h2 className="font-normal title-font mt-2 text-gray-300 text-base">
                    {user.email}
                  </h2>
                  <div className="w-12 h-1 bg-gray-300 rounded mt-2 mb-4"></div>
                </div>
                <div className="flex flex-col space-y-2 items-center justify-center text-sm sm:text-base">
                  <Link to={"/app/profile/resetpassword"}>
                    <button className="bg-blue-900 cursor-pointer hover:bg-blue-950 text-gray-300 py-1 px-2 rounded-md">
                      Reset Password
                    </button>
                  </Link>
                  <button
                    onClick={handleWarningModalOpen}
                    className="bg-red-800 cursor-pointer hover:bg-red-900 text-gray-300 py-1 px-2 rounded-md"
                  >
                    Delete Account
                  </button>
                </div>
              </div>

              {/* User's Details and Edit Forms */}
              <Outlet />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Profile;
