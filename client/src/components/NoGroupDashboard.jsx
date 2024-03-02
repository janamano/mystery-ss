// imports
import React, { useState, useCallback, useEffect } from"react";
import { Button, Divider, Form, Transition } from "semantic-ui-react";
import { useMutation } from '@apollo/client'
import { GET_CURRENT_USER, GET_CURRENT_USER_DETAILS } from "./queries/queries";

import { CREATE_GROUP, JOIN_GROUP, LOGOUT } from "./mutations/mutations";
import { useNavigate } from "react-router-dom";
export default function NoGroupDashboard(props) {

    // create group
    const [groupName, setGroupName] = useState('');
    const [dollarLimit, setDollarLimit] = useState(0);
    const [createFormVisible, setCreateFormVisible] = useState(false);
    const [userInputGroupId, setUserInputGroupId] = useState('');
    const [message, setMessage] = useState('');
    const [createGroup, {data: createData, loading: createLoading, error: createError}] = useMutation(CREATE_GROUP);
    const [joinGroup, {data: joinData, loading: joinLoading, error: joinError}] = useMutation(JOIN_GROUP);
    const [logout, logoutDetails] = useMutation(LOGOUT)
    const navigate = useNavigate();

    useEffect(() => {
        if (joinError != null) {
            setMessage(joinError.message)
        }
    }, [joinError]);

    const handleCreateGroupClick = useCallback(() => {
        createGroup({
            variables: {
                groupName,
                dollarLimit
            },
            refetchQueries: [
                GET_CURRENT_USER,
                GET_CURRENT_USER_DETAILS
            ] 
        })
    }, [createGroup, dollarLimit, groupName])

    const handleJoinGroupClick = useCallback(() => {
        joinGroup({
            variables: {
                groupID: userInputGroupId
            },
            refetchQueries: [
                GET_CURRENT_USER,
                GET_CURRENT_USER_DETAILS
            ]
        })
    }, [joinGroup, userInputGroupId])

    const redirectToHome = useCallback(() => {
        navigate("/", {
            state: {
                loggedOut: true
            }
        })
    }, [navigate])

    const handleLogout = useCallback(() => {
        logout({
            onCompleted: redirectToHome
        })
    }, [logout, redirectToHome])

    return (
        <div>
            {/* <h1>Hello, {username}</h1> */}
            <p>You are not part of a secret santa group. Here are your options:</p>
            {/* <Button onClick={handleCreateGroupClick}>Create a group</Button> */}
            <p>Click here to create a group</p>
            <Button onClick={() => { setCreateFormVisible(!createFormVisible)}}>{createFormVisible === false ? 'Create a group' : 'Hide'}</Button>

            <Transition visible={createFormVisible} animation='vertical flip' duration={500}>
                <Form>
                    <Form.Input label="Enter Group Name"onChange={(event) => {
                    setGroupName(event.target.value)

                }}  value={groupName} />
                    <Form.Input label="Enter Dollar Limit" onChange={(event) => {
                    setDollarLimit(Number(event.target.value))
                }}  value={dollarLimit}/>
                    <Form.Button onClick={handleCreateGroupClick}>Create a group</Form.Button>
                </Form>
                
            </Transition>

            <Divider/>
            <p>Or join an existing group using a unique group ID</p>
            <Form>
                <Form.Input label="Enter Group ID"  onChange={(event) => {
                    setUserInputGroupId(event.target.value)
                }}  value={userInputGroupId}  />                        
                <Form.Button onClick={handleJoinGroupClick}>Join Group</Form.Button>
                <div className="errorMessages">{message}</div>
            </Form>
            <Button onClick={handleLogout}>Logout</Button>
            {message.length > 0  && <p>{message}</p>}
        </div>
    )
}