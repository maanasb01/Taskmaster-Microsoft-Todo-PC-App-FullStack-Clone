import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useLoading } from "../../contexts/LoadingContext";
import { HOST } from "../../config/config";

export function NameEditForm() {
  const [error, setError] = useState("");
  const [newName, setNewName] = useState(""); // State variable for new name
  const [password, setPassword] = useState(""); // State variable for password
  const { setUser } = useAuth();
  const { fetchWithLoader } = useLoading();

  const navigate = useNavigate();

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  //Handle Change name request
  const handleApply = async () => {
    if (newName.trim() === "" || password.trim() === "") {
      setError("* All Fields are Necessary.");
      return;
    }

    // Prepare the data to send to the backend
    const data = {
      newName: newName,
      password: password,
    };

    try {
      const response = await fetchWithLoader(`${HOST}/edit/name`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        navigate("/app/profile", { replace: true });
      } else {
        // Handle errors or display error messages
        const errorData = await response.json();
        setError("* " + errorData.message); // Set the error message from the response
      }
    } catch (error) {
      console.error("Error:", error);
      setError("* An error occurred while making the request.");
    }
  };

  return (
    <>
      <div className="w-full sm:w-2/3 sm:pl-8 sm:py-5 mt-4 pt-4 sm:mt-0 text-center sm:text-left">
        <div className="h-3 mb-5">
          <p className="text-red-500 p-2">{error}</p>
        </div>
        <h2 className="text-gray-200 text-lg font-bold title-font mb-3">
          Edit Full-Name
        </h2>

        <div className="relative mb-4">
          <label
            htmlFor="full-name"
            className="leading-7 text-sm text-gray-300"
          >
            Enter New Full-Name
          </label>
          <input
            type="text"
            id="full-name"
            name="full-name"
            value={newName}
            onChange={handleNameChange}
            className="w-full bg-white rounded border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          />
        </div>
        <div className="relative mb-4">
          <label htmlFor="password" className="leading-7 text-sm text-gray-300">
            Confirm Your Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
            className="w-full bg-white rounded border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          />
        </div>
        <button
          className="text-white bg-red-800 hover:bg-red-900 border-0 py-2 px-8 focus:outline-none rounded mr-4"
          onClick={() => navigate("/app/profile")}
        >
          Cancel
        </button>
        <button
          className="text-white bg-blue-900 hover:bg-blue-950 border-0 py-2 px-8 focus:outline-none rounded"
          onClick={handleApply} // Call the handleApply function to make the PATCH request
        >
          Apply
        </button>
      </div>
    </>
  );
}

export function EmailEditForm() {
  const [error, setError] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useAuth();
  const { fetchWithLoader } = useLoading();
  const navigate = useNavigate();

  const handleEmailChange = (event) => {
    setNewEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const isValidEmail = (email) => {
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailPattern.test(email);
  };

  //Handle Email Edit
  const handleEmailEdit = async () => {
    if (!newEmail.trim() || !password.trim()) {
      setError("* Please fill in all fields.");
      return;
    }

    if (!isValidEmail(newEmail)) {
      setError("* Invalid email format.");
      return;
    }

    // Prepare the data to send to the backend
    const data = {
      newEmail: newEmail,
      password: password,
    };

    try {
      const response = await fetchWithLoader(`${HOST}/edit/email`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        navigate("/app/profile", { replace: true });
      } else {
        const errorData = await response.json();
        setError("* " + errorData.message);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("* An error occurred while making the request.");
    }
  };

  return (
    <>
      <div className="w-full sm:w-2/3 sm:pl-8 sm:py-5 mt-4 pt-4 sm:mt-0 text-center sm:text-left">
        <div className="h-3 mb-5">
          <p className="text-red-500 p-2">{error}</p>
        </div>
        <h2 className="text-gray-200 text-lg font-bold title-font mb-3">
          Edit Email
        </h2>

        <div className="relative mb-4">
          <label htmlFor="email" className="leading-7 text-sm text-gray-300">
            Enter New Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={newEmail}
            onChange={handleEmailChange}
            className="w-full bg-white rounded border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          />
        </div>
        <div className="relative mb-4">
          <label htmlFor="password" className="leading-7 text-sm text-gray-300">
            Confirm Your Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
            className="w-full bg-white rounded border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          />
        </div>
        <button
          className="text-white bg-red-800 hover:bg-red-900 border-0 py-2 px-8 focus:outline-none rounded mr-4"
          onClick={() => navigate("/app/profile")}
        >
          Cancel
        </button>
        <button
          className="text-white bg-blue-900 hover:bg-blue-950 border-0 py-2 px-8 focus:outline-none rounded"
          onClick={handleEmailEdit}
        >
          Apply
        </button>
      </div>
    </>
  );
}

//Password Form

export function PasswordEditForm() {
  const [error, setError] = useState("");
  const [successMsg, setsuccessMsg] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [previousPassword, setPreviousPassword] = useState("");
  const { fetchWithLoader } = useLoading();
  const navigate = useNavigate();

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handlePreviousPasswordChange = (event) => {
    setPreviousPassword(event.target.value);
  };

  const isPasswordValid = (password) => {
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
    return passwordRegex.test(password);
  };

  //Handle Password Edit
  const handleApplyPasswordEdit = async () => {
    if (!newPassword.trim() || !previousPassword.trim()) {
      setError("* Please fill in all fields.");
      return;
    }
    if (!isPasswordValid(newPassword)) {
      setError(
        "* Password must be at least 6 characters long and contain at least one letter, one number, and one special character."
      );
      return;
    }
    const data = {
      newPassword: newPassword,
      password: previousPassword,
    };

    try {
      const response = await fetchWithLoader(`${HOST}/edit/password`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setError("");
        setsuccessMsg("Password reset successfully");
        setTimeout(() => {
          navigate("/app/profile", { replace: true });
        }, 500);
      } else {
        const errorData = await response.json();
        setError("* " + errorData.message);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("* An error occurred while making the request.");
    }
  };

  return (
    <>
      <div className="w-full sm:w-2/3 sm:pl-8 sm:py-5 mt-4 pt-4 sm:mt-0 text-center sm:text-left">
        <div className="h-3 mb-24 lg:mb-20 xl:mb-12">
          <p className="text-red-500 p-2 ">{error}</p>
          {successMsg ? <p className="text-white p-2">* {successMsg}</p> : null}
        </div>
        <h2 className="text-gray-200 text-lg font-bold title-font mb-3">
          Reset Password
        </h2>

        <div className="relative mb-4">
          <label
            htmlFor="new-password"
            className="leading-7 text-sm text-gray-300"
          >
            Enter New Password
          </label>
          <input
            type="password"
            id="new-password"
            name="new-password"
            value={newPassword}
            onChange={handleNewPasswordChange}
            className="w-full bg-white rounded border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          />
        </div>
        <div className="relative mb-4">
          <label
            htmlFor="previous-password"
            className="leading-7 text-sm text-gray-300"
          >
            Confirm Your Previous Password
          </label>
          <input
            type="password"
            id="previous-password"
            name="previous-password"
            value={previousPassword}
            onChange={handlePreviousPasswordChange}
            className="w-full bg-white rounded border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          />
        </div>
        <button
          className="text-white bg-red-800 hover:bg-red-900 border-0 py-2 px-8 focus:outline-none rounded mr-4"
          onClick={() => navigate("/app/profile")}
        >
          Cancel
        </button>
        <button
          className="text-white bg-blue-900 hover:bg-blue-950 border-0 py-2 px-8 focus:outline-none rounded"
          onClick={handleApplyPasswordEdit}
        >
          Apply
        </button>
      </div>
    </>
  );
}
