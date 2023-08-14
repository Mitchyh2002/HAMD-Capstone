import {Directory, Modules } from "../moduleDefs"
import { Outlet, useOutlet, useRoutes } from "react-router-dom";
import Main from "Pages/Main";
import React from "react";
import SubMenu from "Components/SubMenu";


/*All Routes
    Create A set of <Routes> from a give list of modules
    Input: Modules
    Output: List of Routes
*/
export function AllRoutes(props){
    return(useRoutes(CreateAllPaths(props.Modules)));
}

/*Create All Paths
    Create a paths element object that can be passed to useRoutes()
    Input: Components
    Output: An Array of all paths for the application with a all children Routes
*/
export function CreateAllPaths(Components) {
    console.log("Building routes....")
    console.log(Components);
    //Create Route Directory
    const Routes = [{
        path: "/Home",
        element: <Main modules={Components}/>,
        //Map Component Directories
        children: Components.map(e => createComponentRoutes(e))
    }];
    console.log(Routes);
    return Routes;
}

/*createComponent Routes
    Create all child paths for a module and a home route using the arrays defined in moduleDefs.js
    Input: Module
    Output: An Arrayt of paths for the module with all child elemnts defined in Directory

*/
export function createComponentRoutes(module) {
    const Root = {
        //Create Index as Display Name
        path: module.prefix,
        //Element function from main.js of the module
        element: <CreateParentOutlet module = {module} />,

        //Create child path for each directory
        children: Directory[module.prefix].map(e => {
            console.log(e)
            return({path: e.name,
            element: React.createElement(e.component)})
        }),
        //Create sub directories from pages
    }

    return Root;
}

/*CreateParentOutlet
    Checks if on a child element and returns it or the parent element
    Props:
        module: Module that will be used to find the element in the moduleDefs.js
*/
export function CreateParentOutlet (props) {
    const child = useOutlet();
    console.log(child);
    return(
        <>
            <SubMenu prefix={props.module.prefix} />
            {child? <Outlet /> : React.createElement(Modules[props.module.prefix])}
        </>
    )

}