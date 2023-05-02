import React, {useState} from "react";

//Submenu for storing components
//Input: Array of components {name: "string", component: function}
//Outputs: Array of buttons
export default function SubMenu(props){

    const subComponents = props.subComponents;
    let [index, setIndex] = useState(subComponents[1].component);

    //Creates the buttons
    //Input: function
    //Output: Button with onClick call to input
    function createButton(item){
        return(
            <div style={{display: "flex", alignItems: "center"}}>
                <img src={item.icon} style={{width: "30px", height: "30px"}}></img><button onClick={e => handler(item.component)}>{item.name}</button>
            </div>
        )
    }

    //For changing which sub component is being shown
    function handler(component){
        setIndex(component);
    }

    return(
        <div style={{display: "flex", flexDirection: "row"}}>
            <div style={{width: "20%", display: "flex", flexDirection: "column"}}>
              {subComponents.map(e => createButton(e))}
            </div>
            <div>
                {index}
            </div>
        </div>
    )
}