import {Directory, Modules } from "../moduleDefs"
import { Outlet, createBrowserRouter, redirect, useOutlet, useRoutes } from "react-router-dom";
import Main from "Pages/Main";
import React from "react";
import SubMenu from "Components/SubMenu";
import Login from "Pages/Login";
import NoMatchingPage from "Pages/404";
import { getToken } from "./User";
import { ConfirmEmail } from "Pages/Confirm";
import Account from "Pages/Account";


/*All Routes
    Create A set of <Routes> from a give list of modules
    Input: Modules
    Output: List of Routes
*/
export function allRoutes(Modules){
    return(CreateAllPaths(Modules));
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
        path: "/",
        loader: async ()  => {
            return redirect("/Home")
        }
    },{
        path: "/Home",
        element: <Main modules={Components}/>,
        //Map Component Directories
        children: Components.map(e => createComponentRoutes(e)),
        loader: async ()  => {
            const token = getToken();
            console.log(token);
            if(token == null){
                return redirect("/login");
            }else{
                return token;
            }
        }
    },{
        path:"/Login",
        element: <Login register={false}/>
    },{
        path:"/Register",
        element: <Login register={true}/>
    },{
        path:"/Confirm/:id",
        element: <ConfirmEmail />,
        loader: async ({params}) => {
            try{
                const response = await fetch("http://localhost:5000/mst/confirm/"+params.id);
                const json = await response.json();
                return json;
            }catch{
                return({Message: "Local error/network error encountered", StatusCode: -1, Success: false});
            }
        }
    },{
        path:"/Account",
        element: <Account />,
        loader: async () => {
            try{
                const response = await fetch("http://localhost:5000/mst/user/getAccount");
                const json = await response.json();
                return json;
            }catch{
                return({Message: "Local error/network error encountered", StatusCode: -1, Success: false})
            }
        }
    },{
        path:'*',
        element:<NoMatchingPage />
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
            console.log(e.children)
            return({
            path: e.path,
            ...e.loader&& {loader: e.loader},
            ...e.children&& {children: e.children},
            element: React.createElement(e.element)})
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