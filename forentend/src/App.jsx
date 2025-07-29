import React from 'react';
import Nav from './Nav';
import OtpForm from './other/OtpForm';
import Priversy from './other/Privery';
import  Login  from './page/customer/login';
import Signup from './page/customer/signup';
import CustomerProfile from './other/Profile';
import SignupVendor from './page/vendor/signup';
import VendorOtpForm from './other/Otppage';
import  VendorOTP from './other/Otppage';
import VendorLogin from './page/vendor/Login';
import { Route,BrowserRouter,Routes } from 'react-router-dom';

function App() {
  

  return (
    <>
      <BrowserRouter>
        
        <Routes>
        <Route element={<Priversy />}>
          
           
          
          <Route path="/products" element={<div>Products Page</div>} />
          <Route path="/about" element={<div>About Page</div>} />
          <Route path="/contact" element={<div>Contact Page</div>} />
          <Route path="/profile" element={<CustomerProfile />} />
          </Route>
          <Route path="/" element={<Nav/>} />
          <Route path="/verify-otp" element={<OtpForm />} />
          <Route path="/signupcustomer" element={<Signup />} />
          <Route path="/logincustomer" element={<Login />} />
          <Route path="/signupvendor" element={<SignupVendor />} />
         <Route path='/sendvendorotp' element={<VendorOTP />} />
          <Route path="/veprofile" element={<CustomerProfile />} />
          <Route path="/vendorotp" element={<VendorOtpForm />} />
          <Route path="/loginvendor" element={<VendorLogin/>} />
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
