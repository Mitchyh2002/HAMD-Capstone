import Upload from "./Upload";
import PluginList from "./PluginList";

//Define Pages to pass to Sub Navigations
export const pages = [{
    name: "Plugins",
    component: PluginList
},{
    name: "Add Plugin",
    component: Upload
}];



export default function mst_master(){
    return(
        <div className="flexBoxRowGrow">
            <Upload />
        </div>
    )
}