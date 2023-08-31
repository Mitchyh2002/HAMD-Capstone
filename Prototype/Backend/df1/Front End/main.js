import Upload from "./Upload";
import PluginList from "./PluginList";
import Users from "./Users"
import AddUser from "./AddUser";
import { Outlet } from "react-router-dom";
import { getPlugins, getUsers } from "./loaderFunctions";

//Define Pages to pass to Sub Navigations
export const df1_pages = [{
    path: "Plugins",
    pageCode: "1",
    Description: "Show All Modules",
    userAccessLevel: 5,
    element: PluginList,
    loader: getPlugins,
},{
    path: "Add Plugin",
    pageCode: "2",
    Description: "Add Plugin To System",
    userAccessLevel: 7,
    element: Upload
},{
    path: "Users",
    pageCode: "3",
    Description: "Show All Users",
    userAccessLevel: 5,
    element: Users,
    loader: getUsers
},{
    path: "Add User",
    pageCode: "3.1",
    Description: "Add User to System",
    userAccessLevel: 5,
    element: AddUser
}];

export default function df1_master(){
    return(
        <div className="flexBoxRowGrow">
            <Upload />
            <Outlet />
        </div>
    )
}