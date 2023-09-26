import React, { useState } from 'react';
import "./admin.css";
import { checkEmailValid, checkDOB, checkName, checkPass } from "../../Pages/Login.js";

export default function AddUser(){
    const [nameError, setNameError] = useState();
    const [emailError, setEmailError] = useState();
    const [dobError, setDobError] = useState();
    const [passError, setPassError]  = useState();
    const [loading, setLoading] = useState(false);

    const validateForm = (formData) =>{
        setNameError(checkName(formData.get("firstName")));
        setEmailError(checkEmailValid(formData.get("email")));
        setDobError(checkDOB(formData.get("dateOfBirth")));
        setPassError(checkPass(formData.get("password")));

        let valid = true;

        if (nameError) {
            valid = false;
        }

        if(emailError){
            valid = false;
        }

        if(dobError){
            valid = false;
        }

        if(passError){
            valid = false;
        }

        return(valid)

    }

    const addUser = (e) => {
        setLoading(true);
        const form = document.getElementById("upload");
        const formData = new FormData(form);

        const valid = validateForm(formData);
        if(valid){
            fetch(baseUrl + "/mst/user/register", {
                method: "POST",
                body: formData,
            }).then(response => (response.json()
            )).then((response) => {
                if (response.Success == true) {
                    console.log(response);
                    window.alert("Success!")
                }else{
                    console.log(response);
                }
                setLoading(false);
            }
            ).catch(function (error) {
                console.log(error);
                setLoading(false);
            })
        }else{
            setLoading(false);
        }
    }

    return(
        <>
            <div style={{ display: "flex", justifyContent: "center", alignContent: "center", flexGrow: "1" }}>
            <div className="flexBoxColumnGrow" style={{ padding: "32px", maxWidth: "500px" }}>
                <div className="subNav" style={{ borderRadius: "20px 20px 0px 0px", display: "flex", justifyContent: "center", alignItems: "center", height: "70px" }}>
                    <h3>Add User</h3>
                </div>
                <form id="upload">
                    <div style={{ display: "flex", flexDirection: "column", rowGap: "8px" }}>
                        <label>First Name</label>
                        <input className="uploadInput"  type="text" id="firstName" name="firstName" />
                        <p style={{color: "red"}}>{nameError}</p>
                        <label>DOB</label>
                        <input className="uploadInput" type="number" min="1910" max="2099" id="dob" name="dateOfBirth" />
                        <p style={{color: "red"}}>{dobError}</p>
                        <label>Email</label>
                        <input className="uploadInput"  type="text" id="email" name="email" />
                        <p style={{color: "red"}}>{emailError}</p>
                        <label>Password</label>
                        <input className="uploadInput" type="password" id="password" name="password" />
                        <p style={{color: "red"}}>{passError}</p>
                    </div>
                </form>
                <div className="flexBoxRowGrow" style={{ justifyContent: "center" }}>
                    <button onClick={addUser} className="primaryButton">Add User</button>
                </div>
            </div>
        </div>
        </>
    )
}