import Upload from "./Upload";
import PluginList from "./PluginList";
import Users from "./Users"
import AddUser from "./AddUser";
import { Outlet } from "react-router-dom";
import { getPlugins, getUsers } from "./loaderFunctions";

//Define Pages to pass to Sub Navigations
export const pages = [{
    path: "Plugins",
    pageCode: "1",
    element: PluginList,
    loader: getPlugins
},{
    path: "Add Plugin",
    pageCode: "2",
    element: Upload
},{
    path: "Users",
    pageCode: "3",
    element: Users,
    loader: getUsers,
},{
    path: "Add User",
    pageCode: "3.1",
    element: AddUser
}];

export default function mst_master(){
    return(
        <div className="flexBoxRowGrow">
            <Upload />
            <Outlet />
        </div>
    )
}