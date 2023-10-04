import React from "react";
import { useState } from "react";
import {child} from './child.js';

export function df1_Main (params){
    return(
    <h1> Base Route Page </h1>
    );
}

export const df1_pages = [{
    path: "child",
    pageCode: "1",
    Description: "Child",
    userAccessLevel: 1,
    element: child,
    loader: ''
}]