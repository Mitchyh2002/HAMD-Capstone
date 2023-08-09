import React, { useState } from "react";

export default function Login(props) {
    const [register, setRegister] = useState(false);

    const handleLogin= (e) => {
        const form = document.getElementById("inputs");
        const formData = new FormData(form);

        fetch("http://localhost:5000/user/login", {
            method: "POST",
            body: formData,
        }).then(response => (response.json()
        )).then((response) => {
            if (response.Success == true) {
                    props.setLoggedIn(true);
                }
            console.log(response);
            }
        ).catch(function (error) {
             console.log(error);
        })
    }

    const handleRegister = (e) => {
        const form = document.getElementById("inputs");
        const formData = new FormData(form);
        
        fetch("http://localhost:5000/user/register", {
            method: "POST",
            body: formData,
        }).then(response => (response.json()
        )).then((response) => {
            if (response.Success == true) {
                    setRegister(false);
                }
            console.log(response);
            }
        ).catch(function (error) {
             console.log(error);
        })
    } 

    return(
        <div>
            <form id="inputs">
                <label>Username</label>
                <input name="user"></input>
                <label>Password</label>
                <input name="password"></input>
            </form>
            {(register == false)?
            <button onClick={handleLogin}>Login</button>
            :
            <button onClick={handleRegister}>Register</button>}
        </div>
    )
}