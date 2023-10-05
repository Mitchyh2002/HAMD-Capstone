import Upload from "./Upload";
import PluginList from "./PluginList";
import Users from "./Users"
import CreateUser from "./CreateUser";
import UserModuleAccess from "./UserModuleAccess";
import Configure from "./Configure.js";
import { Outlet } from "react-router-dom";
import { adminCheck, getPlugins, getUser, getUsers, getConfig } from "./loaderFunctions";

//Define Pages to pass to Sub Navigations
export const mst_pages = [{
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
    loader: getUsers
},{
    path: "Add User",
    pageCode: "3.1",
    element: CreateUser,
    loader: adminCheck
},{
    path: "User Module Access",
    pageCode: 6,
    element: UserModuleAccess,
    loader: adminCheck
},{
    path: "Configure",
    pageCode: 5,
    element: Configure,
    loader: getConfig
}];

export default function mst_master(){
    return(
        <div className="flexBoxRowGrow">
            <Upload />
            <Outlet />
        </div>
    )
}