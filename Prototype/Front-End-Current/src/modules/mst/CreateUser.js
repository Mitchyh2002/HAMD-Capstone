import React, { useState, useEffect } from 'react';
import "./admin.css";
import { checkEmailValid, checkDOB, checkName, checkPass } from "../../Pages/Login.js";
import { baseUrl } from "config";
import { useLoaderData } from 'react-router';
import { RegisterErrors } from 'errorCodes';

export default function CreateUser() {
    const response = useLoaderData();

    return (
        <>
            {renderContent(response.StatusCode)}
        </>
    )

}

function renderContent(responseCode) {
    switch (responseCode) {
        case -1:
            return (<>
                <h3>Error:</h3>
                <p>Looks like some thing went wrong while we were processing you request. Try refreshing the page and checking your internet connection.</p>
            </>)
        case 200:
            return (<AddUserForm />)
        case 401:
            return (<>
                <h3>Unauthorised Access:</h3>
                <p>Looks like you don't have acces to this resource. If you believe this message to be in error, please contact an admin.</p>
            </>)
    }
}


//Add User Form
function AddUserForm() {
    const [nameError, setNameError] = useState();
    const [emailError, setEmailError] = useState();
    const [dobError, setDobError] = useState();
    const [passError, setPassError] = useState();
    const [registered, setRegistered] = useState();
    const [loading, setLoading] = useState(false);

    const [response, setResponse] = useState(null);

    useEffect(() => {
        console.log(response);
    }, [response]);

    const validateForm = (formData) => {
        const nameErr = setNameError(checkName(formData.get("firstName")));
        const emailErr = setEmailError(checkEmailValid(formData.get("email")));
        const dobErr = setDobError(checkDOB(formData.get("dateOfBirth")));
        const passErr = setPassError(checkPass(formData.get("password")));

        setNameError(nameErr);
        setEmailError(emailErr);
        setDobError(dobErr);
        setPassError(passErr);

        let valid = true;

        if (nameErr || emailErr || dobErr || passErr) {
            valid = false;
        }

        return (valid)

    }

    const addUser = (e) => {
        setLoading(true);
        const form = document.getElementById("addUser");
        const formData = new FormData(form);

        const valid = validateForm(formData);
        if (valid) {
            fetch(baseUrl + "/mst/user/register", {
                method: "POST",
                body: formData,
            }).then(response => (response.json()
            )).then((response) => {
                if (response.Success == true) {
                    console.log(response);
                    setRegistered(true);
                } else {
                    console.log(response);
                }
                setLoading(false);
            }
            ).catch(function (error) {
                console.log(error);
                setLoading(false);
            })
        } else {
            setLoading(false);
        }
    }

    const resetForm = (e) => {
        setLoading(true);
        const nameField = document.querySelector("input[name=firstName]");
        const dateOfBirthField = document.querySelector("input[name=dateOfBirth]");
        const emailField = document.querySelector("input[name=email]");
        const passwordField = document.querySelector("input[name=password]");

        if (nameField) nameField.value = "";
        if (dateOfBirthField) dateOfBirthField.value = "";
        if (emailField) emailField.value = "";
        if (passwordField) passwordField.value = "";

        // Reset any error messages if needed
        setNameError(false);
        setDobError(false);
        setEmailError(false);
        setPassError(false);

        setRegistered(false);
        setLoading(false);
    }

    return (<>
        <div style={{ display: "flex", justifyContent: "center", alignContent: "center", flexGrow: "1" }}>
            <div className="flexBoxColumnGrow" style={{ padding: "32px", maxWidth: "500px" }}>
                <div className="subNav" style={{ borderRadius: "20px 20px 0px 0px", display: "flex", justifyContent: "center", alignItems: "center", height: "70px" }}>
                    <h3>Add User</h3>
                </div>
                <form className="add-user-form" id="addUser">
                    <div className="login-form-content" style={{ display: "flex", flexDirection: "column", rowGap: "8px" }}>
                        <FormInput
                            label="First Name"
                            type="text"
                            name="firstName"
                            error={nameError}
                        />
                        <FormInput
                            label="Birth Year"
                            error={dobError}
                            type="number"
                            min="1910"
                            max="2099"
                            name="dateOfBirth"
                        />

                        <FormInput
                            label="Email"
                            error={emailError}
                            type="email"
                            name="email"
                            className="emailAddress"
                        />
                        {response && [RegisterErrors.emailTaken].includes(response.StatusCode)
                        && (
                            <div className="error-message">
                                {response.Message}
                            </div>
                        )}
                        <FormInput
                            label="Password"
                            error={passError}
                            type="password"
                            name="password"
                            className="password"
                        />
                    </div>
                    <div className="flexBoxRowGrow" style={{ alignItems: "center", justifyContent: "center", maxWidth: "500px", marginTop: "20px" }}>
                        {registered ? (
                            <div className="flexBoxColumnGrow" style={{ justifyContent: "center" }}>
                                <p>User successfully added!</p>
                                <button onClick={resetForm} className="primaryButton" disabled={loading}>Add Another User</button>
                            </div>
                        ) : (
                            <button onClick={addUser} className="primaryButton" disabled={loading}>Add User</button>
                        )}
                    </div>
                </form>
            </div>
        </div>


    </>)
}

function FormInput(props) {
    return (
        <div className="form-group">
            <label>{props.label}</label>
            <div>
                <input
                    type={props.type}
                    name={props.name}
                    className={props.class}
                    placeholder={props.placeholder}
                />
                <p style={{ color: "red" }}>{props.error}</p>
            </div>
        </div>
    )
}
