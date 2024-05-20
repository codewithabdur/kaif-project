import React, { useEffect, useState } from "react";
import "./Address.css";
import { Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import client from '../../lib/client'


const Address = () => {
  const [data, setData] = useState([]);
  const [address, setAddress] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [totalCharge, setTotalCharge] = useState(0);
  const [finalValue, setFinalValue] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [orderCnfirmed, setOrderCnfirmed] = useState(false);
  const [fieldsNotFullFill, setFieldsNotFullFill] = useState(false);
  const [orderNotCnfirmed, setOrderNotCnfirmed] = useState(false);
  const navigate = useNavigate();
  const [charge, setCharge] = useState(""); // Initialize charge with the default value

  useEffect(() => {
    client
      .fetch(
        `
      *[_type == 'cart']{
        charge,
      }
    `
      )
      .then((data) => {
        setCharge(data[0].charge); // Set charge with the received value
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = localStorage.getItem("cartData");
        const new_Data = JSON.parse(data);
        setData(new_Data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    calculateFinalPrice();
  }, [data]);

  const calculateFinalPrice = () => {
    let totalPrice = 0;
    data.forEach((item) => {
      totalPrice += item.price * item.quantity;
    });
    setTotalCharge(totalPrice);
    setFinalValue(totalPrice + deliverCharge);
  };

  const deliverCharge = charge

  const cnfrmOrder = async () => {
    if (!name || !mobileNumber || !pinCode || !address) {
      setFieldsNotFullFill(true);
      setTimeout(() => {
        setFieldsNotFullFill(false);
      }, 2000);
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("https://formspree.io/f/mkndrnda", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          mobileNumber,
          pinCode,
          address,
          items: data,
          totalCharge,
          deliverCharge,
          finalValue,
        }),
      });

      if (response.ok) {
        setOrderCnfirmed(true);
        setTimeout(() => {
          setOrderCnfirmed(false);
          localStorage.removeItem("cartData");
          navigate(`/`);
        }, 2000);
      } else {
        setOrderNotCnfirmed(true);
        setTimeout(() => {
          setOrderNotCnfirmed(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Error confirming order:", error);
      alert("Failed to confirm order. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {orderCnfirmed && (
        <Alert severity="success" className="alertItem">
          Order Confirmed
        </Alert>
      )}
      {orderNotCnfirmed && (
        <Alert severity="error" className="alertItem">
          Order Not Confirmed
        </Alert>
      )}
      {fieldsNotFullFill && (
        <Alert severity="error" className="alertItem">
          Please Fill all the Fileds
        </Alert>
      )}
        <FaHome className="z-20 absolute top-4 left-4 text-white text-[20px] cursor-pointer" onClick={() =>{navigate('/')}}/>
      <div className="container mx-auto px-4 py-8 text-white md:flex-row flex flex-col md:justify-between">
        <div className="flex flex-col w-full md:w-[20px]">
          <h2 className="text-2xl font-bold mb-4">Checkout Form</h2>
          <h1 className="text-red-600 font-black text-lg  animationupDown">
            After Confirming Order I will contact You Sooner. don't Worry if You
            Didn't get message!
          </h1>
        </div>
        <form className="mb-8 md:w-[50%] w-full">
          <div className="mb-4">
            <label className="block mb-2">Name:</label>
            <input
              type="text"
              className="border text-black border-gray-300 rounded-md p-2 w-full"
              value={name}
              placeholder="Please Enter Your Name"
              onChange={(e) => setName(e.target.value)}
              required={true}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Mobile Number:</label>
            <input
              type="text"
              className="border text-black border-gray-300 rounded-md p-2 w-full"
              value={mobileNumber}
              placeholder="Please Enter Your Valid Number"
              onChange={(e) => setMobileNumber(e.target.value)}
              required={true}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Pin Code:</label>
            <input
              type="text"
              placeholder="Please Enter Your PinCode"
              className="border text-black border-gray-300 rounded-md p-2 w-full"
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value)}
              required={true}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Address:</label>
            <textarea
              type="text"
              placeholder="Please Enter Your Valid Address Because Order is Delivered on this Address"
              className="border border-gray-300 text-black rounded-md p-2 w-full"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required={true}
            />
          </div>
        </form>
        <div className="md:flex md:flex-col">
          <h2 className="text-2xl font-bold mb-4 ">Cart Items</h2>
          {data.map((item, index) => (
            <div key={index} className="flex items-center mb-4 ">
              <div>
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-24 h-24 mr-4"
                />
              </div>
              <div>
                <p className="font-bold">{item.title}</p>
                <p>Price: {item.price}</p>
                <p>Quantity: {item.quantity}</p>
              </div>
            </div>
          ))}

          <h2 className="text-2xl font-bold mb-4">Final Price</h2>
          <p className="text-xl font-bold">Price = &#x20b9;{totalCharge}</p>
          <p className="text-xl font-bold">
            Delivery Charge = &#x20b9;{deliverCharge}
          </p>
          <p className="text-xl font-bold">
            Total Price = &#x20b9;{finalValue}
          </p>
        </div>
      </div>
      <div className="flex justify-end w-[80%] mx-auto">
        <h1 className="text-red-600 font-black text-lg mr-6 animationupDown">
          For Now Only Cash On Delivery Available and in Benipur Location for Now
        </h1>
        <button className="button" onClick={cnfrmOrder} disabled={submitting}>
          {submitting ? "Submitting..." : "Confirm Order"}
        </button>
      </div>
    </>
  );
};

export default Address;
