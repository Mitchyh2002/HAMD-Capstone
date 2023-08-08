import "./moduleDefs.js";
import {Outlet, useHref } from "react-router-dom";
import NavMenu from "Components/NavMenu.jsx";
import React from "react";
import SubMenu from "Components/SubMenu.js";

//Main Frame of applications after the user has logged in
export default function Content(props){
  
  //Extract the current module from the url
  const homeRegEx = RegExp("\/(.{3})");
  const location = homeRegEx.exec(useHref())[1];
  console.log(location);
 
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
