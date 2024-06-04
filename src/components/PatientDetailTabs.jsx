import React, {useEffect, useMemo, useState} from 'react';
import "suneditor/dist/css/suneditor.min.css";

import {
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel, IconButton, Typography
} from "@material-tailwind/react";
import {Image, Button} from "antd";
import axios from 'axios';

import { PaymentHistoryTable } from './PaymentHistoryTable';
import AccordionCustomIcon from "./AccordionCustomIcon";
import {fetchVisits} from "../services/visitService";
import {ClipboardDocumentCheckIcon, EyeIcon} from "@heroicons/react/24/solid";
import {Link, useNavigate} from "react-router-dom";
import {getDispensaryDataPatient} from "../services/dispansery";

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



function PatientDetailTabs({ patientId, mkb10, visits, visitId , mostRecentVisit, remark ,setMostRecentVisit, onUpdateVisits }) {


    const [selectedTab, setSelectedTab] = useState(1);
    const [doctorId, setDoctorId] = useState('');

    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/patient/admission/${patientId}`); // Replace with your desired route
    };


    const handleDoctorIdChange = (event) => {
        setDoctorId(event.target.value);
    };

    const [dispensaryData, setDispensaryData] = useState(null);

    useEffect(() => {
        const fetchDispensaryData = async () => {
            if (mostRecentVisit && mostRecentVisit.id) {
                try {
                    const data = await getDispensaryDataPatient(mostRecentVisit.id);
                    setDispensaryData(data);
                } catch (error) {
                    console.error('Ошибка при получении данных о диспансере:', error);
                }
            }
        };
        fetchDispensaryData();
    }, [mostRecentVisit]);

    const renderDispensaryDates = () => {
        if (dispensaryData && dispensaryData.data) {
            const currentVisitDate = dispensaryData.data[0]?.visit?.date;
            const mouthDays = dispensaryData.data.map(item => item.mouth_days).flat();
            return (
                <ul>
                    {mouthDays.length > 0
                        ? mouthDays.map(date => <li key={date}>{date}</li>)
                        : <li>Диспансер рўхатлари йуқ</li>}
                </ul>
            );
        }
        return <li>Диспансер рўхатлари йуқ</li>;
    };


    const data = [
        {
            label: "Янги қабул",
            value: 1,
            desc: <AccordionCustomIcon onUpdateVisits={onUpdateVisits} mostRecentVisit={mostRecentVisit} setMostRecentVisit={setMostRecentVisit} visits={visits} visitId={visitId} mkb10={mkb10} patientId={patientId} value={1} />,
        },
        {
            label: "Тўловлар тарихи",
            value: 2,
            desc: <PaymentHistoryTable patientId={patientId} value={2} />,
        },
        {
            label: "Қабулларни кўриш",
            value: 3,
            desc: <div className="w-full">
                <table className="text-left w-full" >
                    <tr>
                        <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">

                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-bold"
                            >
                                Қабул санаси:
                            </Typography>
                        </th>
                        <td className="border-y border-blue-gray-100 pl-5">
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                            >
                                {mostRecentVisit ? mostRecentVisit.date_at : ''}
                            </Typography>
                        </td>
                    </tr>
                    <tr>
                    <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                        <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-bold"
                        >
                            Врач хулосаси:
                        </Typography>
                    </th>
                        <td className="border-y border-blue-gray-100 pl-5">
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                            >
                                {remark ? '' : 'Хулоса йоқ...'}
                            </Typography>
                        </td>
                    </tr>
                    <tr>
                        <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-bold"
                            >
                                Мкб10:
                            </Typography>
                        </th>
                        <td className="border-y border-blue-gray-100 pl-5">

                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                            >
                                {mkb10.map(item => (
                                    <div key={item.id}>
                                        <p>{item.name}</p>
                                    </div>
                                ))}
                            </Typography>
                        </td>
                    </tr>
                    <tr>
                        <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-bold"
                            >
                                Қайта қабул санаси:
                            </Typography>
                        </th>
                        <td className="border-y border-blue-gray-100 pl-5">
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                            >
                                {mostRecentVisit ? mostRecentVisit.date_at : ''}
                            </Typography>
                        </td>
                    </tr>
                    <tr>
                        <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-bold"
                            >
                                Диспансер хисобига олинганми:
                            </Typography>
                        </th>
                        <td className="border-y border-blue-gray-100 pl-5">
                            {dispensaryData && (
                                <Typography variant="small" color="blue-gray" className="font-normal">
                                    {renderDispensaryDates()}
                                </Typography>
                            )}
                        </td>
                    </tr>
                    <tr>
                        <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-bold"
                            >
                                Юкланган файллар:
                            </Typography>
                        </th>
                        <td className="border-y border-blue-gray-100 pl-5">
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                            >

                                        <Image.PreviewGroup
                                            preview={{
                                                onChange: (current, prev) => console.log(`current index: ${current}, prev index: ${prev}`),
                                            }}
                                        >
                                            {mostRecentVisit ? mostRecentVisit.files.map(file => (
                                            <Image key={file.id}
                                                width={50}
                                                src={file.url}
                                            />
                                            )) : ''}
                                        </Image.PreviewGroup>

                            </Typography>


                        </td>
                    </tr>
                    <tr>
                        <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-bold"
                            >
                                Қўриш:
                            </Typography>
                        </th>
                        <td className="border-y border-blue-gray-100 pl-5">
                            <Button onClick={handleClick} icon={<EyeIcon
                                className='w-4 h-4'/>} className='flex rounded-md items-center font-medium capitalize my-2'>Кўриш</Button>
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
