import { ToolTip } from "modules/mst/Components.js";
import { Link } from "react-router-dom";

export default function Footer() {

    return (
        <>
            <div className='footer'>
                <div className='left20px'>
                    <h4 className="account-header" style={{ marginBottom: "10px" }}>About</h4>
                    <div className="flexBoxColumnGrow">
                        <ToolTip style={{ fontSize: "10px" }} text="Click here to download terms & conditions file.">
                            <button className="text-button"> - Terms & Conditions</button>
                        </ToolTip>
                        <ToolTip style={{ fontSize: "10px" }} text="Click here to download privacy policy file.">
                            <button className="text-button"> - Privacy Policy</button>
                        </ToolTip>
                    </div>
                </div>
            </div>
        </>
    )
}