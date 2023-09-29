import {Directory, Modules } from "../moduleDefs"
import { Outlet, createBrowserRouter, redirect, useOutlet, useRoutes } from "react-router-dom";
import {Main, Login, NoMatchingPage, ConfirmEmail, Account, ChangePassword, ResetPassword} from "Pages/";
import React from "react";
import SubMenu from "Components/SubMenu";
import { getToken } from "./User";
import { baseUrl } from "config";


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
        element: <Main modules={Components} clicked={false}/>,
        //Map Component Directories
        children: createHomeRoutes(Components),
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
                const response = await fetch(baseUrl + "/mst/confirm/"+params.id);
                const json = await response.json();
                return json;
            }catch{
                return({Message: "Local error/network error encountered", StatusCode: -1, Success: false});
            }
        }
    },{
        path:"/ResetPassword/:id",
        element: <ResetPassword />,
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
    }

    if(Directory[module.prefix]){
        Root.children = 
        Directory[module.prefix].map(e => {
            console.log(e.children)
            return({
            path: e.path,
            ...e.loader&& {loader: e.loader},
            ...e.children&& {children: e.children},
            element: React.createElement(e.element)})})
    }
    console.log(Root)

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

function createHomeRoutes(modules){
    //generate child modules
    const children = modules.map(e => createComponentRoutes(e));
    children.push(
        {
            path:"Account",
            element: <Account />,
            loader: async () => {
                try{
                    const response = await fetch(baseUrl + "/mst/user/getAccount/",{
                        method: "GET",
                        headers: {
                            'Authorization': "Bearer " + getToken(),
                        }
                    });
    
                    const json = await response.json();
                    return json;
                }catch{
                    return({Message: "Local error/network error encountered", StatusCode: -1, Success: false})
                }
            }
        },
        {
            path:"ChangePassword",
            element: <ChangePassword changed={false}/>
        }
    )

    return children

}