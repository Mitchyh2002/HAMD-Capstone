import { ToolTip } from "modules/mst/Components.js";
import { Link } from "react-router-dom";

/* Displays a footer in the landing page. 
Allows a user to download t&c's file. */

export default function Footer() {

    return (
        <>
            <div className='footer'>
                <div className='left20px'>
                    <h4 className="account-header" style={{ marginBottom: "10px" }}>About</h4>
                    <div className="flexBoxColumnGrow" style={{ maxWidth: "170px" }}>
                        <ToolTip style={{ fontSize: "10px" }} text="Click here to download terms & conditions file.">
                            <button className="text-button"> - Terms & Conditions</button>
                        </ToolTip>
                    </div>
                </div>
            </div>
        </>
    )
}