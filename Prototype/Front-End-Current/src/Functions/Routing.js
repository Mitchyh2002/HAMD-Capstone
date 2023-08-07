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
    console.log(props)
    return(useRoutes(CreateAllPaths(props.Modules)));
}

//Create Router Paths
export function CreateAllPaths(Components) {
    console.log(Components)
    //Create Route Directory
    const Routes = [{
        path: "/",
        element: <Main />,
        //Map Component Directories
        children: Components.map(e => createComponentRoutes(e))
    }];
    console.log("Routes:")
    console.log(Routes);
    return Routes;
}

export function createComponentRoutes(component) {
    console.log(component)
    console.log(Directory[component.prefix])
    const Root = {
        //Create Index as Display Name
        path: "/" + component.prefix,
        //Element function from main.js of the component
        element: React.createElement(Modules[component.prefix]),

        //Create child path for each directory
        children: Directory[component.prefix].map(e => {
            console.log(e)
            return({path: e.name,
            element: React.createElement(e.component)})
        }),
        //Create sub directories from pages
    }

    return Root;
}