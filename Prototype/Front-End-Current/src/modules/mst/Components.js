import { Form } from "react-router-dom";
import { activateModule, deactivateModule, updateName } from "./loaderFunctions";
import { useRef, useState } from "react";


export function Modal(props) {

    let show = props.show;
    const [error, setError] = useState(false);
    const [success, setSucces] = useState(false);

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
            setSucces(res.Success);
            setError(!res.Success);
            if(res.Success){
                props.refresh(true);
            }
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
                        {success == true && <label className="modal-label" style={{color: 'Green'}}>Your module has been updated</label>}
                        {error == true && <label className="modal-label" style={{color: 'Red'}}>Something went wrong! Check your module key is correct</label>}
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

export function ActivateModal(props) {

    let show = props.show;
    const [error, setError] = useState(false);
    const [success, setSucces] = useState(false);
    const passRef = useRef();

    /* Setting the state for the modal */
    const toggleModal = () => {
        show = false;
        props.change(false);
    }

    const updatePlugin = (prefix, active) => {
        const form = new FormData();
        form.append('modulePrefix', props.prefix)
        if(props.status == true) {
            const response = activateModule(form).then(res =>{
                setSucces(res.success);
                setError(!res.success);
                if(res.Success){
                    props.refresh(true);
                }
            })
            }else{
                const response = deactivateModule(form).then(res =>{
                    setSucces(res.success);
                    setError(!res.success);
                    if(res.Success){
                        props.refresh(true);
                    }
                })
            }
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
                        {success == true && <label className="modal-label" style={{color: 'Green'}}>Your module has been updated</label>}
                        {error == true && <label className="modal-label" style={{color: 'Red'}}>Something went wrong! Check your module key is correct</label>}
                        <form id="modalForm">                        
                            <label className='modal-label'>Module Key
                                <input className='modal-input' type="text" name="modulePass" ref={passRef}/>
                            </label>
                        </form>
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
