import Upload from "./Upload";
import PluginList from "./PluginList";
import Users from "./Users"
import AddUser from "./AddUser";
import UserAccount from "./UserAccount";
import { Outlet } from "react-router-dom";
import { getPlugins, getUser, getUsers } from "./loaderFunctions";

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
    element: AddUser
},{
    path: "User Account/:id",
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