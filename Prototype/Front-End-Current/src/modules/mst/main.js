import react, {useState} from "react";
import axios from "axios";


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
        <div style={{display: "flex", justifyContent: "center", alignContent: "center"}}>
        <div style={{padding: "32px 180px 180px", maxWidth: "400px"}}>
            <h1>Upload</h1>
            <form id="upload">
                <div style={{display: "flex", flexDirection: "column"}}>
                {(success == true)? <p>Your filles has been uploaded and installed</p> : (error)&& <p>{response.Message}</p>}
                <label>Module Prefix</label>
                <input type="text" id="prefixName" name="prefixName" />
                <label>Plugin Display Name</label>
                <input type="text" id="pluginDisplayName" name="displayName" />
                <label>Module Code</label>
                <input type="file" id="pluginFile" name="fileToUpload" onChange={changeFile}/>
                <label>Module Password</label>
                <input type="password" id="modulePass" name="modulePass" />
                {isSelected ?
                (<div>
                    <p>Filename: {selectedFile.name}</p>
                    <p>Filetype: {selectedFile.type}</p>
                    <p>Size in bytes: {selectedFile.size}</p>
                </div>) : (
                    <p>Select A File</p>
                )}
                </div>
            </form>
                <button onClick={uploadPlugin}>Submit</button>
        </div>
        </div>
    )
};