import Header from "Components/Header";
import { useLoaderData, Link } from "react-router-dom";

export function ConfirmEmail() {
    const response = useLoaderData();
    return(<>
        <Header />
        <div className="mainContainerCentre" style={{flexDirection: "column", height: "100vh", width: "100vw", flexWrap: "wrap", justifyContent: "flex-start", paddingTop: "100px"}}>
            <div className="flexBoxGrow" style={{maxWidth: "65%"}}>
                <div className="subNav" style={{ borderRadius: "20px 20px 0px 0px", display: "flex", justifyContent: "center", alignItems: "center", height: "70px" }}>
                    <h3>{renderHeader(response.StatusCode)}</h3>
                </div>
                <div style={{ justifyContent: "center"}}>
                    {renderBody(response.StatusCode)}
                </div>
            </div>
        </div>
    </>)

}

//Determine which header to display based on the status code
function renderHeader(responseCode) {
    switch (responseCode) {
        case -1:
            return "Error"

        case 60:
            return "Invalid Token"

        case 61:
            return "Already Confirmed"

        case 200:
            return "Confirmed"
    }
}

//Determine which element to return for the body based on the status code
function renderBody(responseCode){
    switch (responseCode) {
        case -1:
            return <p>Looks like some thing went wrong while we were processing you request. Try refreshing the page and checking your internet connection.</p>
        case 60:
            return <p>Looks like the token is either invalid or has expired, try sending another one.</p>
        case 61:
            return(<>
                <p>Looks like you have already verified your email address. Click the button below to return to the login screen.</p>
                <div className="flexBoxRowGrow" style={{ justifyContent: "center" }}>
                    <Link
                        to="/Login">
                        <button className="primaryButton sign-in-button">Sign in</button>
                    </Link>
                </div>
            </>)
        case 200:
            return (<>
                <p>All finished up, your email has been validated and your registration is now finished! Click the button below to return to the login screen.</p>
                <div className="flexBoxRowGrow" style={{ justifyContent: "center" }}>
                    <Link
                        to="/Login">
                        <button className="primaryButton sign-in-button">Sign in</button>
                    </Link>
                </div>
            </>)
    }   
}