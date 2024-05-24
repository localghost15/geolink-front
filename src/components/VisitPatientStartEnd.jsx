import React, { useState } from 'react';
import { Button, Typography } from "@material-tailwind/react";
import { PauseCircleIcon, PlayCircleIcon } from "@heroicons/react/24/solid";
import {Transition} from "@headlessui/react";

const VisitPatientStartEnd = ({ patientId, visits }) => {
    const [expandedRow, setExpandedRow] = useState(null);
    const patientVisits = visits[patientId] || [];
    const queueVisits = patientVisits.filter(visit => visit.status === 'queue' || visit.status === 'examined');

    const handleRowClick = (index) => {
        if (expandedRow === index) {
            setExpandedRow(null);
        } else {
            setExpandedRow(index);
        }
    };

    return (
        <>
            <div className="overflow-x-auto bg-white dark:bg-neutral-700">
                <table className="min-w-full text-left text-sm whitespace-nowrap">
                    <thead className="capitalize border-b-2 dark:border-neutral-600 bg-blue-gray-50 dark:bg-neutral-800">
                    <tr>
                        <th scope="col" className="px-6 py-4">
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                            >
                                Навбат
                            </Typography>
                        </th>
                        <th scope="col" className="px-6 py-4">
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                            >
                                Навбат куни
                            </Typography>
                        </th>
                        <th scope="col" className="px-6 py-4">
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                            >
                                Статус
                            </Typography>
                        </th>
                        <th scope="col" className="px-6 py-4">
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                            >
                                Харакат
                            </Typography>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {queueVisits.map((visit, index) => (
                        <>
                            <tr key={index} className="border-b dark:border-neutral-600 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-600" onClick={() => handleRowClick(index)}>
                                <td className="px-6 py-4">{index + 1}</td>
                                <td className="px-6 py-4">{visit.date_at}</td>
                                <td className="px-6 py-4">{visit.status}</td>
                                <td className="px-6 py-4">
                                    {visit.status === 'queue' ?
                                        <Button color="blue-gray" className="flex items-center font-medium gap-x-1 capitalize">
                                            <PlayCircleIcon className="h-4 w-4" />
                                            Кабул Бошланиш
                                        </Button>
                                        :
                                        <Button className="flex items-center font-medium gap-x-1 capitalize">
                                            <PauseCircleIcon className="h-4 w-4" />
                                            Кабул Тугатиш
                                        </Button>
                                    }
                                </td>
                            </tr>
                            {expandedRow === index &&
                                <tr key={`${index}-details`}>
                                    <td colSpan="4" className="px-6 py-4">
                                        <div className="overflow-x-auto bg-white dark:bg-neutral-700">
                                            <table className="min-w-full text-left text-sm whitespace-nowrap">
                                                <thead
                                                    className="capitalize border-b-2 dark:border-neutral-600 bg-blue-gray-50 dark:bg-neutral-800">
                                                <tr>
                                                    <th scope="col" className="px-6 py-4">Order ID</th>
                                                    <th scope="col" className="px-6 py-4">Service Name</th>
                                                    <th scope="col" className="px-6 py-4">Amount</th>
                                                    <th scope="col" className="px-6 py-4">Created At</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {visit.orders.map((order, orderIndex) => (
                                                    <tr key={orderIndex}
                                                        className="border-b dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-600">
                                                        <td className="px-6 py-4">{order.id}</td>
                                                        <td className="px-6 py-4">{order.service.name}</td>
                                                        <td className="px-6 py-4">{order.amount}</td>
                                                        <td className="px-6 py-4">{order.created_at}</td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </td>
                                </tr>
                            }
                        </>
                    ))}
                    </tbody>
                </table>
            </div>


        </>
    );
};

export default VisitPatientStartEnd;
