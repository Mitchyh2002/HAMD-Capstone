import Upload from "./Upload";
import PluginList from "./PluginList";
import { Outlet } from "react-router-dom";
import { getPlugins } from "./loaderFunctions";

//Define Pages to pass to Sub Navigations
export const pages = [{
    name: "Plugins",
    component: PluginList,
    loader: getPlugins
},{
    name: "Add Plugin",
    component: Upload
}];



export default function mst_master(){
    return(
        <div className="flexBoxRowGrow">
            <Upload />
            <Outlet />
        </div>
    )
}