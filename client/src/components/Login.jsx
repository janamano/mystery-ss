// vendor imports
import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import { Button, Container, Divider, Form, Header } from "semantic-ui-react";
import { useMutation } from '@apollo/client'
import { LOGIN } from "./mutations/mutations";

export default function Login() {
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('')
    const navigate = useNavigate();
    const [loginUser, {data, loading, error}] = useMutation(LOGIN);

    const home = () => {
        navigate("/")
    }

    const redirectToHomePage = useCallback(() => {
        console.log('jana in login redirecting')
        navigate('/home')
    }, [navigate]);

    useEffect(() => {
        if (error != null) {
            setMessage(error.message)
        }
    }, [error]);

    const handleSubmit = useCallback(async (event) => {
        event.preventDefault()
        console.log('jana on handler start')
        if (message.length > 0) {
            setMessage('')
        }

        loginUser({
            variables: {
                username: username,
                password: password
            },
            onCompleted: redirectToHomePage,
            // refetchQueries: [
            //     GET_CURRENT_USER
            // ]
        });
    }, [loginUser, message, password, redirectToHomePage, username]);

    return (
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
            <div className="errorMessages">{message}</div>
        </Container>
    );
}