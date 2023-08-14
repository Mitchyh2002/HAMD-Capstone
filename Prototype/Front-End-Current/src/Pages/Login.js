import Header from "Components/Header"
import './Login.css'
import { login } from "Functions/User";

export default function Login(props) {
        const register = props.register;
    return (
        <>
            <Header />
            <div className="maindiv">
                <WelcomeMessage />
                <div className="thirddiv">
                    <div className="form-header">
                        <h3>{register? "Create Account" : "Sign In"}</h3>
                    </div>

                {register?
                 <RegisterForm /> : <LoginForm />}
                
                </div>  
            </div>
        </>
    )
}

//Components
//Welcome Message
function WelcomeMessage(props){
    return(
    <div className="seconddiv">
        <div><img className="login-image" src="/login-image.jpg" alt="bee-on-flower" /></div>
        <h2 className="welcome-text">Welcome to<br /> Bee Aware</h2>
    </div>
    )
}

//Login Form
function LoginForm(){   
    const handleLogin= async (e) => {
        const form = document.getElementById("Login");
        const formData = new FormData(form);
        const response =  login(formData) 
        console.log(response)
        window.alert(await response);
    }
    return(
        <>
        <form className="login-form" id="Login">
            <div className="login-form-content">
                <div className="form-group">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                    />
                </div>
                <p>
                    <a
                        className="forgot-password"
                        href="#">
                        Forgot your password?
                    </a>
                </p>
            </div>
        </form>

                <div className="flexBoxRowGrow" style={{ justifyContent: "center" }}>
                    <button className="primaryButton sign-in-button" onClick={handleLogin}>Sign In</button>
                </div>
                <div className="flexBoxRowGrow" style={{ justifyContent: "center" }}>
                    <button className="primaryButton create-account-button">Create New Account</button>
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
    return(
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
                        name="dateOfBirth"
                        placeholder="Dob"
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
        <div className="flexBoxRowGrow" style={{ justifyContent: "center" }}>
            <button className="primaryButton create-account-button">Create New Account</button>
        </div>
    </>
    )
}