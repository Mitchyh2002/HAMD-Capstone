//REGEX_START
import tst_master, { tst_pages } from "modules/tst/main.js";
import random from "./modules/mst/main.js";
import { pages } from "./modules/mst/main.js";
//IMPORT_END

//Defintion of components, correlates the module id of the database to the component
export const Modules = {
    mst: random,
    tst: tst_master
}

export const Directory = {
  mst: pages,
  tst: tst_pages
}

//REGEX_END