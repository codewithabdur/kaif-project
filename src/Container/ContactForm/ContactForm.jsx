// ContactForm.jsx
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { auth, db, storage } from "../../lib/firebase";
import { collection, query, where, getDocs, setDoc, doc, getDoc } from "firebase/firestore";
import { Alert } from "@mui/material";



const ContactForm = () => {
  const [dataStored, setDataStored] = useState(false)
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      message: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Required"),
      email: Yup.string().email("Invalid email address").required("Required"),
      message: Yup.string().required("Required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      try {
        const userDocRef = doc(db, `${values.name}-Contact`, values.name);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          // If document exists, update the submission count field and add the new submission to the array
          const { submissionCount, submissions } = userDocSnapshot.data();
          const updatedSubmissions = [...submissions, values];
          await setDoc(userDocRef, {
            ...values,
            submissionCount: submissionCount + 1,
            submissions: updatedSubmissions,
          });
        } else {
          // If document doesn't exist, create a new one with the initial submission
          await setDoc(userDocRef, {
            ...values,
            submissionCount: 1,
            submissions: [values],
          });
        }

        setDataStored(true);
        setTimeout(() => {
          setDataStored(false);
        }, 2000);
        setIsLoading(false);
        resetForm();
      } catch (error) {
        console.log(error);
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 2000);
        setIsLoading(false);
      }
    },
  });

  return (
    <>
      {" "}
      <div className="container">
        <form
          onSubmit={formik.handleSubmit}
          className="max-w-md md:mx-auto mx-[20px]"
          id="contact"
        >
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-300 font-medium">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              className="mt-1 p-2 w-full border rounded-md"
            />
            {formik.touched.name && formik.errors.name && (
              <div className="text-red-600">{formik.errors.name}</div>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-300 font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              className="mt-1 p-2 w-full border rounded-md"
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-600">{formik.errors.email}</div>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="message"
              className="block text-gray-300 font-medium"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.message}
              rows="4"
              className="mt-1 p-2 w-full border rounded-md"
            />
            {formik.touched.message && formik.errors.message && (
              <div className="text-red-600">{formik.errors.message}</div>
            )}
          </div>
          {dataStored && <Alert severity="success">Form Submitted</Alert>}
          {error && <Alert severity="error">Error Occured</Alert>}

          <button
            type="submit"
            className="bg-blue-500 button text-white px-4 py-2 mb-4 rounded-md hover:bg-blue-600"
            disabled={formik.isSubmitting}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </>
  );
};

export default ContactForm;
