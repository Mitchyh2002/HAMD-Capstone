import Breadcrumbs from "Components/Breadcrumbs";
import Header from "Components/Header"
import Content from "Content"
import { Link, Outlet } from "react-router-dom"

export default function Main(props) {
    const accountButton = <Link to="/Account">Account</Link>;
    const logoutButton = "Logout"

    return(
        <div style={{display: 'flex', flexDirection: 'column', height: "100vh"}}>
            <Header breadcrumbs = {<Breadcrumbs prefix="Mst" moduleName="Admin"/>} accountButton={accountButton} logoutButton={logoutButton}/>
            <Content modules={props.modules}/>
        </div>
    )
}