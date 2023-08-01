//Module Imports, this will be appended by custom Python script on install
//REGEX_START
import upload from "./modules/UploadPlugin/main.js";
import React from "react";

//Defintion of components, correlates the module id of the database to the component
export const Components = {
    mst: upload
}

//REGEX_END
//This takes a object passed from the content.js matches it to a module and creates that component to return to the DOM
export default block => {
    //Check module exists within defintion
    if (typeof block.module !== "undefined") {
      //create component and return
      return React.createElement(Components[block.module.prefix]);
    }
    //return error in the form of a component
    return React.createElement(
      () => <div>Looks like something went wrong... WE couldnt find your module in our system!.</div>
    );
  };