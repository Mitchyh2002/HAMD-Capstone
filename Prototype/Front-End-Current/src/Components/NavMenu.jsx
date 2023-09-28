import { useNavigate, NavLink } from "react-router-dom";

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