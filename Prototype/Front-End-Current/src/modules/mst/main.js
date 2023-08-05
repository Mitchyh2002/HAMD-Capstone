import Upload from "./Upload";
import SubMenu from "Components/SubMenu";
import PluginList from "./PluginList";

//Define Pages to pass to Sub Navigations
const navItems = [{
    name: "Plugins",
    component: PluginList
},{
    name: "Upload Module",
    component: Upload
}];


export default function mst_master(){
    return(
        <div className="flexBoxRowGrow">
            <SubMenu subComponents = {navItems}/>
        </div>
    )
}