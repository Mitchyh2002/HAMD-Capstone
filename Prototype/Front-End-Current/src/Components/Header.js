import React from "react";
import '../App.css';
import { logout } from "Functions/User";
import { Link } from "react-router-dom";
import Breadcrumbs from "./Breadcrumbs";
import { useState } from "react";

/* Header component. 
props.setLanding - sets landing page view to true/false. 
props.breadcrumbs - breadcrumbs not displayed in the login/register screen.
props.logoutButton & accountButton - not displayed in the login/register screen. */

export default function Header (props) {

    return(
        <div className="header">
            <header>
                <div className="breadcrumbs breadcrumbs1">
                    <Link to='/home' style={{ display: 'contents' }} onClick={() => props.setLanding(false)}>
                        <img className="logo" alt="logo"></img>
                    </Link>
                    {props.breadcrumbs}
                </div>
                <nav>
                    <ul>
                        <li><Link to="/home/account" onClick={() => props.setLanding(true)}>{props.accountButton}</Link></li>
                        <li><Link to='/login' onClick={logout}>{props.logoutButton}</Link></li>
                    </ul>
                </nav>
            </header>
        </div>
    )
};