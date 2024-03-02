// vendor imports
import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Divider, Form, Header } from "semantic-ui-react";
import { CREATE_USER } from "./mutations/mutations";
import { useMutation } from "@apollo/client";

 export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('')
    const [createUser, {date, loading, error}] = useMutation(CREATE_USER)
    const navigate = useNavigate();

    const home = () => {
        navigate("/")
    }
    const redirectToHomePage = useCallback(() => {
        console.log('jana in register redirecting')
        navigate('/home')
    }, [navigate]);

    useEffect(() => {
        if (error != null) {
            setMessage(error.message)
        }
    }, [error]);

    const handleSubmit = useCallback((event) => {
        event.preventDefault();
        if (message.length > 0) {
            setMessage('')
        }
        createUser({
            variables: {
                email,
                username,
                password
            },
            onCompleted: redirectToHomePage
        })
    }, [createUser, email, message, password, redirectToHomePage, username])

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
            <div className="errorMessages">{message}</div>
        </Container>
    );
}