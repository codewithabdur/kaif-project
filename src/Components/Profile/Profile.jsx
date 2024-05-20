import React, { useEffect, useState } from "react";
import { Alert } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { auth, db, storage } from "../../lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { PropagateLoader } from "react-spinners";
import { MdEdit } from "react-icons/md";
import { HiBadgeCheck } from "react-icons/hi";
import { TiTimes } from "react-icons/ti";

const Profile = () => {
   const [userData, setUserData] = useState(null);
   const [profileImage, setprofileImage] = useState(null);
   const [newprofileImage, setNewprofileImage] = useState(null);
   const [imageUpdate, setImageUpdate] = useState(false);
   const [showUploadButton, setShowUploadButton] = useState(false);
   const [errorInImageUpdate, setErrorInImageUpdate] = useState(false);
   const [emailVerified, setEmailVerified] = useState(false);
   const [emailNotVerified, setEmailNotVerified] = useState(false);
   const [noUser, setNoUser] = useState(false);
   const [uploading, setUploading] = useState(false);
   const isLoggedIn = JSON.parse(localStorage.getItem("user")) !== null;
   // const [newEmail, setNewEmail] = useState("");
   // const [updatingEmail, setUpdatingEmail] = useState(false);
   // const [loading, setLoading] = useState(false);
   // const [ successEmail, setSuccessEmail] = useState(false)
   // const [errorEmail, setErrorEmail] = useState(false);

   const navigate = useNavigate();

   // const handleUpadate = () => {
   //   setUpdatingEmail(true);
   // };

   // const handleEmailUpdate = async () => {
   //   setLoading(true);
   //   const currentUser = auth.currentUser;
   //   console.log(currentUser.email); // Debugging statement
   //   if (currentUser) {
   //     try {
   //       await updateEmail(currentUser, newEmail);
   //       // Update email in Firestore
   //       await updateDoc(doc(db, "users", currentUser.uid), {
   //         email: newEmail,
   //       });
   //       // Clear input field
   //       setNewEmail("");
   //       setSuccessEmail(true);
   //       setTimeout(() => {
   //         setSuccessEmail(false);
   //       }, 2000);
   //       setLoading(false);
   //       setUpdatingEmail(false);
   //       // Handle other state updates
   //     } catch (error) {
   //       console.error("Error updating email:", error.message);
   //       setUpdatingEmail(false);
   //       setLoading(false);
   //       setErrorEmail(true);
   //       setTimeout(() => {
   //         setErrorEmail(false);
   //       }, 2000);
   //     }
   //   } else {
   //     console.error("User not authenticated");
   //     setUpdatingEmail(false);
   //     setLoading(false);
   //     setErrorEmail(true);
   //     setTimeout(() => {
   //       setErrorEmail(false);
   //     }, 2000);
   //   }
   // };
   
   const goback = () =>{
    navigate(`/`)
   }

   const handleFileChange = (event) => {
     const file = event.target.files[0];
     setNewprofileImage(file);
     setShowUploadButton(true); // Set showUploadButton to true
   };

   const handleUpload = async () => {
     setUploading(true);
     if (newprofileImage) {
       const currentUser = auth.currentUser;
       if (currentUser) {
         try {
           // Upload new profile image to Firebase Storage
           const storageRef = ref(storage, `profile_images/${currentUser.uid}`);
           await uploadBytes(storageRef, newprofileImage);

           // Get the download URL of the uploaded image
           const imageUrl = await getDownloadURL(storageRef);

           // Update the user document in Firestore with the new image URL
           await updateDoc(doc(db, "users", currentUser.uid), {
             profileImage: imageUrl,
           });

           // Update the state to re-render with the new image
           setprofileImage(imageUrl);
           setImageUpdate(true);
           setTimeout(() => {
             setImageUpdate(false);
           }, 2000);

           // Reset the newprofileImage state
           setNewprofileImage(null);
           // Hide the upload button after successful upload
           setShowUploadButton(false);
           setUploading(false);
         } catch (error) {
           setErrorInImageUpdate(true);
           setTimeout(() => {
             setErrorInImageUpdate(false);
           }, 2000);
           // console.error("Error uploading profile image:", error);
         }
       }
     }
   };

   useEffect(() => {
     const fetchUserData = async () => {
       const currentUser = auth.currentUser;
       if (currentUser) {
         // Fetch the user document from Firestore based on the 'email' field
         const usersCollectionRef = collection(db, "users");
         const q = query(
           usersCollectionRef,
           where("email", "==", currentUser.email)
         );
         const querySnapshot = await getDocs(q);

         if (!querySnapshot.empty) {
           // If the query result is not empty, there is a matching user
           const userData = querySnapshot.docs[0].data();
           // console.log(userData)
           setUserData(userData);

           // Fetch the user's profile image from Storage
           if (userData.img) {
             const imageRef = ref(storage, userData.img);
             const imageUrl = await getDownloadURL(imageRef);
             // console.log(imageUrl)
             setprofileImage(imageUrl);
             setNoUser(false);
           }
           if (!currentUser.emailVerified) {
             setEmailNotVerified(true);
             // You can display a message or take appropriate action here
           } else {
             setEmailVerified(true);
           }
         } else {
           // console.clear();
           setTimeout(() => {
             setNoUser(true);
           }, 10000);
         }
       }
     };
     // Call the function immediately
     fetchUserData();
     // Include auth.currentUser as a dependency
   }, [auth.currentUser]);

   const handleLogout = () => {
     // Remove the user data from localStorage
     localStorage.removeItem("user");
     localStorage.removeItem("verifiedPhone");
     navigate(`/`);
   };

   const handleCancle = () => {
     setShowUploadButton(false);
   };
   const showButton = () => {
     setShowUploadButton(true);
   };

   if (!userData) {
     return (
       <div className="Loading">
         <PropagateLoader color="#36d7b7" size={20} />
       </div>
     );
   }
  return (
    <>
      {imageUpdate && (
        <Alert severity="success" className="my-4">
          Image Updated!
        </Alert>
      )}

      {errorInImageUpdate && (
        <Alert severity="error" className="my-4">
          Apologies for the inconvenience; there was an error updating the
          image.
        </Alert>
      )}

      <div className="flex justify-center items-center  ">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl text-[#245968] font-black mb-6 text-center">
            User Profile
          </h2>
          {userData && userData.profileImage ? (
            <div className="content__avatar relative flex justify-center">
              <img
                className="rounded-full h-48 w-48 object-cover"
                src={profileImage || userData.profileImage}
                alt={userData.username}
              />
              <label htmlFor="fileInput" className="absolute bottom-0 right-0">
                <MdEdit
                  onClick={showButton}
                  className="text-[#3cb992] hover:text-[#57d29b] text-2xl cursor-pointer"
                />
                <input
                  type="file"
                  id="fileInput"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
              <div className="flex">
                {showUploadButton && (
                  <button
                    onClick={handleUpload}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md font-semibold mr-2"
                    disabled={uploading}
                  >
                    {uploading ? "Uploading..." : "Upload"}
                  </button>
                )}
                {showUploadButton && (
                  <button
                    onClick={handleCancle}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md font-semibold"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-6xl text-white">
                {userData?.username?.charAt(0)}
              </h2>
              <label htmlFor="fileInput" className="cursor-pointer ml-2">
                <MdEdit className="text-[#2bffbc] hover:text-[#3fa075] text-2xl cursor-pointer" />
                <input
                  type="file"
                  id="fileInput"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
              {showUploadButton && (
                <button
                  onClick={handleUpload}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md font-semibold ml-2"
                  disabled={uploading}
                >
                  {uploading ? "Uploading..." : "Upload"}
                </button>
              )}
            </div>
          )}
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
              value={userData.username} // Replace with actual username
              className="w-full px-3 py-2 border rounded-md bg-gray-100 cursor-not-allowed"
              disabled
            />
          </div>
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
              value={userData.email} // Replace with actual email
              className="w-full px-3 py-2 border rounded-md bg-gray-100 cursor-not-allowed"
              disabled
            />
          </div>
          <div className="flex justify-between mb-4">
            <div>
              <label
                htmlFor="fullName"
                className="block text-gray-700 font-semibold mb-1"
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                value={userData.fullName} // Replace with actual full name
                className="w-full px-3 py-2 border rounded-md bg-gray-100 cursor-not-allowed"
                disabled
              />
            </div>
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-gray-700 font-semibold mb-1"
              >
                Phone Number
              </label>
              <input
                type="text"
                id="phoneNumber"
                value={userData.phone} // Replace with actual phone number
                className="w-full px-3 py-2 border rounded-md bg-gray-100 cursor-not-allowed"
                disabled
              />
            </div>
          </div>
          <div className="mb-4">
            <label
              htmlFor="address"
              className="block text-gray-700 font-semibold mb-1"
            >
              Address
            </label>
            <textarea
              id="address"
              rows="3"
              value={userData.address} // Replace with actual address
              className="w-full px-3 py-2 border rounded-md bg-gray-100 cursor-not-allowed"
              disabled
            ></textarea>
          </div>
          <div className="flex justify-between">
            <div>
              <label
                htmlFor="state"
                className="block text-gray-700 font-semibold mb-1"
              >
                State
              </label>
              <input
                type="text"
                id="state"
                value={userData.state} // Replace with actual state
                className="w-full px-3 py-2 border rounded-md bg-gray-100 cursor-not-allowed"
                disabled
              />
            </div>
            <div>
              <label
                htmlFor="district"
                className="block text-gray-700 font-semibold mb-1"
              >
                District
              </label>
              <input
                type="text"
                id="district"
                value={userData.district} // Replace with actual district
                className="w-full px-3 py-2 border rounded-md bg-gray-100 cursor-not-allowed"
                disabled
              />
            </div>
          </div>
          <div className="flex justify-between">
            <button className="button" onClick={goback}>
              HomePage
            </button>
            <button
              className="buttonlogout bg-[#ee2e64]"
              onClick={handleLogout}
            >
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
