import Breadcrumbs from "Components/Breadcrumbs";
import Header from "Components/Header";
import LandingPage from "./LandingPage";
import Content from "Content"
import { Outlet } from "react-router-dom"
import { useState } from "react";

export default function Main(props) {
    const accountButton = "Account";
    const logoutButton = "Logout";
    const [moduleClick, setModuleClick] = useState();
    const [landing, setLanding] = useState();

    return(<> { landing ?
        <div style={{display: 'flex', flexDirection: 'column', height: "100vh"}}>
            <Header breadcrumbs = {<Breadcrumbs prefix="Mst" moduleName="Admin"/>} setLanding={setLanding} accountButton={accountButton} logoutButton={logoutButton}/>
            <Content modules={props.modules}/>
        </div> :
        <LandingPage modules={props.modules} setModuleClick={setLanding}/>
    }
    </>)
}

/* <LandingPage modules={props.modules}/> <Content modules={props.modules}/> */