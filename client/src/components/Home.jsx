// vendor imports
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import { Button, Container, Divider, Header, Loader } from "semantic-ui-react";
import NoGroupDashboard from "./NoGroupDashboard";
import GroupDashboard from "./GroupDashboard";
import { useQuery } from '@apollo/client';
import { GET_CURRENT_USER } from "./queries/queries";
export default function Home() {
    const location = useLocation();
    const [hasGroup, setHasGroup] = useState(false)
    const {loading, error, data, refetch} = useQuery(GET_CURRENT_USER, {
        fetchPolicy: 'cache-and-network'
    })
    console.log('data in home', data)

    useEffect(() => {
        console.log('useEffect data in home', loading, error, data)

        if (loading == false) {
            if (data.user != null) {
                if (data.user.group != null) {
                    setHasGroup(true)
                } else {
                    setHasGroup(false)
                }
            } else {
                refetch()
            }
            console.log('jana', data, error)
        }
    }, [data, error, loading, refetch])

    return (
            loading == true ?
                <React.Fragment>
                    <Container className="container1">
                        <Loader></Loader>
                    </Container> 
                </React.Fragment> :
                <React.Fragment>
                    <Container className="container1">
                        <Header textAlign="center" as='h1'>Super Minimalistic Secret Santa App Home page</Header>
                        <Divider/>
                    </Container>
                    <Container className="ui homeContainer">

                        {hasGroup
                            ? <GroupDashboard  />    
                            : <NoGroupDashboard />
                        }
                        <br></br>
                    </Container>
                </React.Fragment> 
        
    );
}
