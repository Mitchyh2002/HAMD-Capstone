import Header from "Components/Header";
import './Login.css';
import { login } from "Functions/User";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { baseUrl } from "config";
import { EmailConfirmation } from "Components/EmailConfirmation";
import { LoginErrors, RegisterErrors } from "errorCodes";
import { ToolTip } from "modules/mst/Components";

export default function Login(props) {
    const register = props.register;
    const [email, setEmail] = useState();
    const [forgotPassword, setForgotPassword] = useState();

    return (
        <>
        <div style={{maxHeight: "100vh", overflowY: "hidden", display: "flex", flexDirection: "column"}}>
            <Header />
            <div className="maindiv">
                <WelcomeMessage />
                <div className="thirddiv">
                    <div className="form-header">
                        <img className="bee-image" alt="small-bee-image" />
                        <h3>{register ? "Create Account" : forgotPassword ? "Forgot your Password" : "Sign In"}</h3>
                    </div>
                    {forgotPassword ? <ForgotPasswordForm setForgotPassword={setForgotPassword} /> :
                        email ? <EmailConfirmation email={email} /> :
                            register ?
                                <RegisterForm setEmail={setEmail} /> : <LoginForm setForgotPassword={setForgotPassword} refresh={props.refresh}/>}
                </div>
            </div>
            </div>
        </>
    )
}

//Components
//Welcome Message
function WelcomeMessage(props) {
    return (
        <div className="seconddiv">
            <div style={{display: "flex", flexGrow: 1, overflowY: "hidden"}}>
                <div>
                <img className="login-image" alt="login-image" />
                </div>
                <h2 className="welcome-text">Welcome to <br />Bee Aware</h2>
            </div>
        </div>
    )
}

//Login Form
function LoginForm(props) {
    const [response, setResponse] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        console.log(response);
    }, [response]);

    const handleLogin = async (e) => {
        const form = document.getElementById("Login");
        const formData = new FormData(form);
        const res = await login(formData);

        setResponse(res);

        if(res.Success){
            props.refresh(true);
            navigate("/home");
        }

    };

    return (
        <>
            <form className="login-form" id="Login">
                <div className="login-form-content">
                    <FormInput
                        type="text"
                        name="email"
                        placeholder="Email Address"
                    />
                    {response &&
                        [LoginErrors.emailEmpty, LoginErrors.emailInvalid, LoginErrors.emailUnregistered].includes(response.StatusCode)
                        && (
                            <div className="error-message">
                                {response.Message}
                            </div>
                        )}
                    <FormInput
                        type={"password"}
                        name="password"
                        className="password"
                        placeholder="Password"
                    />
                    {response && response.StatusCode == LoginErrors.passwordEmpty && (
                        <div className="error-message">
                            {response.Message}
                        </div>
                    )}
                    <p>
                        <Link
                            className="forgot-password"
                            onClick={() => props.setForgotPassword(true)}>
                            Forgot your password?
                        </Link>
                    </p>
                </div>
            </form>

            {response &&
                [LoginErrors.accountSuspended, LoginErrors.accountUncomfirmed, LoginErrors.passwordWrong].includes(response.StatusCode)
                && (
                    <div className="error-message">
                        {response.Message}
                    </div>
                )}
            <div className="flexBoxRowGrow" style={{ justifyContent: "center" }}>
                    <button className="primaryButton sign-in-button" onClick={handleLogin}>Sign In</button>
            </div>
            <div className="flexBoxRowGrow" style={{ justifyContent: "center", paddingTop: "20px" }}>
                <p style={{ fontSize: "14px" }}>Don't have an account?</p>
            </div>
            <div className="flexBoxRowGrow" style={{ justifyContent: "center" }}>
                <Link
                    to="/register">
                    <button className="primaryButton create-account-button">Create New Account</button>
                </Link>
            </div>
        </>
    )
}

//Reset Password Form
function ForgotPasswordForm(props) {
    const [submitted, setSubmitted] = useState();
    const [emailError, setEmailError] = useState();
    const [loading, setLoading] = useState(false);

    const validateForm = (formData) => {
        const emailErr = checkEmailValid(formData.get("email"));
        return emailErr;
    }

    const handleForgot = async (e) => {
        setLoading(true);
        const form = document.getElementById("Forgot");
        const formData = new FormData(form);

        const emailErr = validateForm(formData);
        setEmailError(emailErr);

        if (!emailErr) {
            fetch(baseUrl + "/mst/user/forgotPassword", {
                method: "POST",
                body: formData,
            }).then(response => (response.json()
            )).then((response) => {
                if (response.Success == true) {
                    setSubmitted(true);
                    console.log(response);
                } else {
                    console.log(response);
                    //window.alert(response.error)
                }
                setLoading(false);
            })
        } else { setLoading(false); }
    }
    return (<>
        {submitted ?
            <p>If your email is registered, then please check your email for a link to reset your password.</p>
            : <form className="login-form" id="Forgot">
                <div className="login-form-content">
                    <div className="form-group">
                        <label style={{ display: "flex", flexDirection: "row" }}>Email Address   <ToolTip text="Please enter your email address to receive a reset password email.">
                            <img
                                className="tooltipIcon"
                                alt="tooltipIcon"
                                src="/Icons/info.png"
                                style={{ paddingLeft: "10px" }}
                            />
                        </ToolTip></label>
                        <div>
                            <input
                                type="email"
                                name="email"
                                className="emailAddress"
                            />
                            <p className="error-message">{emailError}</p>
                        </div>
                    </div>
                </div>
            </form>}
        <div className="flexBoxColumnGrow" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            {submitted ?
                <button className="primaryButton sign-in-button" onClick={() => props.setForgotPassword(false)}>Return to Login</button>
                :
                <div>
                    <button className="primaryButton sign-in-button" onClick={handleForgot} disabled={loading}>Confirm</button>
                    <button className="formButton sign-in-button" onClick={() => props.setForgotPassword(false)} style={{ marginLeft: '45px' }}>Cancel</button>
                </div>
            }
        </div>
    </>)
}

//Registration Form
function RegisterForm(props) {
    const [nameError, setNameError] = useState();
    const [emailError, setEmailError] = useState();
    const [dobError, setDobError] = useState();
    const [passError, setPassError] = useState();
    const [loading, setLoading] = useState(false);

    const [response, setResponse] = useState(null);

    useEffect(() => {
        console.log(response);
    }, [response]);

    const validateForm = (formData) => {
        const isNameError = checkName(formData.get("firstName"));
        const isEmailError = checkEmailValid(formData.get("email"));
        const isDOBError = checkDOB(formData.get("dateOfBirth"));
        const isPassError = checkPass(formData.get("password"));

        setNameError(isNameError);
        setEmailError(isEmailError);
        setDobError(isDOBError);
        setPassError(isPassError);

        let valid = true;

        if (isNameError) {
            valid = false;
        }

        if (isEmailError) {
            valid = false;
        }

        if (isDOBError) {
            valid = false;
        }

        if (isPassError) {
            valid = false;
        }

        return (valid)

    }

    //const navigate = useNavigate();
    const handleRegister = (e) => {
        setLoading(true);
        const form = document.getElementById("Register");
        const formData = new FormData(form);

        const valid = validateForm(formData);
        if (valid) {
            fetch(baseUrl + "/mst/user/register", {
                method: "POST",
                body: formData,
            }).then(response => (response.json()
            )).then((response) => {
                if (response.Success == true) {
                    props.setEmail(formData.get("email"));
                } else {
                    console.log(response);
                    setResponse(response);
                }
                setLoading(false);
            }
            ).catch(function (error) {
                console.log(error);
                setLoading(false);
            })
        } else {
            setLoading(false);
        }
    }

    return (
        <>
            <form className="login-form" id="Register">
                <div className="login-form-content">
                    <FormInput
                        label="First Name"
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        error={nameError}
                    />
                    <FormInput
                        label="Birth Year"
                        error={dobError}
                        type="number"
                        min="1910"
                        max="2099"
                        name="dateOfBirth"
                        placeholder="Birth Year"
                    />

                    <FormInput
                        label="Email"
                        error={emailError}
                        type="email"
                        name="email"
                        className="emailAddress"
                        placeholder="Email Address"
                    />
                    {response && [RegisterErrors.emailTaken].includes(response.StatusCode)
                        && (
                            <div className="error-message">
                                {response.Message}
                            </div>
                        )}
                    <FormInput
                        label="Password"
                        error={passError}
                        type={"password"}
                        name="password"
                        className="password"
                        placeholder="Password"
                    />
                </div>
            </form>


            <div className="flexBoxRowGrow" style={{ justifyContent: "center" }}>
                <button className="primaryButton sign-in-button" onClick={handleRegister} disabled={loading}>Register</button>
            </div>
            <div className="flexBoxRowGrow" style={{ justifyContent: "center", paddingTop: "20px" }}>
                <p style={{ fontSize: "14px" }}>
                    Already have an account?
                </p>
            </div>
            <div className="flexBoxRowGrow" style={{ justifyContent: "center" }}>
                <Link
                    to="/login"
                    className="register-message"><button className="primaryButton create-account-button">Log In</button>
                </Link>
            </div>
        </>
    )
}



//Validation Functions
export function checkEmailValid(email) {
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const checkValid = new RegExp(regEx);

    if (email == "") {
        return "Email address is required.";
    } else if (!checkValid.exec(email)) {
        return "Please check the email format.";
    }
}

export function checkDOB(dob) {
    const currentDate = new Date();
    if (!dob) {
        return "Birth year is required.";
    } else if (dob > currentDate.getFullYear() - 13) {
        return "You need to be over 13";
    } else if (dob.length !== 4) {
        return "Invalid birth year.";
    }

}

export function checkName(name) {
    if (!name) {
        return "Name is required.";
    }
}

export function checkPass(pass) {
    if (!pass) {
        return "Password is required. "
    } else if (pass.length < 4) {
        return "Minimum password length of 4 characters."
    }
}

export function FormInput(props) {
    return (
        <div className="form-group">
            <label>{props.label}</label>
            <div>
                <input
                    type={props.type}
                    name={props.name}
                    className={props.class}
                    placeholder={props.placeholder}
                    defaultValue={props.value}
                />
                <p className="error-message">{props.error}</p>
            </div>
        </div>
    )
}
