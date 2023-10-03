import Breadcrumbs from "Components/Breadcrumbs";
import Header from "Components/Header";
import LandingPage from "./LandingPage";
import Content from "Content"
import { Outlet, useLocation, useMatch } from "react-router-dom"
import { useEffect, useState } from "react";

export default function Main(props) {
    const accountButton = "Account";
    const logoutButton = "Logout";
    const [module, setModule] = useState();
    const [landing, setLanding] = useState(true);
    const home = useMatch("Home");
    let location = useLocation();
    

    useEffect( () => {
        console.log(home)
        home != null && setLanding(false);
    }, [location])

    return(<> { landing ?
        <div style={{display: 'flex', flexDirection: 'column', height: "100vh"}}>
            <Header breadcrumbs = {<Breadcrumbs prefix="Mst" moduleName="Admin"/>} setLanding={setLanding} setModule={setModule} accountButton={accountButton} logoutButton={logoutButton}/>
            <Content modules={props.modules}/>
        </div> :
        <div>
        <Header accountButton={accountButton} logoutButton={logoutButton} setLanding={setLanding}/>
        <LandingPage modules={props.modules} setModuleClick={setLanding}/>
        </div>
    }
    </>)
}
