import Header from "Components/Header"
import Content from "Content"
import { Outlet } from "react-router-dom"

export default function Main(props) {
    const accountButton = "Account";
    const logoutButton = "Logout"

    return(
        <div style={{display: 'flex', flexDirection: 'column', height: "100vh"}}>
            <Header accountButton={accountButton} logoutButton={logoutButton}/>
            <Content modules={props.modules}/>
        </div>
    )
}