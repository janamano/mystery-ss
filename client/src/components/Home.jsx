// vendor imports
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import { Container, Divider, Header } from "semantic-ui-react";
import NoGroupDashboard from "./NoGroupDashboard";
import GroupDashboard from "./GroupDashboard";

export default function Home() {
    const location = useLocation();
    
    const username = useState(location.state.username)[0];
    const email = useState(location.state.email)[0];
    const [groupId, setGroupId] = useState(location.state.group);
    const [groupName, setGroupName] = useState(location.state.groupName);
    const [dollarLimit, setDollarLimit] = useState(location.state.dollarLimit);
    
    const [isHost, setIsHost] = useState(location.state.isHost);
    const [groupHost, setGroupHost] = useState(location.state.groupHost);

    /**
     * first = marie
     * mut = [marie, kajan]
     * actual = [marie, kajan, rukh, jana]
     * marie -> rukh
     * kajan -> jana
     * kajan
     * 
     */

    return (
        <React.Fragment>
            <Container className="container1">
                <Header textAlign="center" as='h1'>Super Minimalistic Secret Santa App Home page</Header>
                <Divider/>
            </Container>
            <Container className="ui homeContainer">

                {groupId == null 
                    ? <NoGroupDashboard 
                        email={email}
                        username={username}
                        setGroupId={setGroupId}
                        setDollarLimit={setDollarLimit} 
                        setGroupName={setGroupName}
                        setGroupHost={setGroupHost}
                        setIsHost={setIsHost} />
                        
                    : <GroupDashboard 
                        email={email}
                        isHost={isHost} 
                        username={username}
                        groupId={groupId}
                        groupName={groupName}
                        groupHost={groupHost}
                        dollarLimit={dollarLimit}/>
                }
                <br></br>
            </Container>
        </React.Fragment>

    );
}