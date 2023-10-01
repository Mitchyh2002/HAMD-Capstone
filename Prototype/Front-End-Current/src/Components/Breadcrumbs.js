import React from "react";
import { Link, useLocation } from "react-router-dom";
import '../App.css';

/* Displays a breadcrumb link in the Header. 
Takes in the module prefix and module name. */

export default function Breadcrumbs({ prefix, moduleName }) {
    const location = useLocation();
    
    let currentLink = '';

    const crumbs = location.pathname.split('/')
        .filter(crumb => crumb !== '')
        .map(crumb => {
            currentLink += `/${crumb}` 
            crumb = crumb.replace("%20", " ");
            crumb = crumb.charAt(0).toUpperCase() + crumb.slice(1);
            crumb = crumb.replace(prefix, moduleName);
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