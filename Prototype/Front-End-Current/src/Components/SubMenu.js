import React, { useState } from "react";
import { Directory } from "moduleDefs";
import { NavLink, useHref, useMatch, useMatches, useNavigate } from "react-router-dom";
import "../App.css"
import Breadcrumbs from "Components/Breadcrumbs.js";

/*Sub Menu
    Description: SubMenu for all sub components of and corresponding links based on the values defined in modulesDefs.js
    Props: 
        prefix: Prefix of the module, Used to determine sub components from modules def
    SubMenu with working links
*/

export default function SubMenu(props) {
    //Extract sub components from directory
    const subComponents = Directory[props.prefix];

    //Creates the navlinks objects
    //Input: function
    //Output: Button with onClick call to input
    function createNavLinks(component) {
        return (
            <div style={{ display: "flex", alignItems: "center" }}>
                <SubNavButton activeClass="subNavHighlight" passiveClass="navButton" to={component.path} name={component.path} />
            </div>
        )
    }

    //Set state for toggle button to hide sub nav bar
    const [show, setShow] = useState(true);

    return (
        <>
            <div className="subNavContainer">
                <div>
                    <button type="button" onClick={() => setShow(!show)} className="toggle-button">
                        <img className="menu-icon" src="/menu.png" alt="menu" />
                    </button>
                </div>
                {show &&
                    <div className="navButtonContainer">
                        {subComponents &&
                            <div className="flexBoxColumnGrow subNavBar" style={{ maxWidth: "160px" }}>
                                <h5 style={{color: "var(--black)", margin: "5px", fontWeight: "normal"}}>Menu</h5>
                                {subComponents.map(component => createNavLinks(component))}
                            </div>}
                    </div>}
            </div>
        </>
    )
}

/*
    {subComponents.map(component, index => createNavLinks(component))}

    Sub Nav Button
    Links to a given location, know when it is active and changes classes accrodingly
    Props:
        to: Link destination
        name: Text to display
        activeClass: Name of the active class name to display
        passiveClass: Name of the passive(inactive) class to display
*/

function SubNavButton(props) {
    const navigate = useNavigate();
    const href = useHref();
    let sanatizedTo = encodeURI(props.to);
    const regEx = "\/" + sanatizedTo.replaceAll("\/", "\\\/");
    const active = (RegExp(regEx).exec(href) != null);

    const handleClick = () => {
        navigate(props.to);
    }

    return (
        <button onClick={handleClick} className={(active) ? props.activeClass : props.passiveClass}>{props.name}</button>
    )

}