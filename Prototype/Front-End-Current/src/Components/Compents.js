import React from "react";
import '../App.css';

export default function Header() {
   

    return(
        <div className="header">
            <header>
                <img className="bee-logo" src="/bee2.png" alt="logo"/>
                    <nav>
                        <ul>
                            <li><a href="#!">Account</a></li>
                            <li><a className="a3" href="#!">Logout</a></li>
                        </ul>
                    </nav>
            </header>
        </div>
    )
};