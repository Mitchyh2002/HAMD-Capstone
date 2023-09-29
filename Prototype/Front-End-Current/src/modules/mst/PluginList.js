import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTable } from "react-table";
import { useLoaderData } from 'react-router-dom';
import { getPlugins } from "./loaderFunctions";
import {Modal, ActivateModal} from './Components.js';
import "./admin.css";

export default function PluginList() {

    //State
    /* Calls to the loader function defined in main.js */
    const [plugins, setPlugins] = useState(useLoaderData());
    const [refresh, setRefresh] = useState(true);
    
    const refreshData = () =>{
        getPlugins().then(res => {
            setPlugins(res);
        })
    }

    useEffect(() => {
        if (refresh == true){
            refreshData();
            setRefresh(false);
        }
    }, [refresh]);

    useEffect(() => {
        refreshData();
    }, [])

    return (
        <PluginTable refresh = {setRefresh} plugins={plugins} />
    )
};

function PluginTable (props){
    const [modal, setModal] = useState(false);
    const [activateModal, setActivateModal] = useState(false);
    const [prefix, setPrefix] = useState();
    const [moduleStatus, setModuleStatus] = useState();


    /* Getting the data from the database  */
    //const data = useMemo(() => props.plugins, [props.plugins])
    const data = props.plugins;
    const columns = useMemo(() => [
        {
            Header: "Prefix",
            accessor: "prefix",
        },{
            Header: "Display Name",
            accessor: "displayName",
        }
    ], []);

    const tableInstance = useTable({columns, data});
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;


    //Functions
    const toggleModal = (prefix) => {
        setPrefix(prefix);
        setModal(!modal);
    }

    const toggleActivateModal = (status, prefix) => {
        setPrefix(prefix);
        setActivateModal(!activateModal);
        setModuleStatus(status);
    }
    return(
    <>
    <div className="pluginPage">
        <h2>Plugins</h2>
        <div className="pluginTable">
            <table {...getTableProps()}>
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
                                    <button onClick={() => {toggleModal(row.values.prefix)}} className="btn-modal">
                                        Edit
                                    </button>
                                    |
                                    <button className="btn-modal delete-btn" onClick={() => {toggleActivateModal(row.original.status, row.original.prefix)}}>
                                        {row.original.status == true ? "Deactivate" : "Activate"}
                                    </button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    </div>
    {modal && (
        <Modal label1="Change Display Name:" show={modal} change={setModal} prefix={prefix} refresh={props.refresh}/>
    )}
    {activateModal && (
        <ActivateModal label1="Enter Module Key:" show={activateModal} change={setActivateModal} prefix={prefix} status={moduleStatus} refresh={props.refresh}/> 
    )}
</>
    )
}

