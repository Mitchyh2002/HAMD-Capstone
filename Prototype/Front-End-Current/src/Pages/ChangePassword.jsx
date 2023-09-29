import Header from "Components/Header"
import { Link } from "react-router-dom"
import { useState } from "react";
import { checkPass, FormInput } from "./Login";
import { baseUrl } from "config";
import { getToken } from "Functions/User";

export default function ChangePassword(props) {
    const [changed, setChanged] = useState(props.changed);

    return (<>
        <div className="mainContainerCentre" style={{ flexDirection: "column", height: "100vh", flexWrap: "wrap", justifyContent: "flex-start", paddingTop: "100px" }}>
            <div className="flexBoxGrow" style={{ maxWidth: "65%" }}>
                <div className="subNav" style={{ borderRadius: "10px 10px 0px 0px", display: "flex", justifyContent: "center", alignItems: "center", height: "70px" }}>
                    <h3>{changed ? "Password Changed" : "Change Password"}</h3>
                </div>
                <div style={{ justifyContent: "center", display: 'flex', flexDirection: 'column' }}>
                    {changed ? (
                        <div>
                            <p>You have successfully changed your password! Please click below to navigate to home</p>
                            <Link
                                to="/Home">
                                <button className="formButton home-button">Home</button>
                            </Link>
                        </div>
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
    const [visibleCurrent, setVisibleCurrent] = useState(false);
    const [visibleNew, setVisibleNew] = useState(false);
    const [visibleConfirm, setVisibleConfirm] = useState(false);

    const validateForm = (formData) => {
        setCurrentPassError(checkPass(formData.get("currentPassword")))
        setNew1PassError(checkPass(formData.get("newPassword")))
        setNew2PassError(checkPass(formData.get("confPassword")))
        setConfPassError(comparePass(formData.get("newPassword"), formData.get("confPassword")))

        let valid = true;

        if (currentPassError || new1PassError || new2PassError || confPassError) {
            valid = false;
        }

        if (new2PassError && confPassError) {
            setConfPassError(null); // Clear the second error
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
                    window.alert(response.error)
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
                <div style={{ display: "flex", flexDirection: "row" }}>
                    <FormInput
                        label="Current Password"
                        error={currentPassError}
                        type={visibleCurrent ? "text" : "password"}
                        name="currentPassword"
                        placeholder="Current Password"
                    />
                    <div className="visible-icon" onClick={() => setVisibleCurrent(!visibleCurrent)}>
                        {visibleCurrent ? <img className="visible-icon" src="/icons/visible.png" /> : <img className="visible-icon" src="/icons/invisible.png" />}
                    </div>
                </div>
                <div style={{ display: "flex", flexDirection: "row" }}>
                    <FormInput
                        label="New Password"
                        error={new1PassError}
                        type={visibleNew ? "text" : "password"}
                        name="newPassword"
                        placeholder="New Password"
                    />
                    <div className="visible-icon" onClick={() => setVisibleNew(!visibleNew)}>
                        {visibleNew ? <img className="visible-icon" src="/icons/visible.png" /> : <img className="visible-icon" src="/icons/invisible.png" />}
                    </div>
                </div>
                <div style={{ display: "flex", flexDirection: "row" }}>
                    <FormInput
                        label="Re-enter New Password"
                        error={[new2PassError, confPassError]}
                        type={visibleConfirm ? "text" : "password"}
                        name="confPassword"
                        placeholder="Confirm New Password"
                    />
                    <div className="visible-icon" onClick={() => setVisibleConfirm(!visibleConfirm)}>
                        {visibleConfirm ? <img className="visible-icon" src="/icons/visible.png" /> : <img className="visible-icon" src="/icons/invisible.png" />}
                    </div>
                </div>
            </div>
        </form>

        <div className="flexBoxRowGrow" style={{ justifyContent: "center" }}>
            <button className="primaryButton sign-in-button" onClick={handleChange} disabled={loading}>Change Password</button>
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
