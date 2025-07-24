// TableV2.tsx
import React, { useState } from "react";
import { IconType } from "react-icons";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import Modal from "./ModalProps";

type Column = {
    key: string;
    label: string;
};

type Action = {
    icon: IconType;
    onClick: (row: any) => void;
    label: string;
    iconStyle?: string;
};

type TableProps = {
    columns: Column[];
    data: any[] | undefined;
    actions?: Action[];
    copyID?: number | null;
};

const Table: React.FC<TableProps> = ({
    columns,
    data = [],
    actions,
    copyID,
}) => {
    const [sortConfig, setSortConfig] = useState<{
        key: string;
        direction: "asc" | "desc";
    } | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const [activeCopyRow, setActiveCopyRow] = useState<number | null>(null);

    const handleSort = (key: string) => {
        if (sortConfig && sortConfig.key === key) {
            setSortConfig({
                key,
                direction: sortConfig.direction === "asc" ? "desc" : "asc",
            });
        } else {
            setSortConfig({ key, direction: "asc" });
        }
    };

    const sortedData = React.useMemo(() => {
        if (!data) return [];
        if (!sortConfig) return data;

        const sorted = [...data].sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
            if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
            return 0;
        });

        return sorted;
    }, [data, sortConfig]);

    const getSortIcon = (key: string) => {
        if (!sortConfig || sortConfig.key !== key) {
            return <FaSort className="transition-transform duration-300 transform hover:scale-125" />;
        }
        return sortConfig.direction === "asc" ? (
            <FaSortUp className="transition-transform duration-300 transform hover:scale-125" />
        ) : (
            <FaSortDown className="transition-transform duration-300 transform hover:scale-125" />
        );
    };

    const handleCellClick = (content: string) => {
        setModalContent(content);
        setModalOpen(true);
    };

    const handleCopyAction = (index: number) => {
        setActiveCopyRow(index);
    };

    return (
        <div className="overflow-hidden p-4 pl-0 pr-0">
            <div className="overflow-y-auto max-h-[400px] border-2 border-slate-400 rounded-lg">
                <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden table-fixed">
                    <thead className="bg-gray-200 text-gray-600 text-md sticky top-0 z-0">
                        <tr className="z-0">
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className="py-4 px-6 text-left font-semibold cursor-pointer hover:bg-gray-300 transition-colors duration-300"
                                    onClick={() => handleSort(column.key)}
                                    style={{ maxWidth: "150px" }}
                                >
                                    <div className="flex items-center">
                                        {column.label}
                                        <span className="ml-2">{getSortIcon(column.key)}</span>
                                    </div>
                                </th>
                            ))}
                            <th className="py-4 px-6 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700 text-md">
                        {sortedData.map((row, index) => (
                            <tr
                                key={index}
                                className={`border-b border-gray-200 ${index % 2 === 0 ? "bg-white" : "bg-slate-100"} hover:bg-slate-200 transition duration-300 ease-in-out hover:shadow-lg`}
                            >
                                {columns.map((column) => (
                                    <td
                                        key={column.key}
                                        className="py-4 px-6 text-left truncate overflow-hidden max-w-xs whitespace-nowrap text-ellipsis cursor-pointer"
                                        style={{ maxWidth: "150px" }}
                                        title={row[column.key]}
                                        onClick={() => handleCellClick(row[column.key])}
                                    >
                                        {row[column.key]}
                                    </td>
                                ))}
                                <td className="py-4 px-6 text-center">
                                    <div className="flex justify-center items-center space-x-2">
                                        {actions && actions.map((action, idx) => {
                                            if (action.label === "Copy" && activeCopyRow === index) {
                                                return null;
                                            } else if (action.label === "Copy" && row.groupPositionID !== copyID) {
                                                return (
                                                    <button
                                                        key={idx}
                                                        className={`flex justify-center items-center ${action.iconStyle} bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-200 ease-in-out shadow-md hover:shadow-lg`}
                                                        onClick={() => {
                                                            handleCopyAction(index);
                                                            action.onClick(row);
                                                        }}
                                                    >
                                                        <action.icon />
                                                    </button>
                                                );
                                            } else if (action.label === "X" && (activeCopyRow === index || row.groupPositionID === copyID)) {
                                                return (
                                                    <button
                                                        key={idx}
                                                        className={`flex justify-center items-center bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full transition duration-200 ease-in-out shadow-md hover:shadow-lg`}
                                                        onClick={() => {
                                                            setActiveCopyRow(null);
                                                            action.onClick(row);
                                                        }}
                                                    >
                                                        <action.icon />
                                                    </button>
                                                );
                                            } else if (action.label !== "X" && action.label !== "Copy") {
                                                return (
                                                    <button
                                                        key={idx}
                                                        className={`flex justify-center items-center ${action.iconStyle} bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-200 ease-in-out shadow-md hover:shadow-lg`}
                                                        onClick={() => action.onClick(row)}
                                                    >
                                                        <action.icon />
                                                    </button>
                                                );
                                            }
                                        })}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal for displaying full content */}
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} content={modalContent} />
        </div>
    );
};

export default Table;
