// vendor imports
import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
 
// We import NavLink to utilize the react router.
// import { NavLink } from "react-router-dom";
 
// Here, we display our Navbar
export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('')
    const navigate = useNavigate();

    const home = () => {
        navigate("/")
    }

    const handleSubmit = useCallback(async (event) => {
        event.preventDefault()
        await fetch("/api/signup", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                username: username,
                password: password
            }),
          })
          .then(res => res.json())
          .then(res => {
            if (res.status == 'error') {
                setMessage(res.msg)
            } else {
                navigate('/login')
            }
          })
          .catch(err => console.log(err))

    }, [email, password, username]);

    return (
        <div>
            Super Minimalistic Secret Santa App Register page
            <button onClick={home}>Go back</button>
            <form>
                <div class="form-group">
                    <label >Email address</label>
                    <input onChange={(event) => {
                        setEmail(event.target.value)
                    }} type="email"   value={email} />
                </div>
                <div class="form-group">
                    <label>Username</label>
                    <input onChange={(event) => {
                        setUsername(event.target.value)
                    }}  value={username} />
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input onChange={(event) => {
                        setPassword(event.target.value)
                    }} type="password" value={password} />
                </div>
                <button type="submit" onClick={handleSubmit}>Submit</button>
            </form>
            <p>{message}</p>
        </div>
    );
}