import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import client from "../../lib/client";
import { PropagateLoader } from "react-spinners";

const Product = () => {
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
        setPosts(data.slice(0, 3));
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
          <Link to={`/productdetails/${posts[0]?.slug?.current}`}>
            <div className="border hover:bg-[#0ba79c] mb-6 relative transition-all duration-700  rounded-lg shadow-md">
              <img
                src={posts[0]?.image?.asset?.url}
                className="md:aspect-[21/5] object-cover  rounded-t-md "
              />
              <div className="text absolute bottom-0 md:bottom-6 left-6 ">
                <h2 className=" text-xl text-white  font-black">
                  {posts[0]?.title}
                </h2>
                <h2 className=" text-xl text-white  font-bold">
                  &#x20b9; {posts[0]?.price}
                </h2>
                <p className=" text-[#dcd5d5] font-serif font-bold">{`${posts[0]?.description.substring(
                  0,
                  window.innerWidth < 768 ? 100 : 200
                )}....`}</p>

                <Link to={`/${posts[0]?.slug?.current}`}>
                  <button className="text-white button p-4 mb-4 bg-blue-400 rounded-lg">
                    Read More
                  </button>
                </Link>
              </div>
            </div>
          </Link>
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
          <Link to={`/productlist`}>
            <button className="text-white button w-[200px] p-4 mb-4 bg-blue-400 rounded-lg">
              All Product
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Product;
