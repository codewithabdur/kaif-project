import { FaFacebook } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";
import { GrInstagram } from "react-icons/gr";
import { SiGmail } from "react-icons/si";
import { FaPhoneAlt } from "react-icons/fa";
import {about} from "../../images"
import { auth, db, storage } from "../../lib/firebase";
import client from "../../lib/client";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Footer = () => {
  const [userData, setUserData] = useState(null);
const [posts, setPosts] = useState([]);
const userString = localStorage.getItem("user");
const user = userString ? JSON.parse(userString) : null;
const isLoggedIn = JSON.parse(localStorage.getItem("user")) !== null;
// const [profileImage, setProfileImage] = useState(null);

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
        }
      } else {
        console.clear();
      }
    }
  };
  // Call the function immediately
  fetchUserData();
  // Include auth.currentUser as a dependency
}, [auth.currentUser]);
  return (
    <footer className="w-[80%] mx-auto text-white p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* About Us */}
        <div>
          {/* <h2 className="text-xl font-bold mb-4">About Us</h2>
          <p className="text-sm">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in
            turpis vel ex consectetur suscipit.
          </p> */}
          {userData?.profileImage ? (
            <Link to={`/profile/${user}`} className=" ml-4">
              <img
                src={userData?.profileImage}
                alt=""
                className="h-[5rem] w-[5.5rem] object-cover rounded-[50%]"
              />
            </Link>
          ) : (
            <img
              src={`https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg?w=740&t=st=1705308650~exp=1705309250~hmac=cbe9486df80e8f098d3d134dc01c480cc26c91fade809543c1557bc2fcf8ed7e`}
              alt=""
              className="h-[5rem] w-[5.5rem] object-cover rounded-[50%]"
            />
          )}
        </div>

        {/* Contact */}
        <div>
          <h2 className="text-xl font-bold mb-4">Contact</h2>
          <a href="mailto:kaifkhan1r@gmail.com" className="text-sm flex">
            <SiGmail className="mt-[4px]" /> : kaifkhan1r@gmail.com
          </a>
          <a href="tel:9911925131" className="flex">
            <FaPhoneAlt className="mt-[4px]" /> : +91 9911925131
          </a>
        </div>

        {/* Social Links */}
        <div>
          <h2 className="text-xl font-bold mb-4">Social Links</h2>
          <div className="flex space-x-4">
            <a
              href="#home"
              className="text-blue-400 hover:text-blue-500"
              rel="noreferrer noopener"
            >
              <FaFacebook />
            </a>
            <a
              href="#home"
              className="text-blue-400 hover:text-blue-500"
              rel="noreferrer noopener"
            >
              <BsTwitterX />
            </a>
            <a
              href="https://www.instagram.com/kaifkhan1r/?hl=am-et"
              className="text-blue-400 hover:text-blue-500"
              target="_blank"
              rel="noreferrer noopener"
            >
              <GrInstagram />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
