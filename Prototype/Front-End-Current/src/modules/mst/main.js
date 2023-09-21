import Upload from "./Upload";
import PluginList from "./PluginList";
import Users from "./Users"
import AddUser from "./AddUser";
import UserAccount from "./UserAccount";
import { Outlet } from "react-router-dom";
import { getPlugins, getUser, getUsers } from "./loaderFunctions";

//Define Pages to pass to Sub Navigations
export const pages = [{
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
    path: "Add User",
    element: AddUser
},{
    path: "User Account",
    element: UserAccount,
    loader: getUser
}];

export default function mst_master(){
    return(
        <div className="flexBoxRowGrow">
            <Upload />
            <Outlet />
        </div>
    )
}