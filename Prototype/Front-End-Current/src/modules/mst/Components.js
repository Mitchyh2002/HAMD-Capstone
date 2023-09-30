import { getElementError } from "@testing-library/react";
import { updateName } from "./loaderFunctions";
import { useState } from "react";
import "./admin.css";


export default function Modal(props) {

    let show = props.show;

    /* Setting the state for the modal */
    const toggleModal = () => {
        show = false;
        props.change(false);
    }

    const updatePlugin = () => {
        const form = document.getElementById("modalForm");
        const formData = new FormData(form);
        const response = updateName(formData);
        console.log(response);
        window.alert("hello")
    }

    return (
        <>
            {show && (
                <div className="modal">
                    <div onClick={toggleModal} className='overlay'></div>
                    <div className='modal-content'>
                        <div className='flexBoxColumnGrow'>
                            <h4 className='modal-heading'>Edit</h4>
                            <form id="modalForm">
                                <label className='modal-label'>{props.label1}
                                    <input className='modal-input' type="text" />
                                </label>
                            </form>
                            <button className='buttons confirm-button' onClick={updatePlugin}>
                                Confirm Changes
                            </button>
                            <button className='buttons cancel-button' onClick={toggleModal}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export const ToolTip = ({ text, children }) => {
    const[isVisible, setIsVisible] = useState(false);

    return(
        <div 
            className="tooltip-container"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            {isVisible && <div className="tooltip">{text}</div>}
        </div>
    )
}
