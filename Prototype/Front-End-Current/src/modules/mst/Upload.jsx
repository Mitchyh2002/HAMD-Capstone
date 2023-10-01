import react, { useRef, useState } from "react";
import axios from "axios";
import "./admin.css";
import { baseUrl } from "config";
import { getToken } from "Functions/User";


export default function Upload(props) {

    const [selectedFile, setSelectedFile] = useState();
    const [isSelected, setIsSelected] = useState(false);
    const [response, setResponse] = useState();
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [visible, setVisible] = useState(false);

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
        if(document.getElementById("update").checked){
            const method = "UPDATE";
            formData.append("update", true);
        }else{
            const method = "POST";
            formData.append("update", false);
        }

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

            console.log("success: " + success);
            console.log("error :" + error);
            console.log(response);
        }
        ).catch(function (error) {
            console.log(error);
        })
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", alignContent: "center", flexGrow: "1" }}>
            <div className="flexBoxColumnGrow" style={{ padding: "32px", maxWidth: "500px" }}>
                <div className="subNav" style={{ borderRadius: "20px 20px 0px 0px", display: "flex", justifyContent: "center", alignItems: "center", height: "70px" }}>
                    <h3>Add Plugin</h3>
                </div>
                <form id="upload">
                    <div style={{ display: "flex", flexDirection: "column", rowGap: "8px" }}>
                        {(success == true) ? <p>Your file has been uploaded and installed.</p> : (error) && <p>{response.Message}</p>}
                        <label>Module Prefix</label>
                        <input className="uploadInput" type="text" id="prefixName" name="prefixName" />
                        <label>Plugin Display Name</label>
                        <input className="uploadInput" type="text" id="pluginDisplayName" name="displayName" />
                        <div style={{ justifyContent: "space-between" }} className="flexBoxRowGrow">
                            <label>Module Code</label>
                            <div className="formButton" onClick={handleFileClick}>
                                <p>{!isSelected ? "Upload A File" : selectedFile.name}</p>
                                <input type="file" accept=".zip" id="pluginFile" name="fileToUpload" onChange={changeFile} hidden />
                            </div>
                        </div>
                        <label>Module Password</label>
                        <div style={{ display: "flex", flexDirection: "row" }}>
                            <input className="uploadInput" type={visible ? "text" : "password"} id="modulePass" name="modulePass" />
                            <div onClick={() => setVisible(!visible)}>
                                {visible ? <img className="visible-icon" src="/icons/visible.png" /> : <img className="visible-icon" src="/icons/invisible.png" />}
                            </div>
                        </div>
                        {isSelected ?
                            (<div>
                                <p>Filename: {selectedFile.name}</p>
                                <p>Filetype: {selectedFile.type}</p>
                                <p>Size in bytes: {selectedFile.size}</p>
                            </div>) : (
                                <p> </p>
                            )}
                </div>
                <label>Module Password</label>
                <input className="uploadInput" type="password" id="modulePass" name="modulePass" />
                {isSelected ? 
                (<div>
                    <p>Filename: {selectedFile.name}</p>
                    <p>Filetype: {selectedFile.type}</p>
                    <p>Size in bytes: {selectedFile.size}</p>
                </div>) : (
                    <p> </p>
                )}
                <label>Update?</label>
                <input type="checkbox" id="update" />
            </form >
        <div className="flexBoxRowGrow" style={{ justifyContent: "center" }}>
            <button className="primaryButton" onClick={uploadPlugin}>Submit</button>
        </div>
        </div >
        </div >
    )
};