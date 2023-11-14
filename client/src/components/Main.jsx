// vendor imports
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Divider, Header, Image, Message } from "semantic-ui-react";
import "../styles/styles.css";
// We import NavLink to utilize the react router.
// import { NavLink } from "react-router-dom";
 
// Here, we display our Navbar
export default function Main() {
    const navigate = useNavigate();

    const register = () => {
        navigate("/register")
    }
    const login = () => {
        navigate("/login")
    }
    return (
        <Container className="container1">
            <Header textAlign="center" as='h1'>Super Minimalistic Secret Santa App</Header>
            <Divider/>
            <Container className="banner">
                {/* <Header color='white' as='h2' textAlign="center">SECRET SANTA</Header> */}
            </Container>
            <Message>
            <Message.Header>'Tis the Season of Giving... and Receiving!</Message.Header>
                <p> 
                    Welcome to the Mystery Secret Santa App! Register or Login to get started!
                </p>
            </Message>
            <Button onClick={register}>Register</Button>
            <Button onClick={login}>Login</Button>
        </Container>
    );
}