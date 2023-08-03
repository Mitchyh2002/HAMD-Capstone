import Upload from "./Upload";
import SubMenu from "Components/SubMenu";
import test from "./test";

//Define Pages to pass to Sub Navigations
const navItems = [{
    name: "Upload Module",
    component: Upload
},{
    name: "Test",
    component: test
}];


export default function mst_master(){
    return(
        <div className="flexBoxRowGrow">
            <SubMenu subComponents = {navItems}/>
        </div>
    )
}