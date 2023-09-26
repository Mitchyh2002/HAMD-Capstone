import Header from "Components/Header"
import { Link } from "react-router-dom"
import { useState } from "react";
import { checkPass } from "./Login";
import { baseUrl } from "config";

export default function ChangePassword() {
    const accountButton = <Link to="/Account">Account</Link>;
    const logoutButton = "Logout";

    const changed = false;

    return(<>
        <Header accountButton={accountButton} logoutButton={logoutButton}/>
        <div className="mainContainerCentre" style={{flexDirection: "column", height: "100vh", width: "100vw", flexWrap: "wrap", justifyContent: "flex-start", paddingTop: "100px"}}>
            <div className="flexBoxGrow" style={{maxWidth: "65%"}}>
                <div className="subNav" style={{ borderRadius: "20px 20px 0px 0px", display: "flex", justifyContent: "center", alignItems: "center", height: "70px" }}>
                    <h3>{changed ? "Password Changed" : "Change Password"}</h3>
                </div>
                <div style={{ justifyContent: "center"}}>
                    changed ?
                        <p>You have successfully changed your password! Please click below to navigate to home</p>
                        <Link
                            to="/Home">
                            <button className="formButton home-button">Home</button>
                        </Link>
                        : 
                        <ChangePasswordForm />
                </div>
            </div>
        </div>
    </>)
}

function ChangePasswordForm() {
    const [currentPassError, setCurrentPassError] = useState();
    const [new1PassError, setNew1PassError] = useState();
    const [new2PassError, setNew2PassError] = useState();
    const [confPassError, setConfPassError] = useState();
    const [loading, setLoading] = useState(false);

    const validateForm = (formData) => {
        setCurrentPassError(checkPass(formData.get("currentPassword")))
        setNew1PassError(checkPass(formData.get("newPassword")))
        setNew2PassError(checkPass(formData.get("confPassword")))
        setConfPassError(comparePass(formData.get("newPassword"), formData.get("confPassword")))
    
        let valid = true;

        if (currentPassError || new1PassError || new2PassError || confPassError) {
            valid = false;
        }

        return (valid)
    }
}

const handleChange = (e) => {
    setLoading(true);
    const form = document.getElementById("Change Password");
    const formData = new FormData(form);

    const valid = validateForm(formData);
    if (valid) {
        fetch(baseUrl + "/mst/user/changePassword", {
            method: "POST",
            body: formData,
        }).then(response => (response.json()
        )).then((response) => {
            if (response.Success == true) {
                console.log(response)
                changed = true;
            }
        })
    }
}

export function comparePass(newPass1, newPass2) {
    try {
        if (newPass1 !== newPass2) {
            return "Passwords do not match.";
        }
    } catch {

    }
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