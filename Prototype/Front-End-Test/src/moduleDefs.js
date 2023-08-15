//REGEX_START
import random from "./modules/mst/main.js";
import { pages } from "./modules/mst/main.js";
import { df1_main } from "./modules/df1/main.js";
//IMPORT_END

//Defintion of components, correlates the module id of the database to the component
export const Modules = {
    mst: random,
    df1: df1_main
}

export const Directory = {
  mst: pages,
    df1: []
}
//REGEX_END




