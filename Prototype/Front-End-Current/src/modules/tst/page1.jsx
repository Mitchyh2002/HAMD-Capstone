import { Outlet, useLoaderData, useOutlet } from "react-router-dom"

export function loaddata() {
    return(
        {
            name : "Random Data",
            data: "this is some random contents"
        }
    )
}

export function Page1 () {
    const pageData = useLoaderData();
    const child = useOutlet();
    return(
        <div style={{display: "flex", flexDirection: "column"}}>
            {!child? <div>
            <h1>This is page {pageData.name}</h1>
            <p>{pageData.data}</p> </div>:
            <Outlet />}
        </div>
    )
}