import React, { useEffect, useState } from "react";
import { NavBar } from "../../Components";
import { Link } from "react-router-dom";
import About from "../About/About"
import {ServicePage , Product} from '../../Container'
import ContactForm from "../ContactForm/ContactForm";
import Footer from "../Footer/Footer"
import "./HomePage.scss"
import client from "../../lib/client";
import { Toaster } from "react-hot-toast";

import Layout  from "../../context/Layout";
import "../../styles/globals.css";
import { StateContext } from "../../context/StateContext";

const HomePage = ({ Component, pageProps }) => {
  const [post, setPost] = useState([]);
  const [details, setDetails] = useState([]);
const userString = localStorage.getItem("user");
const user = userString ? JSON.parse(userString) : null;
const isLoggedIn = JSON.parse(localStorage.getItem("user")) !== null;
  useEffect(() => {
    client
      .fetch(
        `*[_type == 'background']{
        title,
        backgroundimg{
          asset->{
            url,
          },
        },
      }
    `
      )
      .then((data) => {
        setPost(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  useEffect(() => {
    client
      .fetch(
        `*[_type == 'homepage']{
        title,
        salutation,
        desc,
      }
    `
      )
      .then((data) => {
        setDetails(data[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const backgroundImageStyle = {
    backgroundImage: `url(${post[0]?.backgroundimg?.asset?.url})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100vh",
    width: "100%",
  };

  useEffect(() => {
    document.title = "Kaif Khan";
  });

  return (
    <>
      <NavBar />
      {/* ------------------------------HomePage--------------------------- */}
      <>
        <div className=" relative" id="home" style={backgroundImageStyle}>
          {/* <span className="hover:bg-black hover:opacity-[0.8] transition-all duration-[1s] h-screen w-[745px]  absolute right-0 top-0"></span> */}
          <div className="w-[80%] mx-auto flex items-center justify-center h-screen homeContainer ">
            <div className="greetings w-[80vw] text-white fle-colx ">
              <h2 className="text-[36px] font-[700] dropblakish flex flex-col">
                <span className="text-[#0ba79c] text-[40px] ">
                  {details.salutation}
                </span>{" "}
                {details.title}
              </h2>
              <p className=" text-[24px] dropblakish ">{details.desc}</p>
              <div className="buttons text-white mt-4 ">
                {/* <Link className="mx-2 homeLink bg-[#0ba79c] hover:bg-[#5befe5] p-[8px] rounded-[8px] text-[18px] font-[700] transition-all ease-in-out duration-700">
                  More
                </Link> */}
                {isLoggedIn ? (
                  <Link
                    to={`/profile/${user}`}
                    className="mx-2 homeLink bg-[#0ba79c] hover:bg-[#5befe5] p-[8px] rounded-[8px] text-[18px] font-[700] transition-all ease-in-out duration-700"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    to={`/login`}
                    className="mx-2 homeLink bg-[#0ba79c] hover:bg-[#5befe5] p-[8px] rounded-[8px] text-[18px] font-[700] transition-all ease-in-out duration-700"
                  >
                    Get Started
                  </Link>
                )}
              </div>
            </div>

            {/* <div className="profileImg  border-b-2 border-white rounded-3xl">
              <img src={profile} alt="" className="homeImg drop" />
            </div> */}
          </div>
        </div>
      </>
      {/* ---------------------------------------------------------------About----------------------------------------------- */}
      <About />
      <Product />
      <ServicePage />
      <ContactForm />
      <Footer />
    </>
  );
};

export default HomePage;
