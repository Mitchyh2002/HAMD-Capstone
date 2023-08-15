import { getElementError } from "@testing-library/react";
import { updateName } from "./loaderFunctions";


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
        { show&& (
            <div className="modal">
                <div onClick={toggleModal} className='overlay'></div>
                <div className='modal-content'>
                    <button className='close-modal' onClick={toggleModal}>
                        x
                    </button>
                    <h4 className='modal-heading'>Edit</h4>
                    <form id="modalForm">
                        <label className='modal-label'>Change display name:
                            <input className='modal-input' type="text" />
                        </label>
                        <input className='confirm-button' type="submit" />
                    </form>
                    <br></br>
                    <br></br>
                    <button className='confirm-button' onClick={updatePlugin}>
                        Confirm Changes
                    </button>
                    <button className='cancel-button' onClick={toggleModal}>
                        Cancel
                    </button>
                </div>
            </div>
        )}
        </>
    )
}
