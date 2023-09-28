import Breadcrumbs from "Components/Breadcrumbs";
import Header from "Components/Header";
import LandingPage from "./LandingPage";
import Content from "Content"
import { Outlet } from "react-router-dom"

export default function Main(props) {
    const accountButton = "Account";
    const logoutButton = "Logout"

    return(
        <div style={{display: 'flex', flexDirection: 'column', height: "100vh"}}>
            <Header breadcrumbs = {<Breadcrumbs prefix="Mst" moduleName="Admin"/>} accountButton={accountButton} logoutButton={logoutButton}/>
            <LandingPage modules={props.modules}/>
        </div>
    )
}

/* <Content modules={props.modules}/> */