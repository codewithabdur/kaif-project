import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { updateDoc, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

const VerifyPhone = () => {
  const [phone, setPhone] = useState("");
  const [user, setUser] = useState(null);
  const [otp, setOtp] = useState("");
  const [verified, setVerified] = useState(false);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState(false);
  const [otpSend, setOtpSend] = useState(false);
  const [hideRecaptcha, setHideRecaptcha] = useState(true);
  const navigate = useNavigate();

  const sendOtp = async () => {
    try {
      setSending(true);
      const recaptcha = new RecaptchaVerifier(auth, "recaptcha", {});
      const confirmation = await signInWithPhoneNumber(auth, phone, recaptcha);
      setUser(confirmation);
      setOtpSend(true);
      setSending(false);
      setHideRecaptcha(false);
      setTimeout(() => {
        setOtpSend(false);
      }, 2000); // Store the confirmation object in the state
    } catch (err) {
      console.log(err);
      setSending(false);
    }
  };

  const verifyOtp = async () => {
    try {
      setVerifying(true);
      const data = await user.confirm(otp);
      const currentUser = auth.currentUser;

      if (currentUser) {
        // Check if the user document exists before attempting to update
        const userRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          // Update the phone number in Firestore
          await updateDoc(userRef, {
            phone: phone,
          });
        }
      }
      // console.log(data);
      setVerifying(false);
      setVerified(true);
      setTimeout(() => {
        setVerified(false);
      }, 2000);
      setTimeout(() => {
        navigate(`/`);
      }, 3000);
    } catch (err) {
      console.log(err);
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 3000);
      setVerifying(false);
    }
  };

  return (
    <>
      {/*<NavBar /> */}
      <>
        {" "}
        <Alert severity="success" className=" mb-20">
          If Number is Verified But still Not Showing Verified. Then Please Log
          Out and Login Again!
        </Alert>
      </>
      <div className="phoneSignin">
        {/* <Snackbar open="true" autoHideDuration={6000} message="Number Verified" /> */}

        <div className="phoneContent">
          {verified && (
            <Alert severity="success" className=" mb-20">
              Mobile Number Verified!
            </Alert>
          )}
          {otpSend && (
            <Alert severity="success" className=" mb-20">
              Otp Send!
            </Alert>
          )}
          {error && (
            <Alert severity="error" className=" mb-20">
              Some Error Ocured
            </Alert>
          )}
          <PhoneInput
            className="inputphone w-full sm:w-auto "
            country={"in"}
            value={phone}
            onChange={(phone) => setPhone("+" + phone)}
          />
          {/* <div>
          <Button onClick={capctha} variant="contained" sx={{ mt: [3, 4] }}>
            capctha
          </Button></div> */}
          {/* <p className="mt-2 text-white">Please verify Only Once</p> */}
          <Button
            onClick={sendOtp}
            variant="contained"
            disabled={sending}
            sx={{
              mt: [3, 4],
              backgroundColor: sending ? "#103861" : undefined,
            }}
          >
            {sending ? "Sending.." : "Sent otp"}
          </Button>
          {hideRecaptcha && (
            <div id="recaptcha" style={{ marginTop: "10px" }}></div>
          )}
          <br />
          <span className="text-white"> Enter Your Otp </span>
          <br />
          <TextField
            // variant="outlined"
            size="small"
            label="Enter Your Otp"
            InputLabelProps={{
              style: { color: "#b53eff", fontFamily: "cursive" },
            }}
            inputProps={{ style: { color: "black" } }}
            onChange={(e) => setOtp(e.target.value)}
            className="mt-3 w-full sm:w-auto text-white bg-white  outline border-sm rounded"
            sx={{ mt: [3, 4], width: ["100%", "300px"] }}
          />
          <br />
          <Button
            onClick={verifyOtp}
            variant="contained"
            color="success"
            disabled={verifying}
            sx={{
              mt: [3, 4],
              backgroundColor: verifying ? "#2f5c32" : undefined,
            }}
          >
            {verifying ? "verifying..." : "Verify Otp"}
          </Button>
        </div>
      </div>
    </>
  );
};

export default VerifyPhone;
