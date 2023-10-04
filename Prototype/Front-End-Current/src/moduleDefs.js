import mst_master from "./modules/mst/main.js";
import { mst_pages } from "./modules/mst/main.js";
import { grp_Main } from "./modules/grp/main.js";
//IMPORT_END

//Defintion of components, correlates the module id of the database to the component
export const Modules = {
    mst: mst_master,
    grp: grp_Main
   }

export const Directory = {
  mst: mst_pages,
  grp: []
}

