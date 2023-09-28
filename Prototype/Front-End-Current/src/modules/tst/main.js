import { Page1, loaddata } from "./page1";
import { Page2 } from "./page2";
import { ChildPage } from "./childpage";
//Define Pages to pass to Sub Navigations
export const tst_pages = [{
    path: "Page1",
    element: Page1,
    loader: loaddata,
    children: [
        {
            path: "Child",
            element: <ChildPage />
        }
    ]
},{
    path: "Page2",
    element: Page2
}];



export default function tst_master(){
    return(
        <div className="flexBoxRowGrow">
            <h1>This is my app</h1>
        </div>
    )
}