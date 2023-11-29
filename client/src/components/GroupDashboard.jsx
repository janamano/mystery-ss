import React, { useEffect, useState, useCallback } from 'react';
import { REMOTE } from '../endpoints';
import { Button, Dimmer, Header, Item, Loader, Menu, Segment, Table } from 'semantic-ui-react';
import { useLocation, useNavigate } from "react-router-dom";
import WishlistItem from './WishlistItem';
import Wishlist from './Wishlist';

export default function NoGroupDashboard(props) {
    const [message, setMessage] = useState('');
    const [assignee, setAssignee] = useState('');
    const [activeItem, setActiveItem] = useState('home')
    // const [groupId, setGroupId] = useState(location.state.group);
    const [groupMembers, setGroupMembers] = useState([]);
    const [wishes, setWishes] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    var CryptoJS = require("crypto-js");

    const encrypt = (data) => {
        var bytes  = CryptoJS.AES.encrypt(data, process.env.REACT_APP_SECRET);  // pass IV
        return bytes.toString();
    }
    const decrypt = (data) => {
        var bytes  = CryptoJS.AES.decrypt(data, process.env.REACT_APP_SECRET);  // pass IV
        console.log('jana ------------')
        console.log(process.env.REACT_APP_SECRET)
        console.log(process.env)
        console.log('jana ------------')
        return bytes.toString(CryptoJS.enc.Utf8);
    }
    useEffect(() => {
        console.log('didmount')
        const fetchData = async () => {
            await fetch(REMOTE + "/api/getAssignee?username=" + props.username, {
                method: "GET",
                headers: {
                    "Access-Control-Allow-Origin": "*"
                }
            })
            .then(res => {
                console.log('res', res);
                return res.json()})
            .then(res => {
                if (res.status == 'error') {
                    setMessage(res.message)
                } else {
                    console.log('jana ->',res.data)
                    if (res.data.length > 0) {
                        setAssignee(res.data[0].assignee)
                    }
                }
            })
            .catch(err => console.log(err))
        }
        const fetchGroupMembers = async () => {
            await fetch(REMOTE + "/api/getMembers?group=" + props.groupId, {
                method: "GET",
                headers: {
                    "Access-Control-Allow-Origin": "*"
                }
              })
              .then(res => res.json())
              .then(res => {
                if (res.status == 'error') {
                    setMessage(res.message)
                } else {
                    setGroupMembers(res.data.map(groupObject => {
                        return {
                            username: groupObject.username,
                            email: groupObject.email,
                            isHost: groupObject.isHost
                        }
                    }))
                }
              })
              .catch(err => console.log(err))
        }
        fetchData();
        fetchGroupMembers();
    }, [])


    useEffect(() => {
        if (activeItem == assignee + '\'s wishlist') {
            setLoading(true)
            const fetchWishes = async () => {
                await fetch(REMOTE + "/api/getWishes?username=" + assignee, {
                    method: "GET",
                    headers: {
                        "Access-Control-Allow-Origin": "*"
                    }
                })
                .then(res => {
                    console.log('res', res);
                    return res.json()})
                .then(res => {
                    if (res.status == 'error') {
                        setMessage(res.message)
                    } else {
                        if (res.data.length > 0) {
                            console.log(JSON.stringify(res.data));
                            setWishes(res.data)
                        }
                        setLoading(false)

                    }
                })
                .catch(err => console.log(err))
            }
            fetchWishes();
        }

    }, [activeItem, assignee])

    const handleDrawClick = useCallback(async () => {
        // randomly assign values
        let assignments = {}
        let groupMembersUsernames = groupMembers.map((member) => {
            return member.username
        });
        console.log('jana members before', groupMembersUsernames)
        let currentIndex = groupMembersUsernames.length,  randomIndex;

        // While there remain elements to shuffle.
        while (currentIndex != 0) {
      
          // Pick a remaining element.
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
      
          // And swap it with the current element.
          [groupMembersUsernames[currentIndex], groupMembersUsernames[randomIndex]] = [
            groupMembersUsernames[randomIndex], groupMembersUsernames[currentIndex]];
        }

        for (let i = 0; i < groupMembersUsernames.length - 1; i++) {
            assignments[groupMembersUsernames[i].toString()] = groupMembersUsernames[i+1].toString()
        }


        assignments[groupMembersUsernames[groupMembersUsernames.length - 1].toString()] = groupMembersUsernames[0].toString()
      
        await fetch(REMOTE + "/api/createAssignment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({assignments: assignments, group: props.groupId}),
          })
          .then(res => res.json())
          .then(res => {
            console.log(res)
            if (res.status == 'error') {
                setMessage(res.msg)
            } else {
                setMessage("success, login again to see your assignee")

            }
          })
          .catch(err => console.log(err))

    }, [groupMembers, props.groupId])

    return (
        <React.Fragment>
      <Menu pointing secondary>
        <Menu.Menu>
            <Menu.Item
                name='home'
                active={activeItem === 'home'}
                onClick={() => {setActiveItem('home')}}
            />
        </Menu.Menu>
        <Menu.Item
            name='Group Info'
            active={activeItem === 'groupInfo'}
            onClick={() => {setActiveItem('groupInfo')}}
        />
        <Menu.Item
            name='wishlist'
            active={activeItem === 'wishlist'}
            onClick={() => {setActiveItem('wishlist')}}
        />
        {(assignee == null || assignee.length != 0) &&
            <Menu.Item
            name={assignee + '\'s wishlist'}
            active={activeItem === assignee + '\'s wishlist'}
            onClick={() => {setActiveItem(assignee + '\'s wishlist')}}
        />
        }
        <Menu.Menu position='right'>
            <Menu.Item
            name='logout'
            active={activeItem === 'logout'}
            onClick={() => {navigate("/")}}
            />
        </Menu.Menu>
        </Menu>
        {activeItem === 'home' &&
        <Segment>
            <Header as='h3'>Hello, {props.username}</Header>
            <p>You are part of group "{props.groupName}".</p>
            {assignee.length > 0 &&
            <React.Fragment>
                <p>You have to provide a gift to {assignee}.</p>
                <Button className='wishlistButton' color='pink' onClick={() => {setActiveItem(assignee + '\'s wishlist')}}>Go to their wishlist</Button>
            </React.Fragment>
            }
            {props.isHost && <p>The group ID is <b>{props.groupId}</b></p>}
            <p>The dollar limit for this group is ${props.dollarLimit}</p>
        </Segment>}
            {activeItem === 'groupInfo' &&
            <Segment>

                {props.isHost == true ?
                <div>
                    <p>You are the host of this group</p>
                    <Table basic='very' celled collapsing>
                        <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Username</Table.HeaderCell>
                            <Table.HeaderCell>Email</Table.HeaderCell>
                        </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {groupMembers.map(member => {
                            return <Table.Row>
                                <Table.Cell floated='left'>{member.username}</Table.Cell>
                                <Table.Cell>{member.email}</Table.Cell>
                                </Table.Row>
                            })}
                        </Table.Body>
                    </Table>

                    {(assignee == null || assignee.length == 0) &&
                    <Button onClick={handleDrawClick}>Click here to randomly assign secret santas for this group and send out emails to inform everyone</Button>}
                </div> :
                <div>
                    <p>Wait til the host ({props.groupHost}) starts the secret santa</p>
                    <p>Group Members:</p>
                    <Table basic='very' celled collapsing>
                        <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Username</Table.HeaderCell>
                            <Table.HeaderCell>Email</Table.HeaderCell>
                        </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {groupMembers.map(member => {
                            return <Table.Row>
                                <Table.Cell floated='left'>{member.username}</Table.Cell>
                                <Table.Cell>{member.email}</Table.Cell>
                                </Table.Row>
                            })}
                        </Table.Body>
                    </Table>
                </div>}
            </Segment>
            }
            {activeItem == 'wishlist' &&
                <Wishlist username={props.username} />
            }
            {assignee.length > 0 && activeItem == assignee + '\'s wishlist' &&
            <React.Fragment>
                {loading ? 
                <Segment>
                    <Dimmer active inverted>
                        <Loader inverted content='Loading' />
                    </Dimmer>

                </Segment> :
                <Segment>
                    <Item.Group divided>
                        {wishes.length == 0 && <p>{assignee} has not made any wishes yet.</p>}
                        {wishes.map((wishItem) => {
                            return <WishlistItem itemName={wishItem.wishName} itemLink={wishItem.wishLink} showControls={false}/>
                        })}
                    </Item.Group>
                </Segment>}

            </React.Fragment>
            
            }
        </React.Fragment>
    );
}