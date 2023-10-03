//REGEX_START
import mst_master from "./modules/mst/main.js";
import { mst_pages } from "./modules/mst/main.js";
import {  df1_Main } from "./modules/df1/main.js";
//IMPORT_END

//Defintion of components, correlates the module id of the database to the component
export const Modules = {
    mst: mst_master,
    df1: df1_Main
   }

export const Directory = {
  mst: mst_pages,
    df1: []
}

//REGEX_END





