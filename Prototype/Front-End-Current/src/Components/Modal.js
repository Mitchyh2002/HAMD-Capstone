import '../App.css';
import '../modules/mst/admin.css';
import React from "react";

/* A simple modal componant that just shows a message.
props.message - the message that will be displayed on the modal. */

export default function MessageModal(props){

    let show = props.show;

    /* Setting the state for the modal */
    const toggleModal = () => {
        show = false;
        props.change(false);
    }

    return(
        <>
         {show && (
                <div className="modal">
                    <div onClick={toggleModal} className='overlay'></div>
                    <div className='modal-content'>
                        <button className='close-modal' onClick={toggleModal}>
                            x
                        </button>
                        <h4 className='message-modal-heading'>{props.title}</h4>
                        <p className='modal-text-message'>
                            {props.message}
                        </p>
                        <br></br>
                        <br></br>
                        <button className='buttons okay-button' onClick={toggleModal}>
                            Okay
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}