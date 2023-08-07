import React, { useState } from "react";

export default function Login(props) {
    const [register, setRegister] = useState(false);

    const handleLogin= (e) => {
        props.setLoggedIn(true);
    }

    const handleRegister = (e) => {
        props.setRegister(false);
    } 

    return(
        <div>
            <form>
                <label>Username</label>
                <input></input>
                <label>Password</label>
                <input></input>
            </form>
            {(register == false)?
            <button onClick={handleLogin}>Login</button>
            :
            <button onClick={handleRegister}>Register</button>}
        </div>
    )
}