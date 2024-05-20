import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { HomePage, AllService, Servicedetail, ProductDetails, Cart , Address, ProductList} from "./Container";
import { Login, Profile, Register } from './Components'
import Phone from "./Components/Phone/Phone";


const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/profile/:user" element={<Profile />}></Route>
          <Route
            path="/servicedetail/:slug"
            element={<Servicedetail />}
          ></Route>
          <Route path="/productlist" element={<ProductList />}></Route>
          <Route path="/cart" element={<Cart />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/phoneAuth" element={<Phone />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/address" element={<Address />}></Route>
          <Route path="/allservice" element={<AllService />}></Route>
          <Route
            path="/productdetails/:slug"
            element={<ProductDetails />}
          ></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App