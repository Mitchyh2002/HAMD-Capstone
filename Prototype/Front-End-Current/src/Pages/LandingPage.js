import { useNavigate, NavLink, useHref } from "react-router-dom";
import Footer from "Components/Footer.js"
import './Login.css';

export default function LandingPage(props) {

    return (
        <>
            <div className="landingdiv">
                <div className='toppage'>
                    <img className="landing-image" alt="flying-bees" />
                    <h2 className="main-title">Bee Aware</h2>
                </div>
                <div className='bottompage'>
                    {props.modules&& props.modules.map(module => {
                        console.log(module);
                        return (<ModuleContainer to={module.prefix} name={module.displayName} setModuleClick={props.setModuleClick} icon="/icons/mst.png" />)
                    })}
                </div>
                <Footer />
            </div>
        </>
    )
}

function ModuleContainer(props) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(props.to);
        props.setModuleClick(true);
    }

    return (
        <>
            <div className="modulecontainer">
                <button onClick={handleClick} className="modulebutton">
                    <img src={props.icon} style={{width: "90px", height: "90px"}} />
                    <br></br>
                    {props.name}
                </button>
            </div>
        </>
    )
}