import { baseUrl } from "config";
import { Modal, ToolTip } from "modules/mst/Components.js";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import MessageModal from "./Modal";

/* Displays a footer in the landing page. 
Allows a user to download t&c's file. */

export default function Footer() {
    const [termText, setTermText] = useState();
    const [termShow, setTermShow] = useState(false);
    const handleTerms = () => {
        setTermShow(true);
    }

    useEffect(() => {
        const run = async () => {
            try {
                const terms = await fetch("/terms.txt");
                const res = await terms.text();
                const text = res.replace(/(?:\r\n|\r|\n)/g, '<br>');
                setTermText(text);

            } catch (error) {
                console.log(error);
            }
        }
        run();
        
    }, [])

    return (
        <>
            <div className='footer'>
                <div className='left20px'>
                    <h4 className="account-header" style={{ marginBottom: "10px" }}>About</h4>
                    <div className="flexBoxColumnGrow" style={{ maxWidth: "170px" }}>
                        <ToolTip style={{ fontSize: "10px" }} text="Click here to download terms & conditions file.">
                            <button className="text-button" onClick={handleTerms}> - Terms & Conditions</button>
                        </ToolTip>
                    </div>
                </div>
            </div>
            <MessageModal show={termShow} message={termText} change={setTermShow} style={{maxHeight: "90%", maxWidth: "90%"}}/>
        </>
    )
}