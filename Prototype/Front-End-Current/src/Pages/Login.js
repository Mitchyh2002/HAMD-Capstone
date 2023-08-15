import Header from "Components/Header";
import './Login.css';
import { login } from "Functions/User";
import { Link } from "react-router-dom";

export default function Login(props) {
    const register = props.register;

    return (
        <>
            <Header />
            <div className="maindiv">
                <WelcomeMessage />
                <div className="thirddiv">
                    <img className="bee-image" src="/bee3.png" alt="small-bee-image" />
                    <div className="form-header">
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

    const handleLogin = async (e) => {
        const form = document.getElementById("Login");
        const formData = new FormData(form);
        const response = login(formData)
        console.log(response)
        //window.alert(await response);

        /* Catch email errors */
        const message = document.getElementById("email-error");
        message.innerHTML = "";
        let x = document.getElementById("emailInput").value;
        try { 
          if(x.trim() == "") throw "Email address";
        }
        catch(err) {
          message.innerHTML = err + " cannot be empty";
        }

        /* Catch password errors */
        const message2 = document.getElementById("password-error");
        message2.innerHTML = "";
        let y = document.getElementById("passwordInput").value;
        try { 
          if(y.trim() == "") throw "Password";
        }
        catch(err) {
          message2.innerHTML = err + " cannot be empty";
        }

    }

    return (
        <>
            <form className="login-form" id="Login">
                <div className="login-form-content">
                    <div className="form-group">
                        <input
                            id="emailInput"
                            type="email"
                            name="email"
                            placeholder="Email Address"
                        />
                        <p id="email-error"></p>
                    </div>
                    <div className="form-group">
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
    //const navigate = useNavigate();
    const handleRegister = (e) => {
        const form = document.getElementById("Register");
        const formData = new FormData(form);

        fetch("http://localhost:5000/user/register", {
            method: "POST",
            body: formData,
        }).then(response => (response.json()
        )).then((response) => {
            if (response.Success == true) {
                window.alert("Success!!!")
            }
            console.log(response);
        }
        ).catch(function (error) {
            console.log(error);
        })
    }
    return (
        <>
            <form className="login-form" id="Register">
                <div className="login-form-content">
                    <div className="form-group">
                        <input
                            type="text"
                            name="firstName"
                            placeholder="Full Name"
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="number"
                            min="1910"
                            max="2099"
                            name="dateOfBirth"
                            placeholder="Birth Month"
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="email"
                            name="email"
                            className="emailAddress"
                            placeholder="Email Address"
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            name="password"
                            className="password"
                            placeholder="Password"
                        />
                    </div>
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