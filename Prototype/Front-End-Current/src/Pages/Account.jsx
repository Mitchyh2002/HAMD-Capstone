import Header from "Components/Header"
import { Link, useLoaderData } from "react-router-dom"

export default function Account() {

    const response = useLoaderData();
    const accountButton = <Link to="/Account">Account</Link>;
    const logoutButton = "Logout";

    return(<>
        <Header accountButton={accountButton} logoutButton={logoutButton}/>
        <div className="flexBoxColumnGrow">
                <div>
                    <h1>{renderHeader(response.StatusCode)}</h1>
                </div>
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "left" }}>
                    {renderBody(response.StatusCode, response.Values)}
                </div>
                <div style={{display: "flex", justifyContent: "left", marginLeft: '20px'}}>
                    <Link
                        to="/ChangePassword">
                        <button className="formButton change-password-button">Change Password</button>
                    </Link>
                </div>
        </div>
    </>)
}

//Determine which header to display based on the status code
function renderHeader(responseCode) {
    switch (responseCode) {
        case -1:
            return "Error"
        
        case 200:
            return "My Details"
    }
}

//Determine which element to return for the body based on the status code
function renderBody(responseCode, responseValues){
    switch (responseCode) {
        case -1:
            return <p>Looks like some thing went wrong while we were processing you request. Try refreshing the page and checking your internet connection.</p>
        case 200:
            return(<>
                <h4>Hello, {responseValues.firstName}</h4>
                <div style={{display: "flex", flexDirection: "column", justifyContent: "center"}}>
                    <h3-bold>Karma:</h3-bold>
                    <h3>{responseValues.totalKarma}</h3>
                </div>
                <h3-bolder>Personal Details</h3-bolder>
                <div className="accountContainer">
                    <h3-bold>Name:</h3-bold>
                    <h3>{responseValues.firstName}</h3>
                </div>
                <div className="accountContainer">
                    <h3-bold>Email:</h3-bold>
                    <h3>{responseValues.email}</h3>
                </div>
                {responseValues.phoneNumber && ( // Conditionally render the phone number section
                    <div className="accountContainer">
                    <h3-bold>Phone Number:</h3-bold>
                    <h3>{responseValues.phoneNumber}</h3>
                    </div>
                )}
                <div className="accountContainer">
                    <h3-bold>Birth Year:</h3-bold>
                    <h3>{responseValues.dateOfBirth}</h3>
                </div>
            </>)
    }
}