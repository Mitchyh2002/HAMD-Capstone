import React from "react";
import '../App.css';

export default function Header ({ accountButton, logoutButton }) {
    return(
        <div className="header">
            <header>
                <img className="bee-logo" src="/bee2.png" alt="logo"/>
                    <nav>
                        <ul>
                            <li><a href="#!">{accountButton}</a></li>
                            <li><a href="#!">{logoutButton}</a></li>
                        </ul>
                    </nav>
            </header>
        </div>
    )
};