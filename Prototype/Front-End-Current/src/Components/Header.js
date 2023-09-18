import React from "react";
import '../App.css';
import { logout } from "Functions/User";
import { Link } from "react-router-dom";
import Breadcrumbs from "./Breadcrumbs";

export default function Header (props) {
    return(
        <div className="header">
            <header>
            <div className="breadcrumbs breadcrumbs1">
                    <img className="bee-logo" alt="logo" />
                    {props.breadcrumbs}
                </div>
                <nav>
                    <ul>
                        <li><Link to="#!">{props.accountButton}</Link></li>
                        <li><Link to='/login' onClick={logout}>{props.logoutButton}</Link></li>
                    </ul>
                </nav>
            </header>
        </div>
    )
};