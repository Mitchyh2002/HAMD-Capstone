import react, {useState} from "react";
import axios from "axios";


export default function Upload(props){

    const [selectedFile, setSelectedFile] = useState();
    const [isSelected, setIsSelected] = useState(false);
    const [response, setResponse] = useState();

    const changeFile = (event) => {
        setSelectedFile(event.target.files[0]);
        setIsSelected(true);
    };

    const uploadPlugin = () => {
        const formData = new FormData();
        formData.append("file", selectedFile)

        fetch("http://localhost:5000/module/upload", {
            method: "POST",
            body: formData,
        }).then((response) => {
            setResponse(response.data);
            console.log(response.data);
        }).catch(function (error) {
             console.log(error);
        })
    };


    return(
        <div>
            <h1>Upload</h1>
            <input type="file" id="pluginFile" name="PluginFile" onChange={changeFile}/> 
            {isSelected ? 
            (<div>
                <p>Filename: {selectedFile.name}</p>
				<p>Filetype: {selectedFile.type}</p>
				<p>Size in bytes: {selectedFile.size}</p>
            </div>) : (
                <p>Select A File</p>
            )};
            <button onClick={uploadPlugin}>Submit</button>
        </div>
    )
};