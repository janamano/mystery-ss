// vendor imports
import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { REMOTE } from "../endpoints";
import { Button, Container, Divider, Form, Header } from "semantic-ui-react";
 
// We import NavLink to utilize the react router.
// import { NavLink } from "react-router-dom";
 
// Here, we display our Navbar
export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('')
    const navigate = useNavigate();
    var CryptoJS = require("crypto-js");

    const encrypt = (data) => {
        var bytes  = CryptoJS.AES.encrypt(data, process.env.REACT_APP_SECRET);  // pass IV
        return bytes.toString();
    }
    const home = () => {
        navigate("/")
    }

    const handleSubmit = useCallback(async (event) => {
        event.preventDefault()
        await fetch(REMOTE + "/api/signup", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                username: username,
                password: encrypt(password)
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
        <Container className="container1">
            <Header textAlign="center" as='h1'>Super Minimalistic Secret Santa App Register page</Header>
            <Divider/>
            <Form>
                <Form.Group  widths='equal'>
                    <Form.Input label="Enter Email" onChange={(event) => {
                        setEmail(event.target.value)
                    }}  value={email} />
                    <Form.Input label="Enter Username" onChange={(event) => {
                        setUsername(event.target.value)
                    }}  value={username} />
                </Form.Group>
                <Form.Input label='Enter Password' type='password' onChange={(event) => {
                    setPassword(event.target.value)
                }} value={password}/>
                <Form.Group>
                    <Button type="submit" onClick={handleSubmit}>Submit</Button>
                    <Button onClick={home}>Go back</Button>

                </Form.Group>
            </Form>
            <p>{message}</p>
        </Container>
    );
}