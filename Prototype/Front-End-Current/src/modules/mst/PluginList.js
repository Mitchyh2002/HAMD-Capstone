import React, { useMemo, useState } from 'react';
import { useTable } from "react-table";
import { useLoaderData } from 'react-router-dom';
import { updateName } from "./loaderFunctions";
import Modal from './Components.js';
import "./admin.css";

export default function PluginList() {

    /* Calls to the loader function defined in main.js */
    const plugins = useLoaderData();

    /* Getting the data from the database  */
    const data = useMemo(() => plugins, []);
    const columns = useMemo(() => [
        {
            Header: "Prefix",
            accessor: "prefix",
        },{
            Header: "Display Name",
            accessor: "displayName",
        }
    ], []);

    const tableInstance = useTable({ columns, data });
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

    /* Setting the state for the modal */
    const [modal, setModal] = useState(false);
    const toggleModal = () => {
        setModal(!modal);
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
                                            |
                                            <button className="btn-modal delete-btn">
                                                Deactivate
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
                <Modal label1="Change Display Name:" show={modal} change={setModal} />
            )}
        </>
    )
};

