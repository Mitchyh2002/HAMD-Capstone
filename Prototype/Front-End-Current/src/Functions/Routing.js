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
import { baseUrl } from "config";
import ChangePassword from "Pages/ChangePassword";
import ResetPassword from "Pages/ResetPassword";
import Configure from "modules/mst/Configure";


/*All Routes
    Create A set of <Routes> from a give list of modules
    Input: Modules
    Output: List of Routes
*/
export function allRoutes(Modules, config, setRefresh){
    return(CreateAllPaths(Modules, config, setRefresh));
}

/*Create All Paths
    Create a paths element object that can be passed to useRoutes()
    Input: Components
    Output: An Array of all paths for the application with a all children Routes
*/
export function CreateAllPaths(Components, config, setRefresh) {
    const homeElement = () => {
        return config == true? <Configure config={config} refresh={setRefresh}/> : <Main modules={Components}/>
    }

    //Create Route Directory
    const Routes = [{
        path: "/",
        loader: async ()  => {
            return redirect("/Home")
        }
    },{
        path:"/Login",
        element: <Login register={false} refresh={setRefresh}/>
    },{
        path:"/Register",
        element: <Login register={true} refresh={setRefresh}/>
    },{
        path:"/Confirm/:id",
        element: <ConfirmEmail />,
        loader: async ({params}) => {
            try{
                const response = await fetch("http://localhost:5000/mst/confirm/"+params.id, {
                    method: "POST"
                });
                const json = await response.json();
                return json;
            }catch{
                return({Message: "Local error/network error encountered", StatusCode: -1, Success: false});
            }
        }
    },{
        path:"/resetPassword/:id",
        element: <ResetPassword />,
        loader: async ({params}) => {
            try{
                const response = await fetch("http://localhost:5000/mst/user/resetPassword/"+params.id, {
                    method: "GET"
                });
                const json = await response.json();
                return json;
            }catch{
                return({Message: "Local error/network error encountered", StatusCode: -1, Success: false});
            }
        }
    },{
        path:'*',
        element:<NoMatchingPage />
    }];

    const Home = {
        path: "/Home",
        element: homeElement(),
        loader: async ()  => {
            const token = getToken();
            if(token == null){
                return redirect("/login");
            }else{
                return token;
            }
        }
    }

    if(Components){
        Home.children = createHomeRoutes(Components);
    }

    Routes.push(Home);
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

    if(Directory[module.prefix] && module.pages){
        Root.children = [];
        module.pages.map(e => {
            const page = Directory[module.prefix].find(obj => obj.pageCode == e.pageCode)
            if (page){
                Root.children.push({
                    path: page.path,
                    ...page.loader&& {loader: page.loader},
                    ...page.children&& {children: page.children},
                    element: React.createElement(page.element)
                })
            }
        })
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
    return(
        <>
            {props.module.pages && <SubMenu module={props.module} /> }
            {child? <Outlet /> : React.createElement(Modules[props.module.prefix])}
        </>
    )

}

function createHomeRoutes(modules){
    //generate child modules
    const children = (modules) ? modules.map(e => createComponentRoutes(e)) : [];
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