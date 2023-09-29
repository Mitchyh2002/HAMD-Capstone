import "./loader.css"

export function AppLoader(props) {
    return(
        <div style={{height: "100vh", width: "100vw", display: "flex", justifyContent: "center", alignItems: "center"}}>
            <img className="bee-logo appLoader" alt="logo" style={{margin: "0px", padding: "0px", height: "200px", width: "200px"}}></img> 
        </div>
    )
}