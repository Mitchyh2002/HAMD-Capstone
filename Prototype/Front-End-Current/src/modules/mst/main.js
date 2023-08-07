import Upload from "./Upload";
import SubMenu from "Components/SubMenu";
import test from "./test";
import { Outlet } from "react-router-dom";

//Define Pages
const navItems = [{
    name: "Upload Module",
    component: Upload
},{
    name: "Test",
    component: test
}];

export const pages = [{
    name: "Upload",
    component: Upload
},{
    name: "Test",
    component: test
}];



export default function mst_master(){
    return(
        <div className="flexBoxRowGrow">
            <Outlet />
        </div>
    )
}