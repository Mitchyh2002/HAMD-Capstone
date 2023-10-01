import "./moduleDefs.js";
import {Outlet} from "react-router-dom";
import NavMenu from "Components/NavMenu.jsx";
import React from "react";

//Main Frame of applications after the user has logged in
export default function Content(props){
  console.log(props.modules)

    return (
      <>
        <div style={{display: "flex", flexDirection:"row", flexGrow: 1}}>
          <NavMenu modules={props.modules} />
        <div className="flexBoxRowGrow">
            {(props.modules)? <Outlet /> : <p>Loading Modules...</p>}
            </div>
        </div>
      </>)
}