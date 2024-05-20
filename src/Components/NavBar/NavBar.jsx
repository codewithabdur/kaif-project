import React, { useEffect, useState } from "react";
import "./NavBar.scss";
import { logo } from "../../images";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import { about } from "../../images";
import { auth, db, storage } from "../../lib/firebase"; // Removed unnecessary storage import
import { collection, query, where, getDocs } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import client from "../../lib/client";
import { FaShoppingCart } from "react-icons/fa";

const NavBar = () => {
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const [userData, setUserData] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [ulClassName, setUlClassName] = useState("inactiveUl");
  const [ulListClassName, setUlListClassName] = useState("inactiveUlLis");
  const [post, setPost] = useState([]);
  const isLoggin = localStorage.getItem("user") != null;

  useEffect(() => {
    client
      .fetch(
        `
      *[_type == 'navbar']{
        title,
        logo{
          asset->{
            url,
          },
        },
      }
      `
      )
      .then((data) => {
        setPost(data[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

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

  function toogleUl() {
    setUlClassName((prevClassName) =>
      prevClassName === "activeUl" ? "inactiveUl" : "activeUl"
    );
    setUlListClassName((prevClassName) =>
      prevClassName === "activeUlList" ? "inactiveUlLis" : "activeUlList"
    );
  }

  const toogleMenu = () => {
    toogleUl();
    setTimeout(() => {
      setIsMenuOpen(!isMenuOpen);
    }, 400);
  };
  return (
    <>
      <div className="flex w-[80%] mx-auto items-center navContainer fixed left-[10%] z-20">
        <div className="leftNav absolute left-0 top-0 ">
          <Link to="/">
            <img src={post?.logo?.asset?.url} alt="logo" className="h-[6rem]" />
          </Link>
        </div>

        <div
          className="icon text-white hover:text-[#20f1d5] z-20"
          onClick={toogleMenu}
        >
          {isMenuOpen ? (
            <FaTimes className="transition-all ease-in-out duration-1000 " />
          ) : (
            <GiHamburgerMenu className="transition-all ease-in-out duration-1000 " />
          )}
        </div>
        <div
          className={`rightNav  absolute flex  right-0 top-4 ${ulClassName} transition-all ease-in-out duration-[.4s] z-10`}
        >
          <ul
            className={`flex font-serif text-white text-xl items-center ${ulListClassName} font-bold ul z-10`}
          >
            <a
              href="#home"
              className="mx-2 hover:text-[#0ba79c] text-white transition-all ease-in-out duration-800"
            >
              Home
            </a>
            <a
              href="#about"
              className="mx-2 hover:text-[#0ba79c] text-white transition-all ease-in-out duration-800"
            >
              About
            </a>
            <a
              href="#product"
              className="mx-2 hover:text-[#0ba79c] text-white transition-all ease-in-out duration-800"
            >
              Product
            </a>
            <a
              href="#services"
              className="mx-2 hover:text-[#0ba79c] text-white transition-all ease-in-out duration-800"
            >
              Services
            </a>

            <a
              href="#contact"
              className="hover:text-[#0ba79c] text-white transition-all ease-in-out duration-800"
            >
              Contact
            </a>

            {isLoggin ? (
              <Link
                to="/cart"
                className="hover:text-[#0ba79c] text-white transition-all ease-in-out duration-800"
              >
                <FaShoppingCart />
              </Link>
            ) : (
              <Link
                to="/login"
                className="hover:text-[#0ba79c] text-white transition-all ease-in-out duration-800"
              >
                <FaShoppingCart />
              </Link>
            )}
            {isLoggin ? (
              <Link
                to={`/profile/${user}`}
                className="rounded-[50%] profileIcon hover:rounded-[50%] ml-4"
              >
                {userData && userData.profileImage ? (
                  <img
                    src={userData.profileImage}
                    alt=""
                    className="h-14 w-14 rounded-[50%] object-cover"
                  />
                ) : (
                  // userData &&
                  // userData.username && (
                  // <div className="text-white bg-[#00ffc4]  block px-3 py-2 rounded-md   text-center font-black text-lg">
                  //   {userData.username.charAt(0)}
                  // </div>

                  <img
                    className="profileimg rounded-[50%] h-16 w-16"
                    src={`https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg?w=740&t=st=1705308650~exp=1705309250~hmac=cbe9486df80e8f098d3d134dc01c480cc26c91fade809543c1557bc2fcf8ed7e`}
                    alt="User Profile"
                  />
                  // )
                )}
              </Link>
            ) : (
              <Link
                to={`/login`}
                className="rounded-[50%] profileIcon hover:rounded-[50%] ml-4"
              >
                <a
                  href="#contact"
                  className="hover:text-[#0ba79c] text-white transition-all ease-in-out duration-800"
                >
                  Login
                </a>
                {/* <img
                  src="https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg?w=740&t=st=1705308650~exp=1705309250~hmac=cbe9486df80e8f098d3d134dc01c480cc26c91fade809543c1557bc2fcf8ed7e"
                  alt=""
                  className="h-14 w-14 rounded-[50%] object-cover"
                /> */}
              </Link>
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default NavBar;
