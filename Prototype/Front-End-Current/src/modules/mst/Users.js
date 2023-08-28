import React, { useMemo, useState } from 'react';
import { useTable } from "react-table";
import { useLoaderData, Link } from 'react-router-dom';
import "./admin.css";

export default function Users() {

    /* Calls to the loader function defined in main.js */
    const users = useLoaderData();

    /* Setting the state for the modal*/
    const [modal, setModal] = useState(false);
    const toggleModal = () => {
        setModal(!modal);
    }

    /* Getting the data from the database  */
    const data = useMemo(() => users, []);
    const columns = useMemo(() => [
        {
            Header: "ID",
            accessor: "userID",
        }, {
            Header: "Name",
            accessor: "firstName",
        }, {
            Header: "DOB",
            accessor: "dateOfBirth",
        }, {
            Header: "Email",
            accessor: "email",
        }, {
            Header: "Phone Number",
            accessor: "phoneNumber",
        },
    ], []);

    /* Setting react useTable */
    const tableInstance = useTable({ columns, data });
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

    return (
        <>
            <div className="pluginPage">
                <div className='user-top-page'>
                <h2>Users</h2>
                <Link
                    to="/Home/mst/Add%20User">
                    <button className="buttons add-user-button">Add New User</button>
                </Link>
                </div>
                <div>
                    <table className='userTable'{...getTableProps()}>
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
                <UserListModal show={modal} change={setModal} />
            )}
        </>
    )
};

/* Modal  */
function UserListModal(props) {
    let show = props.show;

    /* Setting the state for the modal */
    const toggleModal = () => {
        show = false;
        props.change(false);
    }

    return (
        <div className="modal">
            <div onClick={toggleModal} className='overlay'></div>
            <div className='user-modal'>
                <button className='close-modal' onClick={toggleModal}>
                    x
                </button>
                <h4 className='modal-heading'>Edit</h4>
                <form id="modalForm">
                    <label className='modal-label'>Name:
                        <input className='modal-input' type="text" />
                    </label>
                    <label className='modal-label'>DOB:
                        <input className='modal-input' type="text" />
                    </label>
                    <label className='modal-label'>Email:
                        <input className='modal-input' type="text" />
                    </label>
                    <label className='modal-label'>Phone Number:
                        <input className='modal-input' type="text" />
                    </label>
                    <button className='buttons user-confirm-button' onClick={toggleModal}>
                        Confirm Changes
                    </button>
                    <button className='buttons user-cancel-button' onClick={toggleModal}>
                        Cancel
                    </button>
                    <button className='buttons remove-user-button' onClick={toggleModal}>
                        Remove User
                    </button>
                </form>
            </div>
        </div>
    )
}
