import React, {useEffect, useMemo, useState} from 'react';
import "suneditor/dist/css/suneditor.min.css";

import {
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel, IconButton,
} from "@material-tailwind/react";

import axios from 'axios';

import { PaymentHistoryTable } from './PaymentHistoryTable';
import AccordionCustomIcon from "./AccordionCustomIcon";
import {fetchVisits} from "../services/visitService";
import {EyeIcon} from "@heroicons/react/24/solid";

export function Icon({ id, open }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className={`${id === open ? "rotate-180" : ""} h-5 w-5 transition-transform`}
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
    );
}



function PatientDetailTabs({ patientId, mkb10, visits, visitId , mostRecentVisit, remark ,setMostRecentVisit }) {


    const [selectedTab, setSelectedTab] = useState(1);
    const [doctorId, setDoctorId] = useState('');


    const handleDoctorIdChange = (event) => {
        setDoctorId(event.target.value);
    };


    const data = [
        {
            label: "Янги қабул",
            value: 1,
            desc: <AccordionCustomIcon mostRecentVisit={mostRecentVisit} setMostRecentVisit={setMostRecentVisit} visits={visits} visitId={visitId} mkb10={mkb10} patientId={patientId} value={1} />,
        },
        {
            label: "Тўловлар тарихи",
            value: 2,
            desc: <PaymentHistoryTable patientId={patientId} value={2} />,
        },
        {
            label: "Қабулларни кўриш",
            value: 3,
            desc: <div>
                <table className="text-left" >
                    <tr>
                        <th>Қабул санаси:</th>
                        <td>{mostRecentVisit ? mostRecentVisit.date_at : ''}</td>
                    </tr>
                    <tr>
                    <th>Врач хулосаси:</th>
                        <td>{remark ? '' : 'Пусто...'}</td>
                    </tr>
                    <tr>
                        <th>Мкб10:</th>
                        <td>
                            {mkb10.map(item => (
                                <div key={item.id}>
                                    <p>{item.name}</p>
                                </div>
                            ))}
                        </td>
                    </tr>
                    <tr>
                        <th>Қайта қабул санаси:</th>
                        <td>{mostRecentVisit ? mostRecentVisit.date_at : ''}</td>
                    </tr>
                    <tr>
                        <th>Диспансер хисобига олинганми:</th>
                        <td>555 77 855</td>
                    </tr>
                    <tr>
                        <th>Юкланган файллар:</th>
                        <td>
                            {mostRecentVisit ? mostRecentVisit.files.map(file => (
                                <li key={file.id}>
                                    <a href={file.file} target="_blank" rel="noopener noreferrer">{file.name}</a>
                                </li>
                            )) : ''}


                        </td>
                    </tr>
                    <tr>
                        <th>Қўриш:</th>
                        <td>
                            <IconButton size="sm">
                                <EyeIcon className="w-4 h-4" />
                            </IconButton>
                        </td>
                    </tr>
                </table>
            </div>,
        },
    ];

    return (
        <Tabs id="custom-animation" value={selectedTab}>
            <TabsHeader>
                {data.map(({label, value}) => (
                    <Tab className='w-max-content text-sm h-12' key={value} value={value}>
                        {label}
                    </Tab>
                ))}
            </TabsHeader>
            <TabsBody
                animate={{
                    initial: { y: 250 },
                    mount: { y: 0 },
                    unmount: { y: 250 },
                }}
            >
                {data.map(({ value, desc }) => (
                    <TabPanel key={value} value={value}>
                        {desc}
                    </TabPanel>
                ))}
            </TabsBody>
        </Tabs>
    );
}


export default PatientDetailTabs;
