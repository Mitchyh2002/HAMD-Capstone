import "./moduleDefs.js";
import {Outlet, useHref, useOutlet } from "react-router-dom";
import NavMenu from "Components/NavMenu.jsx";
import React from "react";
import SubMenu from "Components/SubMenu.js";

//Main Frame of applications after the user has logged in
export default function Content(props){
  const child =useOutlet();
  console.log(child);
  
  //Extract the current module from the url
  const homeRegEx = RegExp("\/(.{3})");
  const regExResults = homeRegEx.exec(useHref());
  let location;
  //If empty set to null
  regExResults? location = regExResults[1] : location = "null";
 
    return (
      <>
        <div style={{display: "flex", flexDirection:"row", flexGrow: 1}}>
          <NavMenu modules={props.modules} />
          <SubMenu prefix={location} />
        <div className="flexBoxRowGrow">
            {(props.modules)? <Outlet /> : <p>Loading Modules...</p>}
            </div>
        </div>
      </>)
}
