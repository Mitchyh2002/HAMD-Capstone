import React, { useEffect, useMemo, useState } from 'react';
import { useTable } from "react-table";
import { useLoaderData, Link } from 'react-router-dom';
import "./admin.css";
import { getToken } from 'Functions/User';
import { FormInput } from 'Pages/Login';
import { baseUrl } from 'config';
import { getUsers } from './loaderFunctions';

export default function Users() {

    /* Calls to the loader function defined in main.js */
    const [users, setUsers] = useState(useLoaderData());
    const [refresh, setRefresh] = useState(false);
    console.log(users)

    /* Setting the state for the modal*/
    const [modal, setModal] = useState(false);
    const [modalType, setModalType] = useState('');
    const [user, setUser] = useState(null);
    const [show, setShow] = useState(false);

    const toggleModal = (type = null, user = null) => {
        if (!modal) {
            setModalType(type);
            setUser(user);
        }
        setModal(!modal);
    }

    /* Getting the data from the database  */
    const data = useMemo(() => users, [users]);
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
        }, {
            Header: "Admin Level",
            accessor: "adminLevel",
        }
    ], []);

    /* Setting react useTable */
    const tableInstance = useTable({ columns, data });
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

    //functions
    const refreshData = async () => {
        setUsers(await getUsers());
    }

    useEffect(() => {
        refreshData();
        setRefresh(false);
    }, [refresh]);

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
                                            <button onClick={() => toggleModal('edit', row.original)} className="btn-modal">
                                                Edit
                                            </button>
                                            |
                                            {row.original.adminLevel === 0 ? (
                                                <button onClick={() => toggleModal('unsuspend', row.original)} className="btn-modal delete-btn">
                                                    Unsuspend
                                                </button>
                                            ) : (
                                                <button onClick={() => toggleModal('remove', row.original)} className="btn-modal delete-btn">
                                                    Suspend
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            {modal && (
                <UserListModal show={show} toggleModal={toggleModal} type={modalType} user={user} refresh={setRefresh} />
            )}
        </>
    )
};

/* Modal  */
function UserListModal(props) {
    let show = props.show;
    let type = props.type;
    let user = props.user;

    const [emailError, setEmailError] = useState();
    const [dobError, setDobError] = useState();
    const [adminLevelError, setAdminLevelError] = useState();
    const [consoleError, setConsoleError] = useState();
    const [loading, setLoading] = useState();

    /* Setting the state for the modal */
    const toggleModal = (props) => {
        props.toggleModal();
    }

    const validateForm = (formData) => {
        const emailErr = setEmailError(checkEmailValid(formData.get("email")));
        const dobErr = setDobError(checkDOB(formData.get("dateOfBirth")));
        const adminErr = setAdminLevelError(checkAdminLevel(formData.get("adminLevel")));

        setEmailError(emailErr);
        setDobError(dobErr);
        setAdminLevelError(adminErr);

        let valid = true;
        if (emailErr || dobErr || adminErr) {
            valid = false;
        }

        return (valid)
    }

    const handleEdit = (e) => {
        setLoading(true);
        const form = document.getElementById("edit user");
        const formData = new FormData(form);

        const valid = validateForm(formData);
        if (valid) {
            const userDetailFetch = fetch(baseUrl + "/mst/admin/updateUser/" + user.userID, {
                method: "POST",
                headers: {
                    'Authorization': "Bearer " + getToken(),
                },
                body: formData,
            });

            const userLevelFetch = fetch(baseUrl + "/mst/admin/updateLevel/" + user.userID, {
                method: "POST",
                headers: {
                    'Authorization': "Bearer " + getToken(),
                },
                body: formData,
            });

            Promise.all([userDetailFetch, userLevelFetch])
                .then(responses => Promise.all(responses.map(response => response.json())))
                .then(([userDetailResponse, userLevelResponse]) => {
                    if (userDetailResponse.Success && userLevelResponse.Success) {
                        console.log(userDetailResponse, userLevelResponse);
                        toggleModal(props);
                    } else {
                        console.log(userDetailResponse, userLevelResponse);
                        setConsoleError(userDetailResponse.Success ? userLevelResponse : userDetailResponse);
                    }
                    setLoading(false);
                    props.refresh(true);
                })
                .catch(error => {
                    console.log(error);

                })
        }
    }
    const handleSuspend = (e) => {
        setLoading(true);
        fetch(baseUrl + "/mst/admin/updateLevel/" + user.userID + "?adminLevel=0", {
            method: "POST",
            headers: {
                'Authorization': "Bearer " + getToken(),
            },
        }).then(response => (response.json()
        )).then((response) => {
            if (response.Success == true) {
                console.log(response);
                toggleModal(props);
                props.refresh(true);
                console.log("update")
            } else {
                console.log(response);
            }
            setLoading(false);
        }).catch(function (error) {
            console.log(error);
            setLoading(false);
        })
    }

    const handleUnsuspend = (e) => {
        setLoading(true);
        fetch(baseUrl + "/mst/admin/updateLevel/" + user.userID + "?adminLevel=1", {
            method: "POST",
            headers: {
                'Authorization': "Bearer " + getToken(),
            },
        }).then(response => (response.json()
        )).then((response) => {
            if (response.Success == true) {
                console.log(response);
                toggleModal(props);
                props.refresh(true);
            } else {
                console.log(response);
            }
            setLoading(false);
        }).catch(function (error) {
            console.log(error);
            setLoading(false);
        })
    }

    return (
        <div className="modal" >
            <div className='overlay' ></div>
            <div className='user-modal flexBoxColumnGrow' >
                {type === 'edit' ? (<>
                    <h4 className='modal-heading'>Edit</h4>
                    <form id="edit user" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        {consoleError&& <p style={{color: "red"}}>{consoleError.Message}</p>}
                        <FormInput
                            label="Name:"
                            type="text"
                            name="firstName"
                            placeholder={user.firstName}
                            className="edit-user-input"
                        />
                        <FormInput
                            label="Birth Year:"
                            error={dobError}
                            type="number"
                            name="dateOfBirth"
                            placeholder={user.dateOfBirth}
                        />
                        <FormInput
                            label="Email:"
                            error={emailError}
                            type="text"
                            name="email"
                            placeholder={user.email}
                        />
                        <FormInput
                            label="Phone Number:"
                            type="text"
                            name="phoneNumber"
                            placeholder={user.phoneNumber}
                        />
                        <FormInput
                            label="Admin Level:"
                            error={adminLevelError}
                            type="number"
                            name="adminLevel"
                            placeholder={user.adminLevel}
                        />
                    </form>
                    <button className='buttons confirm-button' onClick={handleEdit}>
                        Confirm Changes
                    </button>
                </>) : type === 'unsuspend' ? (
                    <>
                        <h4 className='modal-heading' style={{ justifyContent: 'center' }}>Unsuspend User</h4>
                        <p>Are you sure you want to unsuspend this user, {user.email}?</p>
                        <button className='buttons confirm-button' onClick={handleUnsuspend}>
                            Unsuspend User
                        </button>
                    </>
                ) : (
                    <>
                        <h4 className='modal-heading' style={{ justifyContent: 'center' }}>Suspend User</h4>
                        <p>Are you sure you want to suspend this user, {user.email}?</p>
                        <button className='buttons confirm-button' onClick={handleSuspend}>
                            Suspend User
                        </button>
                    </>
                )}
                <button className='buttons cancel-button' onClick={() => toggleModal(props)}>
                    Cancel
                </button>
            </div>
        </div>
    )
}

function checkDOB(dob) {
    const currentDate = new Date();
    if (dob > currentDate.getFullYear() - 13) {
        return "You need to be over 13";
    }

}

function checkEmailValid(email) {
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const checkValid = new RegExp(regEx);

    if (email)
        if (!checkValid.exec(email)) {
            return "Please check the email format";
        }
}

function checkAdminLevel(adminLevel) {
    if (adminLevel) {
        if (!Number.isInteger(adminLevel)) {
            return "Admin Level must be in range 0-7"
        } else if (adminLevel > 7) {
            return "Can only assign up to admin level 7 via UI."
        } else if (adminLevel < 0) {
            return "Admin level cannot be negative"
        } else {
            return (async () => {
                try {
                    const response = await fetch(baseUrl + "/mst/user/getAccount", {
                        method: "GET",
                        headers: {
                            'Authorization': "Bearer " + getToken(),
                        }
                    });

                    const json = await response.json()

                    if (adminLevel > json.Values.adminLevel) {
                        return "You cannot grant a user greater permissions than you have"
                    }
                } catch {
                    return ({ Message: "Local error/network error encountered", StatusCode: -1, Success: false })
                }
            })();
        }
    }
}