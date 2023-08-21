import React from "react";
import '../App.css';
import { logout } from "Functions/User";
import { Link } from "react-router-dom";

export default function Header ({ accountButton, logoutButton }) {
    return(
        <div className="header">
            <header>
                <img className="bee-logo" src="/bee2.png" alt="logo"/>
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