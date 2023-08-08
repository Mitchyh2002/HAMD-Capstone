import React, {useState} from "react";
import "../App.css"
//Submenu for storing components
//Input: Array of components {name: "string", component: function}
//Outputs: Array of buttons
export default function SubMenu(props){

    const subComponents = props.subComponents;
    console.log(props);
    let [index, setIndex] = useState(subComponents[0]);

    //Creates the buttons
    //Input: function
    //Output: Button with onClick call to input
    function createButton(item){
        return(
            <div>
                <button className="navButton" onClick={e => handler(item)}>{item.name}</button>
            </div>
        )
    }

    //For changing which sub component is being shown
    function handler(component){
        setIndex(component);
    }

    console.log(index)
    return(
        <div className="flexBoxRowGrow">
            <div className="flexBoxColumnGrow subNavBar" style={{maxWidth: "160px"}}>
                {subComponents.map(e => createButton(e))}
            </div>
            <div className="flexBoxRowGrow">
                {React.createElement(index.component)}
            </div>
        </div>
    )
}