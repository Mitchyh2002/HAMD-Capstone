import React, { useState } from 'react';
import { ToolTip } from "./Components";
import "./admin.css";

export default function Configure() {
    const [selectedFile, setSelectedFile] = useState();
    const [isSelected, setIsSelected] = useState(false);

    return (
        <>
            <div style={{ display: "flex", justifyContent: "center", alignContent: "center", flexGrow: "1" }}>
                <div className="flexBoxColumnGrow" style={{ padding: "32px", maxWidth: "500px" }}>
                    <div className="subNav" style={{ borderRadius: "20px 20px 0px 0px", display: "flex", justifyContent: "center", alignItems: "center", height: "70px" }}>
                        <h3>Platform Configuration</h3>
                    </div>
                    <form id="upload">
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <FormInput
                                tooltipText="This font will be used for the welcome message, and page headers."
                                className="uploadInput"
                                label="Font 1"
                                type="text"
                                id="font1"
                                name="font1"
                            />
                            <FormInput
                                tooltipText="This font will be used for all other text."
                                className="uploadInput"
                                label="Font 2"
                                type="text"
                                id="font2"
                                name="font2"
                            />
                            <FormInput
                                tooltipText="This colour will be used for the header and some form buttons."
                                className="uploadInput"
                                label="Header Colour"
                                type="text"
                                id="headerColour"
                                name="headerColour"
                            />
                            <FormInput
                                tooltipText="This colour will be used for the main navigation bar, and on some buttons."
                                className="uploadInput"
                                label="Nav Bar Colour"
                                type="text"
                                id="navbarColour"
                                name="navbarColour"
                            />
                            <FormInput
                                tooltipText="This colour will be used for the sub navigation bar, and form headers."
                                className="uploadInput"
                                label="Sub Nav Colour"
                                type="text"
                                id="subnavColour"
                                name="subnavColour"
                            />
                            <FormInput
                                tooltipText="This text will be displayed on the login and register pages to welcome visitors."
                                className="uploadInput"
                                label="Welcome Text"
                                type="text"
                                id="welcomeText"
                                name="welcomeText"
                            />
                            <UploadImage
                                tooltipText="This logo image will appear in the header bar. Please upload a png file only."
                                label="Logo Image"
                                className="formButton"
                                buttonName="Upload Image"
                                type="file"
                                accept=".png"
                                id="logoImage"
                                name="logoImage"
                            />
                            <UploadImage
                                tooltipText="This image will be displayed on the login and register pages. Please upload a jpg file only."
                                label="Login Image"
                                className="formButton"
                                buttonName="Upload Image"
                                type="file"
                                accept=".jpg"
                                id="loginImage"
                                name="loginImage"
                            />
                            <UploadImage
                                tooltipText="This image will be displayed on the landing page. Please upload a jpg file only."
                                label="Landing Page Image"
                                className="formButton"
                                buttonName="Upload Image"
                                type="file"
                                accept=".jpg"
                                id="landingImage"
                                name="landingImage"
                            />
                        </div>
                    </form>
                    <div className="flexBoxRowGrow" style={{ justifyContent: "center" }}>
                        <button className="primaryButton">Apply</button>
                    </div>
                </div>
            </div>
        </>
    )
}

function FormInput(props) {
    return (
        <div className="form-group">
            <label style={{ display: "flex", flexDirection: "row" }}>
                {props.label}
                <ToolTip text={props.tooltipText}>
                    <img
                        className="tooltipIcon"
                        alt="tooltipIcon"
                        src="/Icons/info.png"
                        style={{ paddingLeft: "10px" }}
                    />
                </ToolTip>
            </label>
            <div>
                <input
                    className={props.class}
                    type={props.type}
                    id={props.id}
                    name={props.name}
                    placeholder={props.placeholder}
                />
                <p style={{ color: "red" }}>{props.error}</p>
            </div>
        </div>
    )
}

function UploadImage(props) {
    return (
        <div style={{ justifyContent: "space-between", paddingTop: "20px" }} className="flexBoxRowGrow">
            <label style={{ display: "flex", flexDirection: "row" }}>
                {props.label}
                <ToolTip text={props.tooltipText}>
                    <img
                        className="tooltipIcon"
                        alt="tooltipIcon"
                        src="/Icons/info.png"
                        style={{ paddingLeft: "10px" }}
                    />
                </ToolTip>
            </label>
            <div className={props.className}>
                <p> {props.buttonName} </p>
                <input
                    type={props.type}
                    accept={props.accept}
                    id={props.id}
                    name={props.name}
                    hidden
                />
                <p style={{ color: "red" }}>{props.error}</p>
            </div>
        </div>
    )
}