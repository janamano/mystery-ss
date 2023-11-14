// imports
import React, { useState, useCallback } from"react";
import { Button, Divider, Form, Transition } from "semantic-ui-react";
import cryptoRandomString from 'crypto-random-string';
import { LOCAL } from "../endpoints";

export default function NoGroupDashboard(props) {

    // create group
    const [groupName, setGroupName] = useState('');
    const [dollarLimit, setDollarLimit] = useState('');
    const [createFormVisible, setCreateFormVisible] = useState(false);
    const [userInputGroupId, setUserInputGroupId] = useState('');
    const [message, setMessage] = useState('');

    const handleCreateGroupClick = useCallback(async () => {
        const newGroupId = cryptoRandomString({length: 10});
        await fetch(LOCAL + "/api/createGroup", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: props.email,
                username: props.username,
                group: newGroupId,
                groupName: groupName,
                dollarLimit: dollarLimit
            }),
          })
          .then(res => res.json())
          .then(res => {
            if (res.status === 'error') {
                setMessage(res.message)
            } else {
                console.log('jana res data', res.data)

                // todo: redirect to group page
                props.setGroupId(res.data.group);
                props.setGroupName(res.data.groupName);
                props.setDollarLimit(res.data.dollarLimit);
                props.setIsHost(true);
                props.setGroupHost(res.data.groupHost)

                setMessage('')

            }
          })
          .catch(err => console.log(err))
    }, [props, groupName, dollarLimit]);

    const handleJoinGroupClick = useCallback(async (event) => {
        event.preventDefault();
        await fetch(LOCAL + "/api/joinGroup", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: props.email,
                username: props.username,
                group: userInputGroupId
            }),
          })
          .then(res => res.json())
          .then(res => {
            if (res.status === 'error') {
                setMessage(res.message)
            } else {
                console.log('jana res data', res.data)
                props.setGroupId(res.data.group);
                props.setGroupName(res.data.groupName);
                props.setDollarLimit(res.data.dollarLimit);

                props.setIsHost(res.data.isHost);
                props.setGroupHost(res.data.groupHost)
                
                setMessage('')

            }
          })
          .catch(err => console.log(err))
    }, [props, userInputGroupId]);

    return (
        <div>
            <p>You are not part of a secret santa group. Here are your options:</p>
            {/* <Button onClick={handleCreateGroupClick}>Create a group</Button> */}
            <p>Click here to create a group</p>
            <Button onClick={() => { setCreateFormVisible(!createFormVisible)}}>{createFormVisible === false ? 'Create a group' : 'Hide'}</Button>

            <Transition visible={createFormVisible} animation='vertical flip' duration={500}>
                <Form>
                    <Form.Input label="Enter Group Name"onChange={(event) => {
                    setGroupName(event.target.value)
                    console.log(groupName)

                }}  value={groupName} />
                    <Form.Input label="Enter Dollar Limit" onChange={(event) => {
                    setDollarLimit(event.target.value)
                    console.log(dollarLimit)
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
            </Form>
            {message.length > 0  && <p>{message}</p>}
        </div>
    )
}