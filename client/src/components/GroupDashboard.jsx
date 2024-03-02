import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Button, Dimmer, Header, Item, Loader, Menu, Segment, Table } from 'semantic-ui-react';
import { useNavigate } from "react-router-dom";
import WishlistItem from './WishlistItem';
import Wishlist from './Wishlist';
import { GET_CURRENT_USER_DETAILS, GET_ASSIGNMENT } from './queries/queries';
import { LOGOUT, CREATE_ASSIGNMENT } from './mutations/mutations';
import { useQuery, useMutation } from '@apollo/client';

export default function GroupDashboard(props) {
    const [message, setMessage] = useState('');
    const [assignee, setAssignee] = useState(null);
    const [activeItem, setActiveItem] = useState('home')
    // const [groupId, setGroupId] = useState(location.state.group);
    const [groupMembers, setGroupMembers] = useState([]);
    const [wishes, setWishes] = useState([]);
    const {data, loading, error} = useQuery(GET_CURRENT_USER_DETAILS);
    const assignmentDetails = useQuery(GET_ASSIGNMENT, {
        fetchPolicy: 'cache-and-network'
    });
    const [logout, logoutDetails] = useMutation(LOGOUT)
    const [createAssignments, createAssignmentDetails] = useMutation(CREATE_ASSIGNMENT)

    const [username, setUsername] = useState('')
    const [groupName, setGroupName] = useState('')
    const [groupID, setgroupID] = useState('')
    const [dollarLimit, setDollarLimit] = useState(0)
    const [isHost, setIsHost] = useState(false)
    const [groupHost, setGroupHost] = useState('')


    const navigate = useNavigate();

    useEffect(() => {
        console.log('from group dashboard', data, loading, error)
        if (loading == false) {
            if (data.user != null) {
                const currentUser = data.user
                // we can assume that this user has a group
                setGroupMembers(currentUser.group.groupMembers);
                setGroupName(currentUser.group.groupName);
                setUsername(currentUser.username)
                setgroupID(currentUser.group.groupID)
                setDollarLimit(currentUser.group.dollarLimit)
                setGroupHost(currentUser.group.groupHost)
                setIsHost(currentUser.isHost)
                setWishes(currentUser.wishes == null ? [] : currentUser.wishes)
            }
        }
    }, [data, error, loading])
    useEffect(() => {
        if (assignmentDetails.loading == false) {
            if (assignmentDetails.data.assignment != null) {
                setAssignee(assignmentDetails.data.assignment.assignee)
            }
        }
    }, [assignmentDetails.data, assignmentDetails.loading])

    const tableOfMembers = useMemo(() => {
        return (
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
        )
    }, [groupMembers])
    
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

    const handleDrawClick = useCallback(async () => {
        // randomly assign values
        let assignments = {}
        let groupMembersUsernames = groupMembers.map((member) => {
            return member.username
        });
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
        console.log('assignment', assignments)
        
        for (var key in assignments) {
            createAssignments({
                variables: {
                    assignee: assignments[key],
                    user: key,
                    group: groupID
                }
            })
            console.log("creating assignments", key)
        }
        console.log('after loop')
        assignmentDetails.refetch().then(() => {
            setActiveItem('home')
        })


    }, [assignmentDetails, createAssignments, groupID, groupMembers])

    return (
        <React.Fragment>
        <h1>Hello, {username}</h1>
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
        {(assignee != null) &&
            <Menu.Item
            name={assignee.username + '\'s wishlist'}
            active={activeItem === assignee.username + '\'s wishlist'}
            onClick={() => {setActiveItem(assignee.username + '\'s wishlist')}}
        />
        }
        <Menu.Menu position='right'>
            <Menu.Item
            name='logout'
            active={activeItem === 'logout'}
            onClick={handleLogout}
            />
        </Menu.Menu>
        </Menu>
        {activeItem === 'home' &&
            <React.Fragment>
            {loading == true ? 
                <Dimmer active inverted>
                    <Loader inverted content='Loading' />
                </Dimmer> :
                <Segment>
                    <Header as='h3'>Hello, {username}</Header>
                    <p>You are part of group "{groupName}".</p>
                    {assignee != null &&
                    //  TODO
                    <React.Fragment>
                        <p>You have to provide a gift to {assignee.username}.</p>
                        <Button className='wishlistButton' color='pink' onClick={() => {setActiveItem(assignee.username + '\'s wishlist')}}>Go to their wishlist</Button>
                    </React.Fragment>
                    }
                    {isHost && <p>The group ID is <b>{groupID}</b></p>}
                    <p>The dollar limit for this group is ${dollarLimit}</p>
            </Segment>}
        </React.Fragment>}
            {activeItem === 'groupInfo' &&
            <Segment>
                {isHost == true ?
                    <div>
                        <p>You are the host of this group</p>
                        <p>Group Members:</p>
                        {tableOfMembers}
                        {assignee == null &&

                        <Button onClick={handleDrawClick}>Assign Santas</Button>}
                    </div> :
                    <div>
                       {assignee == null && <p>Wait til the host ({groupHost}) starts the secret santa</p>}
                        <p>Group Members:</p>
                        {tableOfMembers}

                    </div>
                }
            </Segment>
            }
            {activeItem == 'wishlist' &&
                <Wishlist wishes={wishes} />
            }
            {assignee != null && activeItem == assignee.username + '\'s wishlist' &&
            <React.Fragment>

                {assignee == null ? 
                <Segment>
                    <Dimmer active inverted>
                        <Loader inverted content='Loading' />
                    </Dimmer>

                </Segment> :
                <Segment>
                    <Item.Group divided>
                        {assignee.wishes.length == 0 && <p>{assignee.username} has not made any wishes yet.</p>}
                        {assignee.wishes.map((wishItem) => {
                            return <WishlistItem itemName={wishItem.wishName} itemLink={wishItem.wishLink} showControls={false}/>
                        })}
                    </Item.Group>
                </Segment>}

            </React.Fragment>}
        </React.Fragment>
    );
}