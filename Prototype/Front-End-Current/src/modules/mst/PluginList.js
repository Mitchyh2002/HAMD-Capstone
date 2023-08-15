import React, { useMemo, useState } from 'react';
import { useTable } from "react-table";
import "./PluginList.css";
import { useLoaderData } from 'react-router-dom';
import Modal from './Components.js'

export default function PluginList() {
    
    const plugins = useLoaderData();

    /* Setting the state for the modal */
    const [modal, setModal] = useState(false);
    const toggleModal = () => {
        setModal(!modal);
    }

    /* Getting the data from the database  */
    const data = useMemo(() => plugins, []);
    const columns = useMemo(() => [  
    /*{
        Header: "ID",
        accessor: "id",
    },*/{
        Header: "Prefix",
        accessor: "prefix",
    },{
        Header: "Display Name",
        accessor: "displayName",
    }
    ], []);

    const tableInstance = useTable({ columns, data })
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

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
                                                    <button onClick={toggleModal} className="btn-modal">
                                                            Edit
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
                <Modal show={modal} change={setModal}/>
            )}
        </>
        )
    };
    
    