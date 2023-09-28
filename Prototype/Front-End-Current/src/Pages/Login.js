import Header from "Components/Header";
import './Login.css';
import { login } from "Functions/User";
import { Link } from "react-router-dom";
import { useState } from "react";
import { baseUrl } from "config";

export default function Login(props) {
    const register = props.register;
    const [email, setEmail] = useState();
    const [forgotPassword, setForgotPassword] = useState();

    return (
        <>
            <Header />
            <div className="maindiv">
                <WelcomeMessage />
                <div className="thirddiv">
                    <div className="form-header">
                        <img className="bee-image" alt="small-bee-image" />
                        <h3>{register ? "Create Account" : "Sign In"}</h3>
                    </div>
                    {forgotPassword ? <ForgotPasswordForm setForgotPassword={setForgotPassword} /> :
                        email ? <EmailConfirmation email={email} /> :
                            register ?
                                <RegisterForm setEmail={setEmail} /> : <LoginForm setForgotPassword={setForgotPassword} />}
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
            <div><img className="login-image" alt="login-image" /></div>
            <h2 className="welcome-text">Welcome to <br />Bee Aware</h2>
        </div>
    )
}

//Login Form
function LoginForm(props) {
    const [emailError, setEmailError] = useState();
    const [passError, setPassError] = useState();
    const [response, setResponse] = useState();

    const validateForm = (formData) => {
        setEmailError(checkEmailValid(formData.get("email")));
        setPassError(checkPass(formData.get("password")));

        let valid = true;

        if (emailError) {
            valid = false;
        }

        if (passError) {
            valid = false;
        }

        return (valid)

    }

    const handleLogin = async (e) => {
        const form = document.getElementById("Login");
        const formData = new FormData(form);

        const valid = validateForm(formData);
        if (valid) {
            setResponse(await login(formData));
            console.log(response);
            //window.alert(await response);
        }
    }

    return (
        <>
            <form className="login-form" id="Login">
                <div className="login-form-content">
                    <FormInput
                        type="text"
                        name="email"
                        placeholder="Email Address"
                        error={emailError}
                    />
                    <FormInput
                        type="password"
                        name="password"
                        className="password"
                        placeholder="Password"
                        error={passError}
                    />
                    <p>
                        <Link
                            className="forgot-password"
                            onClick={() => props.setForgotPassword(true)}>
                            Forgot your password?
                        </Link>
                    </p>
                </div>
            </form>

            <div className="flexBoxRowGrow" style={{ justifyContent: "center" }}>
                <Link
                    to="/Home">
                    <button className="primaryButton sign-in-button" onClick={handleLogin}>Sign In</button>
                </Link>
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

        if (!emailErr)
            {
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
                        window.alert(response.error)
                    }
                    setLoading(false);
                })
            }
        }
        return (<>
            {submitted ?
                <p>If your email is registered, then please check your email for a link to reset your password</p>
                : <form className="login-form" id="Forgot">
                    <div className="login-form-content">
                        <FormInput
                            label="Email"
                            error={emailError}
                            type="email"
                            name="email"
                            className="emailAddress"
                            placeholder="Email Address"
                        />
                    </div>
                </form>}
            <div className="flexBoxRowGrow" style={{ justifyContent: "center" }}>
                {submitted ?
                    <button className="primaryButton sign-in-button" onClick={() => props.setForgotPassword(false)}>Return to Login</button>
                    :
                    <button className="primaryButton sign-in-button" onClick={handleForgot} disabled={loading}>Confirm</button>
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

        const validateForm = (formData) => {
            setNameError(checkName(formData.get("firstName")));
            setEmailError(checkEmailValid(formData.get("email")));
            setDobError(checkDOB(formData.get("dateOfBirth")));
            setPassError(checkPass(formData.get("password")));

            let valid = true;

            if (nameError) {
                valid = false;
            }

            if (emailError) {
                valid = false;
            }

            if (dobError) {
                valid = false;
            }

            if (passError) {
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
                        window.alert(response.error)
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
                        <FormInput
                            label="Password"
                            error={passError}
                            type="password"
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

    function EmailConfirmation(props) {
        function handleResend() {
            //resend props.email to endpoint
        }
        return (
            <div>
                <p>
                    Thank you for signing up. Please confirm your email address to get started.
                </p>
            </div>
        )
    }

    /*        <div className="flexBoxRowGrow" style={{ justifyContent: "center" }}>
    <button className="primaryButton sign-in-button" onClick={handleResend}>Resend</button>
    </div>*/

    //Validation Functions
    export function checkEmailValid(email) {
        const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const checkValid = new RegExp(regEx);

        if (email == "") {
            return "Email address is required.";
        } else if (!checkValid.exec(email)) {
            return "Please check the email format";
        }
    }

    export function checkDOB(dob) {
        const currentDate = new Date();
        if (!dob) {
            return "Year of Birth can't be empty";
        } else if (dob > currentDate.getFullYear() - 13) {
            return "You need to be over 13";
        }

    }

    export function checkName(name) {
        if (!name) {
            return "Name is required.";
        }
    }

    export function checkPass(pass) {
        if (!pass) {
            return "Password is required."
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
                    />
                    <p style={{ color: "red" }}>{props.error}</p>
                </div>
            </div>
        )
    }