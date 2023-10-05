import { activateModule, deactivateModule, updateName } from "./loaderFunctions";
import { useRef, useState, useEffect, useMemo } from "react";
import "./admin.css";
import { baseUrl } from "config";
import { getToken } from "Functions/User";
import { useTable } from "react-table";



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
                    <div className='modal-content flexBoxColumnGrow'>
                        <h4 className='modal-heading'>Edit</h4>
                        {success == true && <label className="modal-label" style={{display:"flex", color: 'Green', justifyContent:"center"}}>Your module has been updated.</label>}
                        {error == true && <label className="modal-label error-message" style={{ display:"flex", justifyContent:"center"}}>Something went wrong! Check your module key is correct.</label>}
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

export function PagesModal(props) {

    let show = props.show;
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [pages, setPages] = useState([]);
    const [message, setMessage] = useState();

    const data = useMemo(() => pages, [pages]);
    const columns = useMemo(() => [
        {
            Header: "Code",
            accessor: "pageCode"
        }, {
            Header: "Name",
            accessor: "pageName",
            Cell: ({value, row}) => (<input defaultValue={value} style={{fontSize: "16px", padding: "0px", background: "none"}} onChange={(e) => updateValue(e, row.index, "pageName")}/>)
        }, {
            Header: "Description",
            accessor: "description",
            Cell: ({value, row}) => (<input defaultValue={value} style={{fontSize: "16px", padding: "0px", background: "none"}} onChange={(e) => updateValue(e, row.index, "description")}/>)

        }, {
            Header: "Level",
            accessor: "securityLevel",
            Cell: ({value, row}) => (<input defaultValue={value} type="number" style={{fontSize: "16px", padding: "0px", background: "none"}} onChange={(e) => updateValue(e, row.index, "securityLevel")}/>)

        }
    ], [pages]);

    /* Setting react useTable */
    const tableInstance = useTable({ columns, data });
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

    /* Setting the state for the modal */
    const toggleModal = () => {
        show = false;
        props.change(false);
    }

    const updateValue = (e, index, modifer) => {
        console.log(pages)
        try {
             pages[index][modifer] = e.target.value;
             setPages(data);
        } catch (error) {
            console.log(error)   
        }
    }

    const updatePage = async (index) => {
        const form = new FormData();
        form.append("modulePrefix", props.prefix)
        form.append("pageName", pages[index].pageName)
        form.append("pageDescription", pages[index].description)
        form.append("securityLevel", pages[index].securityLevel)
        form.append("pageCode", pages[index].pageCode)
        console.log(form)

        try {
            const res = await fetch(baseUrl + "/mst/module/updatePage", {
                method: "POST",
                headers: {"Authorization": getToken()},
                body: form
            });
            const json = await res.json();

            if(json.Success){
                setSuccess(true);
                setError(false)
            }else{
                setError(true)
                setSuccess(false)
                setMessage(json.message);
            }
        } catch (error) {
            console.log(error);
            setError(true);
            setSuccess(false);
            setMessage("Uh-oh looks like something went wrong. If the issue persists try refreshing the page");
        }

    }

    const getPages = async () => {
        try {
            const form = new FormData();
            form.append("modulePrefix", props.prefix);

            const res = await fetch(baseUrl + "/mst/module/getall_pages", {
                method: "POST",
                headers: {"Authorization" : getToken()},
                body: form
            })
            const json = await res.json();
            if(json.Success){
                console.log(json.Values)
                setPages(json.Values);
                setError(false)
            }else{
                setError(true);
                setMessage(json.Message)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {getPages()}, []);

    return (
        <>
            {show && (
                <div className="modal">
                    <div onClick={toggleModal} className='overlay'></div>
                    <div className='modal-content' style={{minWidth: "70vw"}}>
                        <button className='close-modal' onClick={toggleModal}>
                            x
                        </button>
                        <h4 className='modal-heading'>Edit</h4>
                        {success == true && <label className="modal-label" style={{color: 'Green'}}>Your module has been updated!</label>}
                        {error == true && <label className="modal-label" style={{color: 'Red'}}>{message}</label>}
                        <div className="pluginTable">
                            <table style={{boxShadow:"none"}}{...getTableProps()}>
                                <thead>
                                    {headerGroups.map((headerGroup) => (
                                        <tr {...headerGroup.getHeaderGroupProps()}>
                                            {headerGroup.headers.map((column) => (
                                                <th{...column.getHeaderProps()}>
                                                    {column.render("Header")}
                                                </th>
                                            ))}
                                            <th>
                                                Action
                                            </th>
                                        </tr>
                                    ))}
                                </thead>
                                <tbody {...getTableBodyProps()}>
                                    {rows.map((row) => {
                                        prepareRow(row)
                                        return (
                                            <tr{...row.getRowProps()}>
                                                {row.cells.map((cell) => (
                                                    <td className="pluginTableCell"{...cell.getCellProps()}>
                                                        {cell.render("Cell")}
                                                    </td>
                                                ))}
                                                <td>
                                                    <button onClick={() => {updatePage(row.index)}} className="btn-modal">
                                                        Submit
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                            <div style={{display: "flex", paddingTop:"20px", justifyContent:"center"}}>
                            <button className='buttons confirm-button' onClick={toggleModal} >
                            Close
                        </button>
                        </div>
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
