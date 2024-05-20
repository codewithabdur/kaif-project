import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import client from "../../lib/client";
import { PropagateLoader } from "react-spinners";

const ProductList = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    client
      .fetch(
        `*[_type == 'product']{
        title,
        slug,
        description,
        price,
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

  if (posts.length === 0) {
    return (
      <div className="Loading">
        <PropagateLoader color="#048fa1" size={20} />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen w-[80%] mx-auto" id="product">
        <div className="container mx-auto py-12">
          <h1 className="text-4xl text-white  font-bold mb-8">
            Product to Buy
          </h1>
          {posts && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link to={`/productdetails/${post.slug.current}`}>
                  <div className="border hover:bg-[#0ba79c] transition-all duration-700  rounded-lg shadow-md">
                    <img
                      src={post?.image?.asset?.url}
                      className="w-full object-cover mb-4 rounded-t-md "
                    />
                    <h2 className="px-6 text-xl text-white font-semibold mb-2">
                      {post?.title}
                    </h2>
                    <h2 className=" text-xl text-white mb-2 px-6 ">
                      &#x20b9; {post?.price}
                    </h2>
                    <p className="px-6 pb-6 text-[#dcd5d5]">{`${post?.description.substring(
                      0,
                      200
                    )}....`}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>{" "}
        <div className="flex justify-end w-[80%]">
          <Link to={`/allservice`}>
            <button className="text-white button w-[200px] p-4 mb-4 bg-blue-400 rounded-lg">
              All Service
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default ProductList;
