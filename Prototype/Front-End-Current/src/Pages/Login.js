import Header from "Components/Header";
import './Login.css';
import { login } from "Functions/User";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Login(props) {
    const register = props.register;

    return (
        <>
            <Header />
            <div className="maindiv">
                <WelcomeMessage />
                <div className="thirddiv">
                    <div className="form-header">
                    <img className="bee-image" src="/bee3.png" alt="small-bee-image" />
                        <h3>{register ? "Create Account" : "Sign In"}</h3>
                    </div>
                    {register ?
                        <RegisterForm /> : <LoginForm />}
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
            <div><img className="login-image" src="/login-image.jpg" alt="bee-on-flower" /></div>
            <h2 className="welcome-text">Welcome to<br /> Bee Aware</h2>
        </div>
    )
}

//Login Form
function LoginForm() {

    const [response, setResponse] = useState();

    const handleLogin = async (e) => {
        const form = document.getElementById("Login");
        const formData = new FormData(form);
        setResponse(await login(formData));

        console.log(response)
        //window.alert(await response);

        /* Catch email errors 
        const message = document.getElementById("email-error");
        message.innerHTML = "";
        let x = document.getElementById("emailInput").value;
        try { 
          if(x.trim() == "") throw "Email address required.";
        }
        catch(err) {
          message.innerHTML = err;
        }*/

        /* Catch password errors 
        const message2 = document.getElementById("password-error");
        message2.innerHTML = "";
        let y = document.getElementById("passwordInput").value;
        try { 
          if(y.trim() == "") throw "Password required.";
        }
        catch(err) {
          message2.innerHTML = err;
        }*/

    }

    return (
        <>
            <form className="login-form" id="Login">
                <div className="login-form-content">
                    <div className="login-form-group">
                        <input
                            id="emailInput"
                            type="email"
                            name="email"
                            placeholder="Email Address"
                        />
                        <p id="email-error"></p>
                    </div>
                    <div className="login-form-group">
                        <input
                            id="passwordInput"
                            type="password"
                            name="password"
                            placeholder="Password"
                        />
                        <p id="password-error"></p>
                    </div>
                    <p>
                        <Link
                            to="#!"
                            className="forgot-password">
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
                <p style={{fontSize: "14px"}}>Don't have an account?</p>
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

//Registration Form
function RegisterForm() {
    const [nameError, setNameError] = useState();
    const [emailError, setEmailError] = useState();
    const [dobError, setDobError] = useState();
    const [passError, setPassError]  = useState();

    const validateFrom = (formData) =>{
        setNameError(checkName(formData.get("firstName")));
        setEmailError(checkEmailValid(formData.get("email")));
        setDobError(checkDOB(formData.get("dateOfBirth")));
        setPassError(checkPass(formData.get("password")));
        let error = false;

        if (nameError) {
            error = true;
        }

        if(emailError){
            error = true;
        }

        if(dobError){
            error = true;
        }

        if(passError){
            error = true;
        }

    }

    //const navigate = useNavigate();
    const handleRegister = (e) => {
        const form = document.getElementById("Register");
        const formData = new FormData(form);

        const valid = validateFrom(formData);
        if(valid){
            fetch("http://localhost:5000/user/register", {
                method: "POST",
                body: formData,
            }).then(response => (response.json()
            )).then((response) => {
                if (response.Success == true) {
                    window.alert("Success!!!")
                }else{
                    console.log(response)
                    window.alert(response.error)
                }
            }
            ).catch(function (error) {
                console.log(error);
            })
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
                            error = {nameError}
                        />
                    <FormInput
                            label="D.O.B"
                            error={dobError}
                            type="number"
                            min="1910"
                            max="2099"
                            name="dateOfBirth"
                            placeholder="Birth Month"
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
                <button className="primaryButton sign-in-button" onClick={handleRegister}>Register</button>
            </div>
            <div className="flexBoxRowGrow" style={{ justifyContent: "center", paddingTop: "20px"}}>
                <p style={{fontSize: "14px"}}>
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
function checkEmailValid(email){
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const checkValid = new RegExp(regEx);

    if (email == "") {
        return "Email address is required.";
    } else if(!checkValid.exec(email)){
        return "Please check the email format";
    }
}

function checkDOB(dob){
    const currentDate = new Date();
        if (!dob) {
            return "D.O.B is required.";
        } else if(dob > currentDate.getFullYear() - 13){
            return "You need to be over 13";
        }
}

function checkName(name){
    if(!name){
        return "Name is required.";
    }
}

function checkPass(pass) {
    if(!pass){
        return "Password is required."
    }
}

function FormInput(props){
    return(
        <div className="form-group">
        <label>{props.label}</label>
        <div>
            <input
                type={props.type}
                name={props.name}
                className={props.class}
                placeholder={props.placeholder}
            />
            <p style={{color: "red"}}>{props.error}</p>
        </div>
    </div>
    )
}