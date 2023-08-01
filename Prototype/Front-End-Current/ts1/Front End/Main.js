import React from "react";
import { useState } from "react";
import Page1 from "./page2";
import Page2 from "./page2";

export default function Example(params) {

    const [page, setPage] = useState(page1);
    
    const changePage = (page) =>{
        setPage(page);
    }
    
    return(
        <div>
            <div>
                <button onClick={changePage(page1)}>Page 1</button>
                <button onClick={changePage(page2)}>Page 2</button>
            </div>
            <div>
                {page}
            </div>
        </div>
    )
}