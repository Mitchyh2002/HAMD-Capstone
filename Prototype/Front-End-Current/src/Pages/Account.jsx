import { Link, useLoaderData } from "react-router-dom"

export default function Account() {

    const response = useLoaderData();

    return (<>
        <div className="flexBoxColumnGrow">
            <div>
                <h2 className="account-header">{renderHeader(response.StatusCode)}</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "left" }}>
                {renderBody(response.StatusCode, response.Values)}
            </div>
            <div style={{ display: "flex", justifyContent: "left", marginTop: "20px"}}>
                <button className="formButton change-password-button left20px">Update Details</button>
            </div>
            <div style={{ display: "flex", justifyContent: "left", marginBottom: "20px"}}>
                <Link
                    to="/Home/ChangePassword">
                    <button className="formButton change-password-button left20px">Change Password</button>
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
            return "My Account"
    }
}

//Determine which element to return for the body based on the status code
function renderBody(responseCode, responseValues) {
    switch (responseCode) {
        case -1:
            return <p>Looks like some thing went wrong while we were processing you request. Try refreshing the page and checking your internet connection.</p>
        case 200:
            return (<>
                <p className="left20px">Hello, {responseValues.firstName}!</p>
                <div className="accountContainer">
                    <body className="left20px account-title">Karma:</body>
                    <body style={{marginLeft: '5px'}}>{responseValues.totalKarma}</body>
                </div>
                <body className=" left20px account-title personal-details">Personal Details</body>
                <div className="account-details-form left20px">
                <FormInput 
                    label="First Name"
                    placeholder={responseValues.firstName}
                    type="text"
                    id="name"
                    className="accountdetails"
                />
                  <FormInput 
                    label="Email"
                    placeholder={responseValues.email}
                    type="text"
                    id="email"
                    className="accountdetails"
                />
                 {responseValues.phoneNumber && ( // Conditionally render the phone number section
                    <FormInput 
                    label="Phone Number"
                    placeholder={responseValues.phoneNumber}
                    type="text"
                    id="phoneNumber"
                    className="accountdetails"
                />
                )}
                <FormInput 
                    label="Birth Year"
                    placeholder={responseValues.dateOfBirth}
                    type="number"
                    min="1910"
                    max="2099"
                    id="birthYear"
                    className="accountdetails"
                />
                </div>
            </>
            )
    }
}

function FormInput(props) {
    return (
        <div>
            <label style={{ display: "flex", flexDirection: "row" }}>
                {props.label}
            </label>
            <div>
                <input style={{width: "350px"}}
                    className={props.class}
                    type={props.type}
                    id={props.id}
                    name={props.name}
                    placeholder={props.placeholder}
                />
                <p style={{ color: "red" }}>{props.error}</p>
            </div>
        </div>
    )
}