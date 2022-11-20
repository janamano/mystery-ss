// vendor imports
import React from "react";
import { Route, Routes } from "react-router-dom";
 
// imports 
import Main from "./components/Main";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";

const App = () => {
 return (
   <div>
     <Routes>
       <Route exact path="/" element={<Main />} />
       <Route path="/register" element={<Register />} />
       <Route path="/login" element={<Login />} />
       <Route path="/home" element={<Home />} />

       {/* <Route path="/joinGroup" element={<JoinGroup />} /> */}
       

     </Routes>
   </div>
 );
};
 
export default App;