import React from "react";
import { Link, useLocation } from "react-router-dom";
import '../App.css';
import { Directory } from "moduleDefs";

/* Displays a breadcrumb link in the Header. 
Takes in the module prefix and module name. */

export default function Breadcrumbs(props) {
    const location = useLocation();
    
    let currentLink = '';
    let currentModule;

    const crumbs = location.pathname.split('/')
        .filter(crumb => crumb !== '')
        .map(crumb => {
            crumb = decodeURI(crumb);
            currentLink += `/${crumb}`
            const module = props.modules.find(obj => obj.prefix == crumb)
            if(module){
                crumb = module.displayName;
                currentModule = module;
            }

            if (currentModule){
                const page = Directory[currentModule.prefix].find(obj => obj.path == crumb);
                if(page){
                    crumb = currentModule.pages.find(obj => obj.pageCode == page.pageCode).pageName;
                }
            }
            return(
                <div className="crumb" key={crumb}>
                    <Link to={currentLink}>{crumb}</Link>
                </div>
            )
        })
    
    return(
        <div className="breadcrumbs">
            {crumbs}
        </div>
    )
};