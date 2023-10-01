import { useNavigate, NavLink, useHref } from "react-router-dom";

/*Main Nav Menu
    Props:
        modules: List of modules to determine which items to display
            {
                prefix: module prefix, determines where to navigate
                displayName: Display name that will appear on the button
                Icon: Where to pull the icon from and display on the nav menu
            }

    Outputs:
    Navigation bar with interactable buttons that navigate to corresponding module pages
*/

export default function NavMenu(props) {
    const navigate = useNavigate();

    const handler = (prefix) => {
        const destination = "/" + prefix;
        navigate(destination);
      }


    return(
        <div className="wrapperMainNav" style={{maxWidth:"172px"}}>
            <div style={{height: "auto",  display: "flex", justifyContent: "center"}}>
                <h3 style={{color: "white", margin: "5px"}}>Modules</h3>
            </div>
            {props.modules.map(module  => {
                console.log(module);
                return (<NavMenuButton activeClass="mainNavItemActive" passiveClass="mainNavItem" to={module.prefix} name={module.displayName} icon="/icons/mst.png"/>)})}
        </div>
    )
}

function NavMenuButton(props) {
    const navigate = useNavigate();
    const href = useHref();
    let sanatizedTo = encodeURI(props.to);
    const regEx = "\/" + sanatizedTo.replaceAll("\/", "\\\/");
    const active = (RegExp(regEx).exec(href) != null);

    const handleClick = () => {
        navigate(props.to);
    }

    return(
        <button onClick={handleClick} className={(active)? props.activeClass: props.passiveClass}>
            <img src={props.icon} style={{width: "60px", height: "60px"}}/>
            <br></br>
            {props.name}
        </button>
    )

}