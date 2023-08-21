import React from "react";
import '../App.css';
import { logout } from "Functions/User";
import { Link } from "react-router-dom";
import Breadcrumbs from "./Breadcrumbs";

export default function Header({ accountButton, logoutButton }) {
    return (
        <div className="header">
            <header>
                <div className="breadcrumbs breadcrumbs1">
                    <img className="bee-logo" src="/bee2.png" alt="logo" />
                    <Breadcrumbs />
                </div>
                <nav>
                    <ul>
                        <li><Link to="#!">{accountButton}</Link></li>
                        <li><Link to='/login' onClick={logout}>{logoutButton}</Link></li>
                    </ul>
                </nav>
            </header>
        </div>
    )
};