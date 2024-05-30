import React, {useEffect, useMemo, useState} from 'react';
import "suneditor/dist/css/suneditor.min.css";

import {
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
} from "@material-tailwind/react";

import axios from 'axios';

import { PaymentHistoryTable } from './PaymentHistoryTable';
import AccordionCustomIcon from "./AccordionCustomIcon";
import {fetchVisits} from "../services/visitService";

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



function PatientDetailTabs({ patientId, mkb10 }) {

    const [visits, setVisits] = useState({});
    const [visitId, setVisitId] = useState(null);
    const [selectedTab, setSelectedTab] = useState(1);
    const [doctorId, setDoctorId] = useState('');
    const [dataCache, setDataCache] = useState({});

    useEffect(() => {
        if (!dataCache[patientId]) {
            const fetchData = async () => {
                try {
                    const request = await fetchVisits(patientId);
                    const response = await request;
                    const visitData = response.data.data;
                    if (visitData.length > 0) {
                        setVisitId(visitData[0].id);
                    }
                    setVisits(prevVisits => ({
                        ...prevVisits,
                        [patientId]: visitData,
                    }));
                    setDataCache(prevCache => ({
                        ...prevCache,
                        [patientId]: visitData,
                    }));
                } catch (error) {
                    console.error('Ошибка при получении данных о визитах:', error);
                }
            };

            fetchData();
        } else {
            setVisits(prevVisits => ({
                ...prevVisits,
                [patientId]: dataCache[patientId],
            }));
        }
    }, [patientId, dataCache]);

    const handleDoctorIdChange = (event) => {
        setDoctorId(event.target.value);
    };

    const data = [
        {
            label: "Янги қабул",
            value: 1,
            desc: <AccordionCustomIcon visits={visits} visitId={visitId} mkb10={mkb10} patientId={patientId} value={1} />,
        },
        {
            label: "Тўловлар тарихи",
            value: 2,
            desc: <PaymentHistoryTable patientId={patientId} value={2} />,
        },
        {
            label: "Қабулларни кўриш",
            value: 3,
            desc: <div>demo</div>,
        },
    ];

    return (
        <Tabs id="custom-animation" value={selectedTab}>
            <TabsHeader>
                {data.map(({ label, value }) => (
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
