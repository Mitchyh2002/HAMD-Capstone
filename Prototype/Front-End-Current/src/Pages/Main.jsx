import Header from "Components/Header"
import Content from "Content"
import { Outlet } from "react-router-dom"

export default function Main(props) {
    return(
        <div style={{display: 'flex', flexDirection: 'column', height: "100vh"}}>
            <Header />
            <Content modules={props.modules}/>
        </div>
    )
}