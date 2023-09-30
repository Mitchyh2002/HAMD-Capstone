import Upload from "./Upload";
import PluginList from "./PluginList";
import Users from "./Users"
import CreateUser from "./CreateUser";
import UserModuleAccess from "./UserModuleAccess";
import Configure from "./Configure.js";
import { Outlet } from "react-router-dom";
import { adminCheck, getPlugins, getUsers } from "./loaderFunctions";

//Define Pages to pass to Sub Navigations
export const mst_pages = [{
    path: "Plugins",
    element: PluginList,
    loader: getPlugins
},{
    path: "Add Plugin",
    element: Upload
},{
    path: "Users",
    element: Users,
    loader: getUsers
},{
    path: "Create User",
    element: CreateUser,
    loader: adminCheck,
},{
    path: "User Module Access",
    element: UserModuleAccess,
    loader: adminCheck
},{
    path: "Configure",
    element: Configure
}];

export default function mst_master(){
    return(
        <div className="flexBoxRowGrow">
            <Upload />
            <Outlet />
        </div>
    )
}