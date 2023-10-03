import react, { useRef, useState } from "react";
import axios from "axios";
import "./admin.css";
import { baseUrl } from "config";
import { FormInput } from "Pages/Login";
import { getToken } from "Functions/User";


export default function Upload(props) {

    const [selectedFile, setSelectedFile] = useState();
    const [isSelected, setIsSelected] = useState(false);
    const [response, setResponse] = useState();
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [visible, setVisible] = useState(false);

    //State for checking form input errors
    const [prefixError, setPrefixError] = useState();
    const [nameError, setNameError] = useState();
    const [codeError, setCodeError] = useState();
    const [passError, setPassError] = useState();

    //Function for validating form and checking for any input errors
    const validateForm = (formData) => {
        setPrefixError(checkModulePrefix(formData.get("prefixName")));
        setNameError(checkDisplayName(formData.get("pluginDisplayName")));
        setCodeError(checkModuleCode(formData.get("fileToUpload")));
        setPassError(checkPassword(formData.get("modulePass")));

        let valid = true;

        if (prefixError) {
            valid = false;
        }
        if (nameError){
            valid = false;
        }
        if(codeError){
            valid = false;
        }
        if(passError){
            valid = false;
        }

        return (valid)

    }

    const changeFile = (event) => {
        setSelectedFile(event.target.files[0]);
        setIsSelected(true);
    };

    const handleFileClick = () => {
        document.getElementById("pluginFile").click();
    }

    const uploadPlugin = () => {
        const form = document.getElementById("upload");
        const formData = new FormData(form);
        let method = "POST"
        const valid = validateForm(formData);

        if (document.getElementById("update").checked) {
            method = "UPDATE";
            formData.append("update", true);
        } else {
            method = "POST";
            formData.append("update", false);
        }

        if (valid) {
            fetch(baseUrl + "/mst/module/upload", {
                method: method,
                headers: {
                    "Authorization": "Bearer " + getToken()
                },
                body: formData,
            }).then(response => (response.json()
            )).then((response) => {
                setResponse(response);
                if (response.Success == true) {
                    setSuccess(true);
                    setError(false);
                } else {
                    setSuccess(false);
                    setError(true);
                }
            }
            ).catch(function (error) {
                console.log(error);
            })
        }
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", alignContent: "center", flexGrow: "1" }}>
            <div className="flexBoxColumnGrow" style={{ padding: "32px", maxWidth: "500px" }}>
                <div className="form-header">
                    <h3>Add Plugin</h3>
                </div>
                <form id="upload">
                    <div style={{ display: "flex", flexDirection: "column", rowGap: "8px" }}>
                        {(success == true) ? <p>Your file has been uploaded and installed.</p> : (error) && <p>{response.Message}</p>}
                        <FormInput
                            label="Module Prefix"
                            type="text"
                            id="prefixName"
                            name="prefixName"
                            error={prefixError}
                        />
                        <FormInput
                            label="Plugin Display Name"
                            type="text"
                            id="pluginDisplayName"
                            name="pluginDisplayName"
                            error={nameError}
                        />
                        <div style={{ justifyContent: "space-between" }} className="flexBoxRowGrow">
                            <label>Module Code</label>
                            <div className="formButton" onClick={handleFileClick}>
                                <p>{!isSelected ? "Upload A File" : selectedFile.name}</p>
                                <input type="file" accept=".zip" id="pluginFile" name="fileToUpload" onChange={changeFile} hidden />
                            </div>
                        </div>
                        <p className="error-message">{codeError}</p>
                        <FormInput
                            label="Module Password"
                            type="password"
                            id="modulePass"
                            name="modulePass"
                            error={passError}
                        />
                        {isSelected ?
                            (<div>
                                <p>Filename: {selectedFile.name}</p>
                                <p>Filetype: {selectedFile.type}</p>
                                <p>Size in bytes: {selectedFile.size}</p>
                            </div>) : (
                                <p> </p>
                            )}
                    </div>
                    <label>Update?</label>
                    <input type="checkbox" id="update" />
                </form >
                <div className="flexBoxRowGrow" style={{ justifyContent: "center" }}>
                    <button className="primaryButton" onClick={uploadPlugin}>Submit</button>
                </div>
            </div >
        </div >
    )
}

// Functions to check the upload form inputs for any errors.

function checkModulePrefix(prefix) {
    if (!prefix) {
        return "Module prefix is required.";
    } else if (prefix.length > 3) {
        return "Module prefix should only be 3 characters.";
    }
}

function checkDisplayName(displayName) {
    if (!displayName) {
        return "Plugin display name is required.";
    }
}

function checkModuleCode(moduleCode) {
    if (!moduleCode) {
        return "Module code is required.";
    }
}

function checkPassword(password) {
    if (!password) {
        return "Password is required.";
    }
}