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
        formData.append('modulePrefix', props.prefix)
        const response = updateName(formData).then(res =>{
            console.log(res);
            window.alert(res.Message);
        });
    }

    return (
        <>
            {show && (
                <div className="modal">
                    <div onClick={toggleModal} className='overlay'></div>
                    <div className='modal-content'>
                        <button className='close-modal' onClick={toggleModal}>
                            x
                        </button>
                        <h4 className='modal-heading'>Edit</h4>
                        <form id="modalForm">
                            <label className='modal-label'>{props.label1}
                                <input className='modal-input' type="text" name="displayName"/>
                            </label>                            
                            <label className='modal-label'>Module Key
                                <input className='modal-input' type="text" name="modulePass"/>
                            </label>                            
                            <label className='modal-label'>Prefix
                                <input disabled className='modal-input' type="text" name="modulePrefix" value={props.prefix}/>
                            </label>
                        </form>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                        <button className='buttons confirm-button' onClick={updatePlugin}>
                            Confirm Changes
                        </button>
                        <button className='buttons cancel-button' onClick={toggleModal}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}
