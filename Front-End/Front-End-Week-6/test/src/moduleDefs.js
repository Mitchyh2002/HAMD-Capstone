//Module Imports, this will be appended by custom Python script on install
import test from "./modules/ModuleExample/main.js";
import Test2 from "./modules/ModuleTest2/main.js";
import React from "react";

//Defintion of components, correlates the module id of the database to the component
export const Components = {
    id1: test,
    id2: Test2
}

//This takes a object passed from the content.js matches it to a module and creates that component to return to the DOM
export default block => {
    //Check module exists within defintion
    if (typeof Components[block.module.id] !== "undefined") {
      //create component and return
      return React.createElement(Components[block.module.id]);
    }
    //return error in the form of a component
    return React.createElement(
      () => <div>The component {block.module.component} has not been created yet.</div>
    );
  };