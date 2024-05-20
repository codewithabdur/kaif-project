import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import client from "../../lib/client";
import { PropagateLoader } from "react-spinners";



const AllService = () => {
    const [posts, setPosts] = useState([]);
    useEffect(() => {
      client
        .fetch(
          `*[_type == 'repair']{
        title,
        slug,
        desc,
        image{
          asset->{
            url,
          },
        },
      }`
        )
        .then((data) => {
          setPosts(data);
        })
        .catch((err) => {
          console.log(err);
        });
    }, []);


  useEffect(()=>{
    document.title = "Reading Kaif Khan | All Service!";
  })

  if (posts.length === 0) {
    return (
      <div className="Loading">
        <PropagateLoader color="#048fa1" size={20} />
      </div>
    );
  }
  return (
    <>
      <div className=" w-[80%] mx-auto">
        <div className="container mx-auto py-12">
          <h1 className="text-4xl text-white text-center font-bold mb-8">
            Our Services
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                to={`/servicedetail/${post.slug.current}`}
                key={post.slug.current}
              >
                <div className="bg-white hover:bg-[#0ba79c] transition-all duration-700  rounded-lg shadow-md">
                  <img
                    src={post?.image?.asset?.url}
                    className="w-full  object-cover mb-4 rounded-t-md"
                  />
                  <h2 className="px-6 text-xl font-semibold mb-2">{post?.title}</h2>
                  <p className="px-6 pb-6 text-gray-600">{`${post?.desc.substring(
                    0,
                    200
                  )}....`}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Link to={`/`}>
        {" "}
        <div className="flex justify-end w-[80%]">
          <button className="text-white button p-4 mb-4 bg-blue-400 rounded-lg">
            Go to Home
          </button>
        </div>
      </Link>
    </>
  );
};

export default AllService;
