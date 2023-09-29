import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resendRegistraionEmail } from "Functions/User";
import "../Pages/Login.css"


export function EmailConfirmation(props) {
    const [sent, setSent] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState();
    const [confirmed, setConfirmed] = useState(false);
    const navigate = useNavigate();

    function handleResend() {
        resendRegistraionEmail(props.email).then(res => {
            console.log(res)
            if (res.Success == true) {
                    setSent(true);
                    setError(false);
            } else {
                setSent(false);
                setError(true);
                setErrorMessage(res.Message);
                if(res.StatusCode == 61){
                    setConfirmed(true)
                }
                
            }
        }).catch(error => {
            setError(true);
            setSent(false);
            setConfirmed(false);
            setErrorMessage("Something appears to have gone worng, check to if you are still connected to the internet")
            console.log(error)
        })
    }

    const handleSignin = () => {
        props.setEmail();
        navigate("/login");
    }

    return (
        <div className="flexBoxColumnGrow" style={{ alignItems: "center" }}>
            {(!error && !sent && !props.hideInitial) &&<p> Thank you for signing up. Please confirm your email address to get started.</p>}
            {error && <p style={{color: "red"}}>{errorMessage}</p>}
            {sent && <p>Your email has been successfully resent. Please give it a few moments to send, be sure to check your spam if it doesn't appear!</p>}
            {confirmed == false? 
            <button className="primaryButton sign-in-button" onClick={handleResend}>Resend</button> 
            :
            <button className="primaryButton create-account-button" onClick={handleSignin}>Sign In</button>}
        </div>
    )
}