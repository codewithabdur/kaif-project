import React, { useEffect, useState } from "react";
import client from "../../lib/client";
import { useNavigate, useParams } from "react-router-dom";
import '../button.css'
import { PropagateLoader } from "react-spinners";

const Servicedetail = () => {
  const [post, setPost] = useState([]);
  const { slug } = useParams();
  const navigate = useNavigate()
  useEffect(() => {
    client
      .fetch(
        `*[slug.current == '${slug}']{
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
        if (data && data.length > 0) {
          setPost(data[0]);
        } else {
          setPost(null);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [slug]);

   useEffect(()=>{
    document.title = `Reading Kaif Khan | ${slug}`
   })

  const allService = () => {
    navigate(`/allservice`);
  };

  if (post.length === 0) {
    return (
      <div className="Loading">
        <PropagateLoader color="#048fa1" size={20} />
      </div>
    );
  }
  return (
    <>
      <div className="container mx-auto">
        <div className="imageSection h-[25rem] w-[80%] mx-auto  flex mt-16 shadow-lg shadow-gray-600  justify-center">
          <img
            src={post.image?.asset?.url}
            alt={post.title}
            className="w-full object-cover rounded-lg"
          />
        </div>
        <div className="descriptio  w-[80%] mx-auto">
          <h1 className="text-white mt-8 text-[20px] font-serif">
            {post.title}
          </h1>
          <p className="text-[#dedbdb] mt-8 text-[15px] font-serif">
            {post.desc}
          </p>
          <div className="flex justify-end w-full ">
            <button onClick={allService} className="button bg-blue-700">All Service</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Servicedetail;
