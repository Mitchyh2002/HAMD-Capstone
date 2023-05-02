import React, { useState } from "react";
import "./moduleDefs.js";
import Components from "./moduleDefs.js";

//example test data for the json returned from the server. This will be replaced with a function that is called on page load
const data = {
    content: {
      body: [
        {
          id: "id1",
          component: "test"
        },
        {
          id: "id2",
          component: "anothertest"
        },
        {
          id: "id3",
          component: "test"
        }
      ]
    }
  };

//Map of all the modules
const moduleMap = mapModules(data.content.body);

//maps the module to a key value which will be module id sent from the server
function mapModules(modules){
  let moduleMap = new Map();

  for (let i = 0; i < modules.length; i++) {
    //Map key = moduleID item moduleObject
    moduleMap.set(modules[i].id, modules[i]);
  }

  return moduleMap
}

//Main Body of the application
export default function Content(){
  //Define state for switching between modules, 0 will be replaced by a default ID
  const [index, setIndex] = useState(data.content.body[0].id);

  //Handler function for setting up the submenu
  function handler(num) {
    setIndex(num);
  }

    return (
        //Create Navigation Menu then
        <div style={{display: "flex"}}>
          <div style={{width:"25%", display: "flex", flexDirection: "column"}}>
            {data.content.body.map(data  => <button onClick={e => handler(data.id)} key={data.id}>{data.component}</button>)}
          </div>
        
          <div style={{width:"75%"}}>
            <p>index is {index}</p>
            <Components module={moduleMap.get(index)} />
            </div>
        </div>)
}
