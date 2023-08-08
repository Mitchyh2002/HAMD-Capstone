import React, {useState} from "react";
import { Directory } from "moduleDefs";
import { NavLink } from "react-router-dom";

/*Sub Menu
    Description: SubMenu for all sub components of and corresponding links based on the values defined in modulesDefs.js
    Props: 
        prefix: Prefix of the module, Used to determine sub components from modules def
    SubMenu with working links
*/
export default function SubMenu(props){
    //Extract sub components from directory
    const subComponents = Directory[props.prefix];
    console.log(props.prefix);

    //Creates the navlinks objects
    //Input: function
    //Output: Button with onClick call to input
    function createNavLinks(component){
        return(
            <div style={{display: "flex", alignItems: "center"}}>
                <NavLink className={({isActive}) => isActive? "subNavHighlight" : "subNav"} to={props.prefix + "/" + component.name}>
                    {component.name}
                </NavLink>
            </div>
        )
    }

    return(
        <div className="flexBoxColumnGrow" style={{maxWidth: "178px"}}>
              {subComponents.map(component => createNavLinks(component))}
        </div>
    )
}