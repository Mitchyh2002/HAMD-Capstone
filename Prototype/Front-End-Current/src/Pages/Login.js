import Header from "Components/Compents"
import './Login.css'

export default function Login() {

    return (
        <>
            <Header />
            <div className="maindiv">

                <div className="seconddiv">
                    <div><img className="login-image" src="/login-image.jpg" alt="bee-on-flower" /></div>
                    <h2 className="welcome-text">Welcome to<br /> Bee Aware</h2>
                </div>

                <div className="thirddiv">
                    <div className="form-header">
                        <h3>Sign In</h3>
                    </div>
                    <form className="login-form">
                        <div className="login-form-content">
                            <div className="form-group">
                                <input
                                    type="email"
                                    className="emailAddress"
                                    placeholder="Email Address"
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="password"
                                    className="password"
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

                            <div className="flexBoxRowGrow" style={{ justifyContent: "center" }}>
                                <button className="primaryButton sign-in-button">Sign In</button>
                            </div>
                            <div className="flexBoxRowGrow" style={{ justifyContent: "center" }}>
                                <button className="primaryButton create-account-button">Create New Account</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}