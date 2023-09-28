import { useNavigate, NavLink, useHref } from "react-router-dom";
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
                    {props.modules.map(module => {
                        console.log(module);
                        return (<ModuleContainer to={module.prefix} name={module.displayName} icon="/icons/mst.png" />)
                    })}
                </div>
            </div>
        </>
    )
}

function ModuleContainer(props) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(props.to);
    }

    return (
        <>
            <div className="modulecontainer">
                <button onClick={handleClick} className="modulebutton">
                    <img src={props.icon} style={{width: "120px", height: "120px"}} />
                    <br></br>
                    {props.name}
                </button>
            </div>
        </>
    )
}