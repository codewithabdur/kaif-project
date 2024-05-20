import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Alert } from "@mui/material";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri"; // Import eye icons
import { db } from "../../lib/firebase";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const [isSetPassword, setIsSetPassword] = useState(
    localStorage.getItem("isDarkMode") === "true"
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Store user information in local storage
      localStorage.setItem(
        "user",
        JSON.stringify(userCredential.user.auth.lastNotifiedUid)
      );
      localStorage.removeItem("verifiedPhone");
      setIsLoading(false);
      navigate(`/`);
    } catch (error) {
      // console.error("Error logging in:", error.message);
      setIsLoading(false);
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 3000);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-semibold mb-4">Login</h2>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 font-semibold mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-gray-700 font-semibold mb-1"
          >
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            required
          />
          <span className="cursor-pointer ml-2" onClick={handleTogglePassword}>
            {showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
          </span>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 button text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
         { isLoading ? "Loging in... " : "Login"}
        </button>
        {error && (<Alert severity="error" className="mt-4">Invalid Email or Password!</Alert>)}
        <Link to={`/phoneAuth`}>
          <h1 className="mt-6 underline">New User</h1>
        </Link>
      </form>
    </div>
  );
};

export default Login;
