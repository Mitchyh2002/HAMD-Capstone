import React from "react";
import { Link, useLocation } from "react-router-dom";
import '../App.css';

export default function Breadcrumbs() {
    const location = useLocation();
    
    let currentLink = '';
    
    const crumbs = location.pathname.split('/')
        .filter(crumb => crumb !== '')
        .map(crumb => {
            currentLink += `/${crumb}`;
            crumb = crumb.replace("%20", " ");
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