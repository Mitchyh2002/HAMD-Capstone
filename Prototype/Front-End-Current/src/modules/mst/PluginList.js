import React, { useMemo } from 'react';
import { useTable } from "react-table";
import MOCK_DATA from "./MOCK_DATA.json";
import "./PluginList.css";

export default function PluginList() {

    console.log(MOCK_DATA);
    const data = useMemo(() => MOCK_DATA, []);
    const columns = useMemo(() => [  
    {
        Header: "ID",
        accessor: "id",
    },{
        Header: "Prefix",
        accessor: "prefix",
    },{
        Header: "Display Name",
        accessor: "display_name",
    },{
        Header: "Date Added",
        accessor: "date_added",
    },{
        Header: "Action",
        accessor: "action",
    }
    ], []);

    const tableInstance = useTable({ columns, data })
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

    return(
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
                                    </tr>
                                )
                            })}
                        </tbody>
                </table>
            </div>
    </div>
    )
};