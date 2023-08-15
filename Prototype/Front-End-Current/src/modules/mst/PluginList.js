import React, { useMemo, useState } from 'react';
import { useTable } from "react-table";
import "./PluginList.css";
import { useLoaderData } from 'react-router-dom';

export default function PluginList() {
    const plugins = useLoaderData();

    /* Setting the state for the modal */
    const [modal, setModal] = useState(false);
    const toggleModal = () => {
        setModal(!modal);
    }

    /* Getting the data from the MOCK_DATA file */
    const data = useMemo(() => plugins, []);
    const columns = useMemo(() => [  
    {
        Header: "ID",
        accessor: "id",
    },{
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
                <div className="modal">
                    <div onClick={toggleModal} className='overlay'></div>
                    <div className='modal-content'>
                        <button className='close-modal' onClick={toggleModal}>
                            x
                        </button>
                        <h4 className='modal-heading'>Edit</h4>
                        <form>
                            <label className='modal-label'>Change display name:
                                <input className='modal-input' type="text" />
                            </label>
                            <input className='confirm-button' type="submit" />
                        </form>
                        <br></br>
                        <br></br>
                        <button className='confirm-button' onClick={toggleModal}>
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
    };
    
    