import react, {useRef, useState} from "react";
import axios from "axios";
import "./admin.css";


export default function Upload(props){

    const [selectedFile, setSelectedFile] = useState();
    const [isSelected, setIsSelected] = useState(false);
    const [response, setResponse] = useState();
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);

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

        fetch("http://localhost:5000/module/upload", {
            method: "POST",
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


    return(
        <div style={{display: "flex", justifyContent: "center", alignContent: "center", flexGrow: "1"}}>
        <div className="flexBoxColumnGrow" style={{padding: "32px", maxWidth: "500px"}}>
            <div className="subNavHighlight" style={{borderRadius: "20px 20px 0px 0px", display: "flex", justifyContent: "center", alignItems: "center", height: "70px"}}>
                <h3>Add Plugin</h3>
            </div>
            <form id="upload">
                <div style={{display: "flex", flexDirection: "column", rowGap:"8px"}}>
                {(success == true)? <p>Your files has been uploaded and installed</p> : (error)&& <p>{response.Message}</p>}
                <label>Module Prefix</label>
                <input className="uploadInput" type="text" id="prefixName" name="prefixName" />
                <label>Plugin Display Name</label>
                <input className="uploadInput" type="text" id="pluginDisplayName" name="displayName" />
                <div className="flexBoxRow" style={{justifyContent: "space-between"}}>
                    <label>Module Code</label>
                    <div className="formButton" onClick={handleFileClick}>
                        <p>{!isSelected ? "Upload A File" : selectedFile.name}</p>
                        <input type="file" accept=".zip" id="pluginFile" name="fileToUpload" onChange={changeFile} hidden/>
                    </div>
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
                </div>
            </form>
            <div className="flexBoxRowGrow" style={{justifyContent: "center"}}>
                <button className="primaryButton" onClick={uploadPlugin}>Submit</button>
            </div>
        </div>
        </div>
    )
};