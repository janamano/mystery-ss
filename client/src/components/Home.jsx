// vendor imports
import React, { useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import cryptoRandomString from 'crypto-random-string';
import { useEffect } from "react";

export default function Home() {
    const location = useLocation();
    
    const [username, setUsername] = useState(location.state.username);
    const email = useState(location.state.email)[0];
    const [groupId, setgroupId] = useState(location.state.group);
    const [isHost, setIsHost] = useState(location.state.isHost);
    const [message, setMessage] = useState('')
    const [userInpurGroupId, setUserInputGroupId] = useState('');
    const [groupMembers, setGroupMembers] = useState([]);
    const [assignee, setAssignee] = useState('');
    const navigate = useNavigate();


    const home = () => {
        navigate("/")
    }

    const handleCreateGroupClick = useCallback(async () => {
        const newGroupId = cryptoRandomString({length: 10});
        await fetch("/api/createGroup", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                username: username,
                group: newGroupId
            }),
          })
          .then(res => res.json())
          .then(res => {
            if (res.status == 'error') {
                setMessage(res.message)
            } else {
                setgroupId(res.data.group);
                setIsHost(res.data.isHost)
                setMessage('')

            }
          })
          .catch(err => console.log(err))
    }, [email, username, groupId, setMessage, setgroupId, setIsHost]);

    const handleJoinGroupClick = useCallback(async (event) => {
        event.preventDefault();
        await fetch("/api/joinGroup", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                username: username,
                group: userInpurGroupId
            }),
          })
          .then(res => res.json())
          .then(res => {
            if (res.status == 'error') {
                setMessage(res.message)
            } else {
                setgroupId(res.data.group);
                setIsHost(res.data.isHost);
                setMessage('')

            }
          })
          .catch(err => console.log(err))
    }, [userInpurGroupId, email, username, setMessage, setgroupId, setIsHost]);

    const getGroupMembers = useCallback(async () => {
        await fetch("/api/getMembers?group=" + groupId, {
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
                        email: groupObject.email
                    }
                }))
            }
          })
          .catch(err => console.log(err))
    }, [groupId])
    
    useEffect(() => {
        getGroupMembers();
    }, [groupId, getGroupMembers]);

    useEffect(() => {
        console.log('didmount')
        const fetchData = async () => {
            await fetch("/api/getAssignee?username=" + username, {
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
        fetchData()
    })
    /**
     * first = marie
     * mut = [marie, kajan]
     * actual = [marie, kajan, rukh, jana]
     * marie -> rukh
     * kajan -> jana
     * kajan
     * 
     */
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

        // console.log('jana members after', groupMembersUsernames)
        for (let i = 0; i < groupMembersUsernames.length - 1; i++) {
            assignments[groupMembersUsernames[i].toString()] = groupMembersUsernames[i+1].toString()
        }
        // console.log('assignments', assignments);
        console.log('index', groupMembersUsernames.length - 1);
        console.log('final element', groupMembersUsernames[groupMembersUsernames.length - 1])

        assignments[groupMembersUsernames[groupMembersUsernames.length - 1].toString()] = groupMembersUsernames[0].toString()
      
        await fetch("/api/createAssignment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({assignments: assignments, group: groupId}),
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

    }, [groupMembers, groupId])

    return (
        <div>
            Super Minimalistic Secret Santa App Home Page
            <br></br>
            Hello, {username}
            <p>This is your email: {email}</p>

            {groupId == null ? 
            <div>
                <p>You are not part of a secret santa group. Here are your options:</p>
                <button onClick={handleCreateGroupClick}>Create a group</button>
                <form>
                    <div class="form-group">
                        <label>Group ID</label>
                        <input onChange={(event) => {
                            setUserInputGroupId(event.target.value)
                        }}  value={userInpurGroupId} />
                    </div>
                    
                    <button type="submit" onClick={handleJoinGroupClick}>Join Group</button>
                </form>
            </div> :
            <div>
                <p>You are part of group {groupId}.</p>
                <p>You have to provide a gift to {assignee}.</p>

                {isHost == true ?
                <div>
                    <p>You are the host of this group</p>
                    {groupMembers.map(member => {
                        return <p>Username: {member.username}, email: {member.email}</p>
                    })}

                    <p>DONT CLICK IF YOUVE ALREADY ASSIGNED</p>
                    <button onClick={handleDrawClick}>Click here to randomly assign secret santas for this group and send out emails to inform everyone</button>

                </div> :
                <div>
                    <p>Wait til the host starts the secret santa</p>
                    <p>group members:</p>
                    {groupMembers.map(member => {
                        return <p>Username: {member.username}, email: {member.email}</p>
                    })}
                    
                </div>
                }
            </div> 
            }
            {message.length > 0  && <p>{message}</p>}
            <button onClick={home}>Logout</button>

        </div>
    );
}