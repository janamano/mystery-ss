// vendor imports
import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
 
// We import NavLink to utilize the react router.
// import { NavLink } from "react-router-dom";
 
// Here, we display our Navbar
export default function Main() {
    const navigate = useNavigate();

    const register = () => {
        console.log('jana create')
        navigate("/register")
    }
    const login = () => {
        navigate("/login")
    }
    return (
        <div>
            Super Minimalistic Secret Santa App
            <button onClick={register}>Register</button>
            <button onClick={login}>Login</button>
        </div>
    );
}