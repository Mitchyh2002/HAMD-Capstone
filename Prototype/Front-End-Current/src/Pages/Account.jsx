import Header from "Components/Header"
import { useLoaderData } from "react-router-dom"

export function Account() {

    const response = useLoaderData();

    
    return(<>
        <Header />
        <div className="mainContainerCentre" style={{flexDirection: "column", height: "100vh", width: "100vw", flexWrap: "wrap", justifyContent: "flex-start", paddingTop: "100px"}}>
            <div className="flexBoxGrow" style={{maxWidth: "65%"}}>
                <div className="subNav" style={{ borderRadius: "20px 20px 0px 0px", display: "flex", justifyContent: "left", alignItems: "center", height: "70px" }}>
                    <h1>{renderHeader(response.StatusCode)}</h1>
                </div>
                <div style={{ justifyContent: "left" }}>
                    {renderBody(response.StatusCode, response.Values)}
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
                <p>Hello, {responseValues.firstName}</p>
                <h3>Personal Details</h3>
                <div style={{display: "flex", alignItems: "center", gap:'10px'}}>
                    <h4>Name:</h4>
                    <p>{responseValues.firstName}</p>
                </div>
                <div style={{display: "flex", alignItems: "center", gap:'10px'}}>
                    <h4>Email:</h4>
                    <p>{responseValues.email}</p>
                </div>
                {responseValues.phoneNumber && ( // Conditionally render the phone number section
                    <div style={{display: "flex", alignItems: "center", gap:'10px'}}>
                    <h4>Phone Number:</h4>
                    <p>{responseValues.phoneNumber}</p>
                    </div>
                )}
                <div style={{display: "flex", alignItems: "center", gap:'10px'}}>
                    <h4>Birth Year:</h4>
                    <p>{responseValues.dateOfBirth}</p>
                </div>
                <div style={{display: "flex", alignItems: "center", gap:'10px'}}>
                    <h4>Birth Year:</h4>
                    <p>{responseValues.dateOfBirth}</p>
                </div>
            </>)
    }
}