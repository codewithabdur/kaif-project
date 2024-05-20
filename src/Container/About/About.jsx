import React, { useEffect, useState } from "react";
import { about } from "../../images"; // Replace with your image path
import "./About.scss";
import client from "../../lib/client";
import { PropagateLoader } from "react-spinners";

const About = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    client
      .fetch(`
      *[_type == 'about']{
        title,
        description,
        image{
          asset->{
            url,
          },
        },
      }`)
      .then((data) => {
        setPosts(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  
  if (posts.length === 0) {
    return (
      <div className="Loading">
        <PropagateLoader color="#048fa1" size={20} />
      </div>
    );
  }
  return (
    <>
      <h1 className="text-white text-center font-semibold my-4 text-3xl">About Me</h1>
      <div className=" bg-[#162c32] px-6" id="about">
        <div className="max-w-4xl mx-auto bg-white  md:p-8 shadow-md rounded-md">
          <div className="flex flex-col md:flex-row items-center justify-center">
            <img
              src={posts[0]?.image?.asset?.url}
              alt="About Us"
              className="w-full md:w-1/2 rounded-t-md md:rounded-md mb-4 md:mb-0 aboutDrop object-cover"
            />
            <div className="md:ml-0 md:mt-0 md:w-1/2 md:pl-4">
              <h1 className="text-3xl font-semibold mb-4 text-center">
                {posts[0]?.title}
              </h1>
              <p className="text-gray-700 md:mx-0 mx-4 mb-4">{posts[0]?.description}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
