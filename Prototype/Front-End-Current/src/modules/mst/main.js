import Upload from "./Upload";
import test from "./test";
import { Outlet } from "react-router-dom";

//Define Pages
export const pages = [{
    name: "Upload",
    component: Upload
},{
    name: "Test",
    component: test
},{
    name: "Test2",
    component: () => {
        return(
            <h1>LOL</h1>
        )
    }
}];



export default function mst_master(){
    return(
        <div className="flexBoxRowGrow">
            <Outlet />
        </div>
    )
}