import { Link, useLoaderData } from "react-router-dom"

export default function Account() {

    const response = useLoaderData();

    return (<>
        <div className="flexBoxColumnGrow">
            <div>
                <h2 className="normal account-header">{renderHeader(response.StatusCode)}</h2>

            </div>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "left" }}>
                {renderBody(response.StatusCode, response.Values)}
            </div>
            <div style={{ display: "flex", justifyContent: "left", marginTop: "20px", marginBottom: "20px" }}>
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
            return <p className="left20px">Looks like some thing went wrong while we were processing your request. Try refreshing the page and checking your internet connection.</p>
        case 200:
            return (<>
                <p className="left20px">Hello, {responseValues.firstName}!</p>
                <div className="accountContainer">
                    <body className="bold left20px account-title">Karma:</body>
                    <body style={{ marginLeft: '5px' }}>{responseValues.totalKarma}</body>
                </div>
                <body className=" left20px normal personal-details">Personal Details</body>
                <div className="accountContainer left20px">
                    <body className="bold">First Name:</body>
                    <body className='left5px'>{responseValues.firstName}</body>
                </div>
                <div className="accountContainer left20px">
                    <body className="bold">Birth Month:</body>
                    <body className='left5px'>{responseValues.dateOfBirth}</body>
                </div>
                <div className="accountContainer left20px">
                    <body className="bold">Email:</body>
                    <body className='left5px'>{responseValues.email}</body>
                </div>
                    {responseValues.phoneNumber && ( // Conditionally render the phone number section
                          <div className="accountContainer left20px">
                          <body className="bold">Phone:</body>
                          <body className='left5px'>{responseValues.phoneNumber}</body>
                      </div>
                    )}

                
            </>
            )
    }
}
