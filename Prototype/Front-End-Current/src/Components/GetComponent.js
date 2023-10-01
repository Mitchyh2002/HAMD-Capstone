import { Modules } from "moduleDefs";
import React from "react";

//This takes a object passed from the content.js matches it to a module and creates that component to return to the DOM
export default function GetComponent(props) {
    //Check module exists within defintion
    if (typeof props.module !== "undefined") {
      //create component and return
      return React.createElement(Modules[props.module.prefix]);
    }
    //return error in the form of a component
    return React.createElement(
      () => <div>Looks like something went wrong... We couldnt find your module in our system!</div>
    );
  };