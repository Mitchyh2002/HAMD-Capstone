import React from "react";
import SubComponents1 from "./Sub Items/subComponent1";
import SubComponents2 from "./Sub Items/subComponent2";
import SubMenu from "Components/SubMenu.js";
import battery from "./icons/battery.svg"

let subComponents = [
    {
        component: <SubComponents1 />,
        name: "Sub1",
        icon: battery
    },
    {
        component: <SubComponents2 />,
        name: "Sub2"
    }
]

export default function test(){
    return (
    <SubMenu subComponents={subComponents} />
    )
}
