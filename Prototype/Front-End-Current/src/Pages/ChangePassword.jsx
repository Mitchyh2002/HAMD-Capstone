import Header from "Components/Header"
import { Link } from "react-router-dom"
import { useState, useEffect } from "react";
import { checkPass, FormInput } from "./Login";
import { baseUrl } from "config";
import { getToken } from "Functions/User";
import { ChangePasswordErrors } from "errorCodes";

export default function ChangePassword(props) {
    const [changed, setChanged] = useState(props.changed);

    return (<>
        <div className="mainContainerCentre" style={{ flexDirection: "column", height: "100vh", flexWrap: "wrap", justifyContent: "flex-start", paddingTop: "100px" }}>
            <div className="flexBoxGrow" style={{ maxWidth: "65%" }}>
                <div className="subNav" style={{ borderRadius: "10px 10px 0px 0px", display: "flex", justifyContent: "center", alignItems: "center", height: "70px" }}>
                    <h3>{changed ? "Password Changed" : "Change Password"}</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: "center", justifyContent: "center" }}>

                    {changed ? (<>
                        <p>You have successfully changed your password! Please click below to go back.</p>
                        <Link
                            to="/home/account">
                            <button className="formButton change-password-button">Back</button>
                        </Link>
                    </>
                    ) : (
                        <ChangePasswordForm setChanged={setChanged} />
                    )}
                </div>
            </div>
        </div>
    </>)
}

function ChangePasswordForm(props) {
    const [currentPassError, setCurrentPassError] = useState();
    const [new1PassError, setNew1PassError] = useState();
    const [new2PassError, setNew2PassError] = useState();
    const [confPassError, setConfPassError] = useState();
    const [loading, setLoading] = useState(false);

    const [response, setResponse] = useState(null);

    useEffect(() => {
        console.log(response);
    }, [response]);

    const validateForm = (formData) => {
        const currPass = checkPass(formData.get("currentPassword"));
        const newPass1 = checkPass(formData.get("newPassword"));
        const newPass2 = checkPass(formData.get("confPassword"));
        const newConf = comparePass(formData.get("newPassword"), formData.get("confPassword"));

        setCurrentPassError(currPass);
        setNew1PassError(newPass1);
        setNew2PassError(newPass2);
        setConfPassError(newConf);

        let valid = true;

        if (currPass || newPass1 || newPass2 || newConf) {
            valid = false;
        }

        if (newPass2 && newConf) {
            setConfPassError(null); // Clear the second error so only one is displayed
        }

        return (valid)
    }

    const handleChange = (e) => {
        setLoading(true);
        const form = document.getElementById("Change Password");
        const formData = new FormData(form);

        const valid = validateForm(formData);
        if (valid) {
            fetch(baseUrl + "/mst/user/changePassword", {
                method: "POST",
                headers: {
                    'Authorization': "Bearer " + getToken(),
                },
                body: formData,
            }).then(response => (response.json()
            )).then((response) => {
                if (response.Success == true) {
                    console.log(response)
                    props.setChanged(true);
                } else {
                    console.log(response);
                    setResponse(response);
                    //window.alert(response.error)
                }
                setLoading(false);
            }).catch(function (error) {
                console.log(error);
                setLoading(false);
            })
        } else {
            setLoading(false);
        }
    }
    return (<>
        <form className="password-form" id="Change Password" style={{ width: '65vh' }}>
            <div className="password-form-content">
                <FormInput
                    label="Current Password"
                    error={currentPassError}
                    type={"password"}
                    name="currentPassword"
                />
                {response && [ChangePasswordErrors.passwordWrong].includes(response.StatusCode)
                    && (
                        <div className="error-message">
                            {response.Message}
                        </div>
                    )}
                <FormInput
                    label="New Password"
                    error={new1PassError}
                    type={"password"}
                    name="newPassword"
                />
                <FormInput
                    label="Confirm New Password"
                    error={[new2PassError, confPassError]}
                    type={"password"}
                    name="confPassword"
                />

            </div>
        </form>

        <div className="flexBoxRowGrow" style={{ justifyContent: "center" }}>
            <button className="primaryButton sign-in-button" onClick={handleChange} disabled={loading}>Change Password</button>
        </div>
        <div className="flexBoxRowGrow" style={{ justifyContent: "center", marginTop: "30px" }}>
            <Link
                to="/home/account">
                <button className="formButton change-password-button">Back</button>
            </Link>
        </div>

    </>)
}

export function comparePass(newPass1, newPass2) {
    try {
        if (newPass1 !== newPass2) {
            return "Passwords do not match.";
        }
    } catch {

    }
}
