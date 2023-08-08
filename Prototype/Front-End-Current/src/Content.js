import React, { useState, useEffect } from "react";
import "./moduleDefs.js";
import Components from "./moduleDefs.js";
import axios from "axios";

//maps the module to a key value which will be module id sent from the server
function mapModules(modules){
  let moduleMap = new Map();

  for (let i = 0; i < modules.length; i++) {
    //Map key = moduleID item moduleObject
    moduleMap.set(modules[i].prefix, modules[i]);
  }

  return moduleMap
}

//Main Body of the application
export default function Content(props){
  const [modules, setModules] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [index, setIndex] = useState("");//Define state for switching between modules, 0 will be replaced by a default ID

  //Load Data on mount
  useEffect(() => {
    const data = fetch("http://localhost:5000/module/getactive")
    .then( response => {
        return response.json();
    }).then(data => {
      setModules(data.Values)
    }).then(() => {
      setLoaded(true);
    })
  }, []);

  //Loaded initial objects
  useEffect(() => {
    if (loaded == true){
    setIndex(modules[0].prefix);}
  }, [loaded]);

  //console.log(modules[0].prefix);

  
  const moduleMap = mapModules(modules);

  console.log(moduleMap)

  //Handler function for setting up the submenu
  const handler = (num) => {
    setIndex(num);
  }

    return (
      <>
        <div style={{display: "flex", flexDirection:"row", flexGrow: 1}}>
          <div className="wrapperMainNav" style={{maxWidth:"172px"}}>
            <div style={{height: "auto",  display: "flex", justifyContent: "center"}}>
                <h3 style={{color: "white", margin: "5px", fontWeight: "bold"}}>Modules</h3>
            </div>
            {modules.map(module  => <button className="mainNavItem" onClick={e => handler(module.prefix)} key={module.prefix}><p>{module.displayName}</p></button>)}
          </div>
        
          <div className="flexBoxRowGrow">
            {(loaded == false)? <p>Loading modules...</p> : <Components module={moduleMap.get(index)} /> }
            </div>
        </div>
      </>)
}
