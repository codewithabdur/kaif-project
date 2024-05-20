import React, { useEffect, useState } from "react";
import client from "../../lib/client";
import { Link, useNavigate, useParams } from "react-router-dom";
import { GoPlus } from "react-icons/go";
import { HiMinus } from "react-icons/hi";
import { NavBar } from "../../Components";
import { Alert } from "@mui/material";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db, storage } from "../../lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { PropagateLoader } from "react-spinners";
import { FaHome } from "react-icons/fa";

const ProductDetails = () => {
const isLoggedIn = JSON.parse(localStorage.getItem("user")) !== null;
  const [posts, setPosts] = useState([]);
  const [hoveredImgs, setHoveredImgs] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [cartAdded, setCartAdded] = useState(false);
  const [cartError, setCartError] = useState(false);
  const [cart, setCart] = useState([]);
  const [uid , setUid] = useState("")
  const [username, setUsername] = useState("User")
 const { slug } = useParams();
  const [userData, setUserData] = useState({
    name: "",
    message: "",
    star: "",
    imageUrl: "",
    userName: "",
    PhoneNumber: "",
  });

  const navigate = useNavigate();

useEffect(() => {
  const fetchProductData = async () => {
    try {
      const data = await client.fetch(
        `*[slug.current == "${slug}"]{
          title,
          slug,
          description,
          price,
          detail,
          image{
            asset->{
              url,
            },
          },
          extraImg[]{
            asset->{
              url,
            },
          },
        }`
      );

      if (data && data.length > 0) {
        setPosts(data[0]); // Directly set the first item since only one item will be fetched
        // console.log(data);
        setHoveredImgs(Array(data[0]?.extraImg?.length).fill(null));
        setPrice(parseInt(data[0]?.price));
      } else {
        setPosts(null);
        setHoveredImgs([]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  fetchProductData();
}, [slug]);



  useEffect(() => {
    document.title = `Kaif Khan | ${slug}`;
  }, [slug]);

  const handleImgHover = (imgUrl, index) => {
    const newHoveredImgs = [...hoveredImgs];
    newHoveredImgs[index] = imgUrl;
    setHoveredImgs(newHoveredImgs);
  };

  const handleIncreaseQuantity = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    const newPrice = price * 2;
    setPrice(newPrice);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      const newPrice = price / 2;
      setPrice(newPrice);
    }
  };
const fetchUserData = async () => {
  const currentUser = auth.currentUser;
  if (currentUser) {
    try {
      // Fetch the user document from Firestore based on the 'email' field in db
      const usersCollectionRef = collection(db, "users");
      const userQuery = query(
        usersCollectionRef,
        where("email", "==", currentUser.email)
      );
        setUid(userQuery.uid);
      const userQuerySnapshot = await getDocs(userQuery);

      if (!userQuerySnapshot.empty) {
        const newuserData = userQuerySnapshot.docs[0].data();

        setUserData(newuserData);
        // console.log("useData:  ",userData);
        setUsername(newuserData.username);
        // console.log(username);
        // Fetch the user's profile image from Storage in db
        if (userData.img) {
          const imageRef = ref(storage, userData.img);
          const imageUrl = await getDownloadURL(imageRef);
        }

        // Now fetch additional data from db1 without any filter
        const feedbackCollectionRef = collection(db, "feedback");
        const feedbackQuerySnapshot = await getDocs(feedbackCollectionRef);

        if (!feedbackQuerySnapshot.empty) {
          // Convert all documents into an array of data
          const userDataArray = feedbackQuerySnapshot.docs.map((doc) =>
            doc.data()
          );

          // Merge user-specific data and additional
        }
      } else {
        console.error();
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle error appropriately
    }
  }
};
  useEffect(() => {
    

    // Call the function immediately
    fetchUserData();
  }, [auth.currentUser]);

 
    const title = posts.title
    const details = posts.detail
    const desc = posts.description
    const newprice = price
    const newquantity = quantity;
    const newimg = posts?.image?.asset?.url
  
const addToCart = async (e) => {
  e.preventDefault();

  try {
    const userCollectionName = `${username}-Product`; // Assuming 'username1' is the collection name format
    const userCartRef = doc(db, userCollectionName, slug);

    const userCartDoc = await getDoc(userCartRef);

    if (userCartDoc.exists()) {
      // If the document already exists, update the quantity and price
      const existingCartData = userCartDoc.data();
      const updatedQuantity = existingCartData.quantity + quantity;
      const updatedPrice = existingCartData.price + price * quantity;

      await setDoc(
        userCartRef,
        { quantity: updatedQuantity, price: updatedPrice },
        { merge: true }
      );
    } else {
      // If the document doesn't exist, create a new one
      await setDoc(userCartRef, {
        title,
        details,
        desc,
        price,
        quantity,
        img: newimg,
      });
    }

    setCartAdded(true);
    setCartError(false);
  } catch (error) {
    console.error("Error adding to cart:", error);
    setCartError(true);
    setCartAdded(false);
  }
};







  const cartPage = () => {
    navigate(`/cart`);
  };


  if (posts.length === 0) {
    return (
      <div className="Loading">
        <PropagateLoader color="#048fa1" size={20} />
      </div>
    );
  }

  return (
    <div>
      {cartAdded && (
        <Alert severity="success" className="alertItem">
          Cart Added
        </Alert>
      )}
      {cartError && (
        <Alert severity="error" className="alertItem">
          Error Occured
        </Alert>
      )}
      <FaHome
        className="z-20 absolute top-4 left-4 text-white text-[20px] cursor-pointer"
        onClick={() => {
          navigate("/");
        }}
      />
      <div className="container mx-auto pt-[7rem]">
        <div className="flex md:flex-row flex-col justify-evenly">
          <div className="h-[30rem] w-[35rem] p-6 rounded-lg">
            <div className="image">
              <img
                src={
                  hoveredImgs.some((img) => img !== null)
                    ? hoveredImgs.find((img) => img !== null)
                    : posts?.image?.asset?.url
                }
                className="h-[30rem] w-[35rem] bg-[#31cec1] object-cover rounded-md "
              />
            </div>

            <div className=" flex justify-evenly mt-6">
              {posts?.extraImg?.map((img, index) => (
                <img
                  src={img.asset.url}
                  key={index}
                  alt={`Extra Image ${index + 1}`}
                  className="w-[50px] h-[50px]  object-cover rounded-md hover:bg-[#31cec1] transition-all duration-700  border"
                  onMouseEnter={() => handleImgHover(img.asset.url, index)}
                  onMouseLeave={() => handleImgHover(null, index)}
                />
              ))}
            </div>
          </div>
          <div className="deatils md:mt-6 mt-[9rem] md:mx-0 mx-auto">
            <h2 className=" text-xl text-white  font-black">{posts?.title}</h2>
            <h1 className="mt-6 text-white font-black"> Details:</h1>
            <p className=" text-[#dcd5d5] mb-6 font-serif font-bold">{`${posts?.detail?.substring(
              0,
              window.innerWidth < 768 ? 100 : 200
            )}....`}</p>
            <h2 className=" text-xl my-14 text-[#31cec1]  font-bold">
              &#x20b9; {price}
            </h2>
            <div className="flex  my-14 justify-between">
              <h2 className=" text-xl text-[#31cec1]  font-bold">
                Quantity: &ensp;
              </h2>
              <div className=" flex ">
                <button
                  onClick={handleIncreaseQuantity}
                  className="cursor-pointer border bg-[#31cec1]"
                >
                  <GoPlus className="text-4xl  text-[#fff]  font-bold" />
                </button>{" "}
                <span className="text-2xl border px-6 text-[#31cec1] font-bold">
                  {quantity}
                </span>
                <button
                  onClick={handleDecreaseQuantity}
                  className="cursor-pointer  border bg-[#31cec1]"
                >
                  <HiMinus className="text-4xl text-[#fff]  font-bold" />
                </button>
              </div>
            </div>
            <div className="buttuns flex justify-between">
              {isLoggedIn ? (
                <button className="button" onClick={addToCart}>
                  {cartAdded ? "Added" : "Add to Cart"}
                </button>
              ) : (
                <button className="button" onClick={() =>{navigate(`/login`)}}>
                  Add t Cart
                </button>
              )}
              <button className="button" onClick={cartPage}>
                Go To Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
