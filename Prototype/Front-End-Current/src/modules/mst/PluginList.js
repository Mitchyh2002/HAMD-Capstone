import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTable } from "react-table";
import { useLoaderData } from 'react-router-dom';
import { getPlugins, activateModule, deactivateModule } from "./loaderFunctions";
import {Modal, ActivateModal, PagesModal} from './Components.js';
import "./admin.css";

export default function PluginList() {

    //State
    /* Calls to the loader function defined in main.js */
    const [plugins, setPlugins] = useState(useLoaderData().Values);
    const [refresh, setRefresh] = useState(true);
    !plugins && setPlugins([])
    
    const refreshData = () =>{
        getPlugins().then(res => {
            setPlugins(res.Values);
            !res.Values && setPlugins([]);
        }).catch(err => {
            console.log(err);
        })
    }

    useEffect(() => {
        console.log("refresh")
        if (refresh == true){
            refreshData();
            setRefresh(false);
        }
    }, [refresh]);

    return (
        <PluginTable refresh = {setRefresh} plugins={plugins} />
    )
};

function PluginTable (props){
    const [modal, setModal] = useState(false);
    const [prefix, setPrefix] = useState();
    const [pagesModal, setPagesModal] = useState(false)


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
    console.log(data)

    const tableInstance = useTable({columns, data});
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;


    //Functions
    const toggleModal = (prefix) => {
        setPrefix(prefix);
        setModal(!modal);
    }

    const togglePagesModal = (prefix) => {
        setPrefix(prefix);
        setPagesModal(!modal);
    }

    const toggleModuleActivation = (status, prefix) => {
        const form = new FormData();
        console.log(status);
        form.append('modulePrefix', prefix)
        if(status == false) {
            const response = activateModule(form).then(res => {
                if(res.Success){
                    props.refresh(true);
                }
            })
            }else{
                const response = deactivateModule(form).then(res =>{
                    if(res.Success){
                        props.refresh(true);
                    }
                })
            }
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
                                    <button disabled={row.values.prefix == "mst"} onClick={() => {toggleModal(row.values.prefix)}} className="btn-modal">
                                        Edit
                                    </button>                                    | 
                                    <button  className="btn-modal " onClick={() => {togglePagesModal(row.original.prefix)}}>
                                        Pages
                                    </button>
                                    |
                                    <button disabled={row.values.prefix == "mst"} className="btn-modal delete-btn" onClick={() => {toggleModuleActivation(row.original.status, row.original.prefix)}}>
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
    {pagesModal&& (
        <PagesModal show={pagesModal} change={setPagesModal} prefix={prefix} />
    )}
</>
    )
}

