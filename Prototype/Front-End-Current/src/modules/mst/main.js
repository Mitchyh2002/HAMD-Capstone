import Upload from "./Upload";
import SubMenu from "Components/SubMenu";
import test from "./test";
import Login from "./Login";
import Register from "./Register";

//Define Pages to pass to Sub Navigations
const navItems = [{
    name: "Upload Module",
    component: Upload
},{
    name: "Test",
    component: test
},{
    name: "Login",
    component: Login
},{
    name: "Register",
    component: Register
}];


export default function mst_master(){
    return(
        <div className="flexBoxRowGrow">
            <SubMenu subComponents = {navItems}/>
        </div>
    )
}