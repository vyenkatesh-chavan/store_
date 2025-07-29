import React from "react";
import { Navigate ,Outlet } from "react-router-dom";
const Priversy = () => {    
    const auth=localStorage.getItem("token");
    return (
        <>
            {auth ? <Outlet /> : <Navigate to="/signupcustomer" />}
        </>
    );
}
export default Priversy;