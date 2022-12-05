// vendor imports
import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
 

export default function Login() {
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('')
    const navigate = useNavigate();

    const home = () => {
        navigate("/")
    }

    const handleSubmit = useCallback(async (event) => {
        event.preventDefault()
        console.log('jana on handler start')
        await fetch("https://mystery-santa-api.onrender.com/api/login?username=" + username + "&password=" + password, {
            method: "GET",
            headers: {
                "Access-Control-Allow-Origin": "*"
            }
          })
          .then(res => res.json())
          .then(res => {
            console.log('jana on handler', res)

            if (res.status == 'error') {
                setMessage(res.message)
            } else {
                navigate('/home', {
                    state: {
                        email: res.data.email,
                        username: res.data.username,
                        password: res.data.password,
                        group: res.data.group,
                        isHost: res.data.isHost
                    }
                })
            }
          })
          .catch(err => console.log('jana', err))

    }, [password, username]);

    return (
        <div>
            Super Minimalistic Secret Santa App Login page
            <button onClick={home}>Go back</button>
            <form>
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
                <button type="submit" onClick={handleSubmit}>Login</button>
            </form>
            <p>{message}</p>
        </div>
    );
}