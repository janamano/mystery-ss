// vendor imports
import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import { REMOTE } from "../endpoints";
import { Button, Container, Divider, Form, Header } from "semantic-ui-react";
 

export default function Login() {
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('')
    const navigate = useNavigate();
    var CryptoJS = require("crypto-js");

    const home = () => {
        navigate("/")
    }

    const encrypt = (data) => {
        var bytes  = CryptoJS.AES.encrypt(data, process.env.REACT_APP_SECRET);  // pass IV
        return bytes.toString();
    }
    const handleSubmit = useCallback(async (event) => {
        event.preventDefault()
        console.log('jana on handler start')
        await fetch(REMOTE + "/api/login?username=" + username + "&password=" + password, {
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
                        isHost: res.data.isHost,
                        groupName: res.data.groupName,
                        dollarLimit: res.data.dollarLimit,
                        groupHost: res.data.groupHost,
                    }
                })
            }
          })
          .catch(err => console.log('jana', err))

    }, [password, username]);

    return (
        // <div>
            <Container className="container1">
                <Header textAlign="center" as='h1'>Super Minimalistic Secret Santa App Login page</Header>
                <Divider/>
                <Form>
                    <Form.Input label="Enter Username" onChange={(event) => {
                            setUsername(event.target.value)
                        }}  value={username} />
                    <Form.Input label='Enter Password' type='password' onChange={(event) => {
                            setPassword(event.target.value)
                        }} value={password}/>
                    <Form.Group>
                        <Form.Button type="submit" onClick={handleSubmit}>Login</Form.Button>
                        <Button onClick={home}>Go back</Button>
                    </Form.Group>
                
                </Form>
                <p>{message}</p>
            </Container>
    );
}