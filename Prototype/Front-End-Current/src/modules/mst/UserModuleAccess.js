import { getToken } from "Functions/User";
import { baseUrl } from "config";
import { ModuleAccessErrors, GiveUserAccessErrors } from "errorCodes";
import React, { useState, useEffect } from 'react';
import { useLoaderData } from 'react-router';

export default function UserModuleAccess() {
    const response = useLoaderData();

    return (<>

        {renderContent(response.StatusCode)}

    </>)
}

function renderContent(responseCode) {
    switch (responseCode) {
        case -1:
            return (<>
                <h3>Error:</h3>
                <p>Looks like some thing went wrong while we were processing you request. Try refreshing the page and checking your internet connection.</p>
            </>)
        case 200:
            return (<AddUsertoModuleForm />)
        case 401:
            return (<>
                <h3>Unauthorised Access:</h3>
                <p>Looks like you don't have acces to this resource. If you believe this message to be in error, please contact an admin.</p>
            </>)
    }
}

function AddUsertoModuleForm() {
    const [response, setResponse] = useState();
    const [error, setError] = useState();

    useEffect(() => {
        console.log(response);
    }, [response]);

    const handleAdd = async (e) => {
        const form = document.getElementById("addUsertoModule");
        const formData = new FormData(form);

        fetch(baseUrl + "/mst/module/ModuleAccess", {
            method: "POST",
            headers: {"Authorization" : getToken()},
            body: formData,
        }).then(response => (response.json()
        )).then((response) => {
            if (response.Success == true) {
                console.log(response);
                setResponse(response);
                setError(false);
            } else {
                console.log(response);
                setResponse(response);
                setError(true);
            }
        }
        ).catch(function (error) {
            console.log(error);
        })
    };

    const handleDelete = async (e) => {
        const form = document.getElementById("addUsertoModule");
        const formData = new FormData(form);

        fetch(baseUrl + "/mst/module/ModuleAccess", {
            method: "DELETE",
            headers: {"Authorization" : getToken()},
            body: formData,
        }).then(response => (response.json()
        )).then((response) => {
            if (response.Success == true) {
                console.log(response);
                setResponse(response);
            } else {
                console.log(response);
                setResponse(response);
            }
        }
        ).catch(function (error) {
            console.log(error);
        })
    };

    const resetForm = (e) => {
        const userField = document.querySelector("input[name=userID]");
        const moduleField = document.querySelector("input[name=modulePrefix]");

        if (userField) userField.value = "";
        if (moduleField) moduleField.value = "";

        // Reset any error messages if needed
        setResponse();
        setError(false);
    };

    return (<>
        <div style={{ display: "flex", justifyContent: "center", alignContent: "center", flexGrow: "1" }}>
            <div className="flexBoxColumnGrow" style={{ padding: "32px", maxWidth: "500px" }}>
                <div className="subNav" style={{ borderRadius: "20px 20px 0px 0px", display: "flex", justifyContent: "center", alignItems: "center", height: "70px" }}>
                    <h3>User Module Access</h3>
                </div>
                <form className="add-user-form" id="addUsertoModule">
                    <div className="login-form-content" style={{ display: "flex", flexDirection: "column", rowGap: "8px" }}>
                        <FormInput
                            label="User ID"
                            type="number"
                            min="1"
                            name="userID"
                            placeholder="User ID to be added"
                        />
                        <FormInput
                            label="Module Prefix"
                            type="text"
                            name="modulePrefix"
                            placeholder="Module for access"
                        />
                    </div>
                </form>
                
                <div className="flexBoxRowGrow" style={{ justifyContent: "center"}}>
                        {response && response.StatusCode === 200 ? (
                            <div>
                                <p style={{color: "green"}}>User access successfully modified.</p>
                                <button onClick={resetForm} className="primaryButton">Reset Form</button>
                            </div>
                        ) : (
                            <div>
                                <div>
                                    {response && [ModuleAccessErrors.missingFields, ModuleAccessErrors.missingFields, GiveUserAccessErrors.permissionsInsufficient].includes(response.StatusCode)
                                        && (
                                            <div className="error-message">
                                                {response.Message}
                                            </div>
                                        )}
                                        <div className="flexBoxColumnGrow" style={{ alignItems: "center", justifyContent: "center"}}>
                                            <button onClick={handleAdd} className="primaryButton" style={{ marginTop: "10px" }}>Give Access</button>
                                            <button onClick={handleDelete} className="primaryButton" style={{ marginTop: "10px" }}>Remove Access</button>
                                        </div>
                                </div>
                            </div>
                        )}
                    </div>
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