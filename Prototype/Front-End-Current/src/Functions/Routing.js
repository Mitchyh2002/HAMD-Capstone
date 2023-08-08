import { element } from "prop-types";
import {Directory, Modules } from "../moduleDefs"
import App from "App";
import { useRoutes } from "react-router-dom";
import Main from "Pages/Main";
import React from "react";

/*{
    prefix:
    display:
    home: 
    pages: 
}*/

//Routes Element
export function AllRoutes(props){
    return(useRoutes(CreateAllPaths(props.Modules)));
}

//Create Router Paths
export function CreateAllPaths(Components) {
    console.log("Building routes....")
    console.log(Components);
    //Create Route Directory
    const Routes = [{
        path: "/",
        element: <Main modules={Components}/>,
        //Map Component Directories
        children: Components.map(e => createComponentRoutes(e))
    }];
    console.log(Routes);
    return Routes;
}

export function createComponentRoutes(module) {
    const Root = {
        //Create Index as Display Name
        path: "/" + module.prefix,
        //Element function from main.js of the module
        element: React.createElement(Modules[module.prefix]),

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