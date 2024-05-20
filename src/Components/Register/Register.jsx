import React, { useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {  useNavigate } from "react-router-dom";
import { auth, db } from "../../lib/firebase";
import { Link } from "react-router-dom";
import { Alert } from "@mui/material";

const Register = () => {
  // const verifiedPhone = localStorage.getItem("verifiedPhone");
  const verifiedPhone = localStorage.getItem("verifiedPhone");
  const defaultProfileImageURL =
    "https://icons8.com/icon/tZuAOUGm9AuS/user-default";
  const [submit, setSubmit] = useState(false)
  const [sucess, setSuccess] = useState(false)
  const [error, setError] = useState(false)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [image, setImage] = useState(""); // Store image URL
  const [phoneNumber, setPhoneNumber] = useState(verifiedPhone || "");
  const [address, setAddress] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [userData, setUserData] = useState({
    username: "",
    password: "",
    cnfrmpassword: "",
    email: "",
    fullName: "",
    phone: verifiedPhone,
    address: "",
    state: "",
    district: "",
    // No profileImage property here initially
  });
const postUserData = (event) => {
  const { name, value } = event.target;
  setUserData((prevData) => ({
    ...prevData,
    [name]: value,
  }));
};

const handleImageChange = (e) => {
  const file = e.target.files[0];
  setImage(file); // Store the file itself, not the URL
};

const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmit(true);

  try {
    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }

    const auth = getAuth();
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      userData.password
    );

    let imageURL = "";
    if (image) {
      const storage = getStorage();
      const storageRef = ref(storage, `profile_images/${userData.username}`);
      await uploadBytes(storageRef, image);
      imageURL = await getDownloadURL(storageRef);
    }

    const db = getFirestore();
    const userRef = doc(db, "users", userData.username);
    await setDoc(userRef, {
      uid: userCredential.user.uid,
      username: userData.username,
      fullName: userData.fullName,
      password: userData.phone,
      phone: verifiedPhone,
      email: userData.email,
      address: userData.address,
      state: userData.state,
      district: userData.district,
      profileImage: imageURL,
    });

    setSubmit(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
    }, 2000);
  } catch (error) {
    setSubmit(false);
    setError(true);
    setTimeout(() => {
      setError(false);
    }, 2000);
    console.error("Error registering user:", error.message);
  }
};



  return (
    <>
      {sucess && <Alert severity="success">Data Stored</Alert>}
      {error && <Alert severity="error">Some Error Occured</Alert>}
      <div className="flex  justify-center ">
        <div className="flex flex-row-reverse bg-white">
          {/* Display image */}
          {image && (
            <div className="mb-4">
              <img
                src={image}
                alt="Selected"
                className="max-w-[10rem] object-cover h-auto"
              />
            </div>
          )}
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-lg shadow-md"
          >
            <h2 className="text-2xl font-semibold mb-4">Register</h2>
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
                value={userData.email}
                onChange={postUserData}
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
                type="password"
                id="password"
                name="password"
                value={userData.password}
                onChange={postUserData}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="confirmPassword"
                className="block text-gray-700 font-semibold mb-1"
              >
                Confirm Password
              </label>
              <input
                type="password"
                name="cnfrmpassword"
                value={userData.cnfrmpassword}
                onChange={postUserData}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-gray-700 font-semibold mb-1"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={userData.username}
                onChange={postUserData}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="fullName"
                className="block text-gray-700 font-semibold mb-1"
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={userData.fullName}
                onChange={postUserData}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            {/* Assuming image upload field */}
            <div className="mb-4">
              <label
                htmlFor="image"
                className="block text-gray-700 font-semibold mb-1"
              >
                Image
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="phoneNumber"
                className="block text-gray-700 font-semibold mb-1"
              >
                Phone Number
              </label>
              <input
                type="text"
                id="phoneNumber"
                value={verifiedPhone}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="address"
                className="block text-gray-700 font-semibold mb-1"
              >
                Address
              </label>
              <input
                type="text"
                name="address"
                id="address"
                value={userData.address}
                onChange={postUserData}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="state"
                className="block text-gray-700 font-semibold mb-1"
              >
                State
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={userData.state}
                onChange={postUserData}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="district"
                className="block text-gray-700 font-semibold mb-1"
              >
                District
              </label>
              <input
                type="text"
                id="district"
                name="district"
                value={userData.district}
                onChange={postUserData}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={submit}
              className="w-full button bg-blue-500 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              {submit ? "registering.." : "Register"}
            </button>
            <Link to={`/login`}>
              <button
                type="submit"
                className="w-full button bg-blue-500 text-white font-semibold px-1 py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                Login
              </button>
            </Link>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
