import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { auth, db, storage } from "../../lib/firebase";
import { ref, getDownloadURL } from "firebase/storage";
import { HiMinus } from "react-icons/hi";
import { Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { PropagateLoader } from "react-spinners";

const Cart = () => {
  const [userData, setUserData] = useState(null);
  const [cartData, setCartData] = useState([]);
  const [itemRemoved, setItemRemoved] = useState(false);
  const [itemNotRemoved, setItemNotRemoved] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        try {
          const usersCollectionRef = collection(db, "users");
          const userQuerySnapshot = await getDocs(usersCollectionRef);

          if (!userQuerySnapshot.empty) {
            const newUserData = userQuerySnapshot.docs
              .find((doc) => doc.data().email === currentUser.email)
              .data();
            setUserData(newUserData);

            if (newUserData.img) {
              const imageRef = ref(storage, newUserData.img);
              const imageUrl = await getDownloadURL(imageRef);
              // Handle imageUrl if needed
            }

            // Fetch cart data from Firestore
            const cartCollectionRef = collection(
              db,
              `${newUserData.username}-Product`
            ); // Assuming 'username1' is the collection name format
            const cartQuerySnapshot = await getDocs(cartCollectionRef);
            const cartItems = cartQuerySnapshot.docs.map((doc) => doc.data());
            setCartData(cartItems);
          } else {
            console.error("User data not found");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          // Handle error appropriately
        }
      }
    };

    fetchUserData();

    // Cleanup function (if needed)
    return () => {
      // Cleanup logic (if needed)
    };
  }, []);

  const removeItem = async (index) => {
    try {
      // Get the document reference of the item to be removed
      const itemToRemove = cartData[index];
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userCollectionRef = collection(db, "users");
        const userQuerySnapshot = await getDocs(userCollectionRef);
        const userData = userQuerySnapshot.docs
          .find((doc) => doc.data().email === currentUser.email)
          .data();
        const cartCollectionRef = collection(db, `${userData.username}1`);
        const cartQuerySnapshot = await getDocs(cartCollectionRef);
        const cartItemDocId = cartQuerySnapshot.docs[index].id;

        // Delete the item from Firestore
        await deleteDoc(doc(cartCollectionRef, cartItemDocId));
        setItemRemoved(true);
      }
    } catch (error) {
      console.error("Error removing item:", error);
      setItemNotRemoved(true);
    }
  };

  const checkOut = () =>{
    localStorage.setItem('cartData', JSON.stringify(cartData))
    navigate(`/address`)
  }

  return (
    <>
      {itemRemoved && (
        <Alert severity="success" className="alertItem">
          Item Removed
        </Alert>
      )}
      {itemNotRemoved && (
        <Alert severity="error" className="alertItem">
          Item Not Removed
        </Alert>
      )}
      <div className="container mx-auto text-white px-6">
        <h1 className="text-3xl font-bold mb-4 ">Your Cart</h1>
        {cartData.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 pb-14 ">
            {cartData.map((item, index) => (
              <div key={index} className="border rounded-t-lg relative">
                <HiMinus
                  onClick={() => removeItem(index)}
                  className="absolute right-4 cursor-pointer top-3 text-3xl bg-[#fff] rounded-lg text-[#ff2b6e]"
                />

                {item.img && (
                  <img
                    src={item.img}
                    alt={item.title}
                    className="aspect-[30/9] rounded-t-lg object-cover"
                  />
                )}
                <p className="font-bold px-4 pt-4">{item.title}</p>
                {item.desc && <p className="px-4">{item.desc}</p>}
                {item.price && (
                  <p className="text-[#e7e1e1] px-4">&#x20b9;{item.price}</p>
                )}
                {item.quantity && (
                  <p className="text-[#e7e1e1] px-4 pb-4">{item.quantity}</p>
                )}
              </div>
            ))}
            <div className="buttons flex justify-between">
              <button onClick={() => navigate(`/`)} className="button">
                HomePage
              </button>
              <button className="button" onClick={checkOut}>
                Checkout
              </button>
            </div>
          </div>
        ) : (
          <div className="Loading">
            <PropagateLoader color="#36d7b7" size={20} />
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
