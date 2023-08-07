//REGEX_START
import Upload from "./modules/mst/main.js";
import { pages } from "./modules/mst/main.js";
//IMPORT_END

//Defintion of components, correlates the module id of the database to the component
export const Modules = {
    mst: Upload
}

export const Directory = {
  mst: pages
}

//REGEX_END