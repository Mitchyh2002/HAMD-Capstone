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
                                tooltipText="This font will be used for the welcome message, and page headers. A serif font will work best here. Please enter font name. E.g. 'Merriweather'."
                                className="uploadInput"
                                label="Font 1"
                                type="text"
                                id="font1"
                                name="font1"
                            />
                            <FormInput
                                tooltipText="This font will be used for all other text. A sans serif font will work best here. Please enter font name. E.g. 'Lato'."
                                className="uploadInput"
                                label="Font 2"
                                type="text"
                                id="font2"
                                name="font2"
                            />
                            <FormInput
                                tooltipText="This colour will be used for the header and some form buttons. Please choose a colour that works well with black text. Enter hex code only. E.g. #FFFFFF"
                                className="uploadInput"
                                label="Header Colour"
                                type="text"
                                id="headerColour"
                                name="headerColour"
                            />
                            <FormInput
                                tooltipText="This colour will be used for the main navigation bar, and on some buttons. Please choose a colour that works well with black and white text. Enter hex code only. E.g. #FFFFFF"
                                className="uploadInput"
                                label="Nav Bar Colour"
                                type="text"
                                id="navbarColour"
                                name="navbarColour"
                            />
                            <FormInput
                                tooltipText="This colour will be used for the sub navigation bar, and form headers. Please choose a colour that works well with black text. Enter hex code only. E.g. #FFFFFF"
                                className="uploadInput"
                                label="Sub Nav Colour"
                                type="text"
                                id="subnavColour"
                                name="subnavColour"
                            />
                            <FormInput
                                tooltipText="This text will be displayed on the login and register pages to welcome visitors.  E.g. 'Welcome to Bee Aware'."
                                className="uploadInput"
                                label="Welcome Text"
                                type="text"
                                id="welcomeText"
                                name="welcomeText"
                            />
                             <FormInput
                                tooltipText="This text will be displayed on the landing page. E.g. 'Bee Aware'."
                                className="uploadInput"
                                label="Website Name"
                                type="text"
                                id="websiteName"
                                name="websiteName"
                            />
                              <FormInput
                                tooltipText="Please enter the database connection URL in string format."
                                className="uploadInput"
                                label="Database URL"
                                type="text"
                                id="databaseURL"
                                name="databaseURL"
                            />
                            <UploadFile
                                tooltipText="This logo image will appear in the header bar. Please upload a .png file only."
                                label="Logo Image"
                                className="formButton"
                                buttonName="Upload Image"
                                type="file"
                                accept=".png"
                                id="logoImage"
                                name="logoImage"
                            />
                            <UploadFile
                                tooltipText="This image will be displayed on the login and register pages. Please upload a .jpg file only. A vertical image will work best here."
                                label="Login Image"
                                className="formButton"
                                buttonName="Upload Image"
                                type="file"
                                accept=".jpg"
                                id="loginImage"
                                name="loginImage"
                            />
                            <UploadFile
                                tooltipText="This image will be displayed on the landing page. Please upload a .jpg file only. A horizontal image will work best here."
                                label="Landing Page Image"
                                className="formButton"
                                buttonName="Upload Image"
                                type="file"
                                accept=".jpg"
                                id="landingImage"
                                name="landingImage"
                            />
                               <UploadFile
                                tooltipText="This file will be available for users of your website to download. Please upload a .txt file only."
                                label="Terms & Conditions"
                                className="formButton"
                                buttonName="Upload File"
                                type="file"
                                accept=".txt"
                                id="terms&conditions"
                                name="terms&conditions"
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

function UploadFile(props) {
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