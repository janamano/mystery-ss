// // vendor imports
// import React, { useState, useCallback } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.css";
// import cryptoRandomString from 'crypto-random-string';

// export default function Home() {
//     const location = useLocation();
    
//     const [username, setUsername] = useState(location.state.username);
//     const [email, setEmail] = useState(location.state.email);
//     const [groupId, setgroupId] = useState(location.state.group);
//     const [isHost, setIsHost] = useState(location.state.isHost);
//     const [message, setMessage] = useState('')

//     const navigate = useNavigate();


//     const home = () => {
//         navigate("/")
//     }

//     const handleCreateGroupClick = useCallback(async () => {
//         const groupId = cryptoRandomString({length: 10});
//         await fetch("https://mystery-santa-api.onrender.comhttp://localhost:5000/api/createGroup", {
//             method: "PUT",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//                 email: email,
//                 username: username,
//                 group: groupId
//             }),
//           })
//           .then(res => res.json())
//           .then(res => {
//             if (res.status == 'error') {
//                 setMessage(res.message)
//             } else {
//                 setgroupId(res.data.group);
//                 setIsHost(res.data.isHost)
//             }
//           })
//           .catch(err => console.log(err))
//     }, []);

    
//     return (
//         <div>
//             <form>
//                 <div class="form-group">
//                     <label>Group ID</label>
//                     <input onChange={(event) => {
//                         setUsername(event.target.value)
//                     }}  value={username} />
//                 </div>
//                 <button type="submit" onClick={handleSubmit}>Join Group</button>
//             </form>
//         </div>
//     );
// }