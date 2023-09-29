import Header from "Components/Header"
import { Link, useParams } from "react-router-dom"
import { useState } from "react";
import { checkPass, FormInput } from "./Login";
import { baseUrl } from "config";

export default function ResetPassword() {
    const [changed, setChanged] = useState();
    const { id } = useParams();

    return (<>
        <Header />
        <div className="mainContainerCentre" style={{ flexDirection: "column", height: "100vh", width: "100vw", flexWrap: "wrap", justifyContent: "flex-start", paddingTop: "100px" }}>
            <div className="flexBoxGrow" style={{ maxWidth: "65%" }}>
                <div className="subNav" style={{ borderRadius: "20px 20px 0px 0px", display: "flex", justifyContent: "center", alignItems: "center", height: "70px" }}>
                    <h3>{changed ? "Password Changed" : "Change Password"}</h3>
                </div>
                <div style={{ justifyContent: "center" }}>
                    {changed ? (
                        <div>
                            <p>You have successfully changed your password! Please click below to login</p>
                            <Link
                                to="/Home">
                                <button className="formButton home-button">Login</button>
                            </Link>
                        </div>
                    ) : (
                        <ChangePasswordForm setChanged={setChanged} id={id} />
                    )}
                </div>
            </div>
        </div>
    </>)
}

function ChangePasswordForm(props) {
    const [new1PassError, setNew1PassError] = useState();
    const [new2PassError, setNew2PassError] = useState();
    const [confPassError, setConfPassError] = useState();
    const [loading, setLoading] = useState(false);


    const validateForm = (formData) => {
        setNew1PassError(checkPass(formData.get("newPassword")))
        setNew2PassError(checkPass(formData.get("confPassword")))
        setConfPassError(comparePass(formData.get("newPassword"), formData.get("confPassword")))

        let valid = true;

        if (new1PassError || new2PassError || confPassError) {
            valid = false;
        }

        if (new2PassError && confPassError) {
            setConfPassError(null); // Clear the second error
        }

        return (valid)
    }

    const handleChange = (e) => {
        setLoading(true);
        const form = document.getElementById("Reset Password");
        const formData = new FormData(form);

        const valid = validateForm(formData);
        if (valid) {
            fetch(baseUrl + "/mst/user/resetPassword/" + props.id, {
                method: "POST",
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
        <form className="password-form" id="Reset Password">
            <div className="password-form-content">
                    <FormInput
                        label="New Password"
                        error={new1PassError}
                        type={"password"}
                        name="password"
                        placeholder="New Password"
                    />
                    <FormInput
                        label="Confirm New Password"
                        error={[new2PassError, confPassError]}
                        type={"password"}
                        name="confPassword"
                        placeholder="Confirm New Password"
                    />
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
