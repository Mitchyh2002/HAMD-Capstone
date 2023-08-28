import React, { useState } from 'react';
import "./admin.css";

export default function AddUser(){
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
                        <input className="uploadInput" type="text" id="firstName" name="firstName" />
                        <label>DOB</label>
                        <input className="uploadInput" type="number" min="1910" max="2099" id="dob" name="dob" />
                        <label>Email</label>
                        <input className="uploadInput" type="text" id="email" name="email" />
                        <label>Phone Number</label>
                        <input className="uploadInput" type="text" id="phone" name="phone" />
                        <label>Password</label>
                        <input className="uploadInput" type="password" id="password" name="password" />
                    </div>
                </form>
                <div className="flexBoxRowGrow" style={{ justifyContent: "center" }}>
                    <button className="primaryButton">Add User</button>
                </div>
            </div>
        </div>
        </>
    )
}