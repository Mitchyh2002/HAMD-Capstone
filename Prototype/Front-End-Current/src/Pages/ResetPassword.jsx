import Header from "Components/Header"
import { useLoaderData, Link, useParams } from "react-router-dom"
import { useState } from "react";
import { checkPass, FormInput } from "./Login";
import { baseUrl } from "config";


export default function ResetPassword() {
    const response = useLoaderData();

    const [changed, setChanged] = useState();
    const { id } = useParams();

    return (<>
        <Header />
        <div className="mainContainerCentre" style={{ flexDirection: "column", height: "100vh", width: "100vw", flexWrap: "wrap", justifyContent: "flex-start", paddingTop: "100px" }}>
            <div className="flexBoxGrow" style={{ maxWidth: "65%" }}>
                <div className="subNav" style={{ borderRadius: "20px 20px 0px 0px", display: "flex", justifyContent: "center", alignItems: "center", height: "70px", width: "400px" }}>
                    <h3>{response.StatusCode == 200 ? changed ? "Password Changed" : "Change Password" : "Invalid Token"}</h3>
                </div>
                <div>
                    {response.StatusCode == 200 ? changed ? (
                        <div className="flexBoxColumnGrow" style={{ alignItems: "center" }}>
                            <p>You have successfully changed your password!</p>
                            <p>Please click below to login.</p>
                            <Link
                                to="/Home">
                                <button style={{ border: "none", marginTop: "20px" }} className="formButton home-button">Login</button>
                            </Link>
                        </div>
                    ) : (
                        <ChangePasswordForm setChanged={setChanged} id={id} />

                    ) : <p>The token provided is either invalid or expired</p>}
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
        const new1err = checkPass(formData.get("password"));
        const new2err = checkPass(formData.get("confPassword"));
        const confpasserr = comparePass(formData.get("password"), formData.get("confPassword"));

        setNew1PassError(new1err);
        setNew2PassError(new2err);
        setConfPassError(confpasserr);

        let valid = true;

        if (new1err || new2err || confpasserr) {
            valid = false;
        }

        if (new2err && confpasserr) {
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
        <form className="password-form" id="Reset Password">
            <div className="password-form-content">
                <FormInput
                    label="New Password"
                    error={new1PassError}
                    type={"password"}
                    name="password"
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
    </>)
}

function comparePass(newPass1, newPass2) {

    if (newPass1 !== newPass2) {
        console.log("made it here");
        return ("Passwords do not match.");
    }
}
