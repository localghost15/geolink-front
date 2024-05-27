import React, { useEffect, useState } from 'react';
import SunEditor from 'suneditor-react';
import "suneditor/dist/css/suneditor.min.css";
import plugins from 'suneditor/src/plugins'
import {
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
    Button,
    Card, Typography, IconButton, Tooltip, Input,
} from "@material-tailwind/react";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import axios from 'axios';

import {
    Accordion,
    AccordionHeader,
    AccordionBody,
} from "@material-tailwind/react";
import DatePicker from './DatePicker';
import { ArrowPathIcon } from '@heroicons/react/24/solid';
import SendAnalysis from './SignAnalysis';
import { PaymentHistoryTable } from './PaymentHistoryTable';
import {PencilIcon} from "@heroicons/react/24/outline";
import VisitPatientStartEnd from "./VisitPatientStartEnd";

function Icon({ id, open }) {
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

function AccordionCustomIcon({ patientId, mkb10  }) {
    const [open, setOpen] = React.useState(0);
    const [alwaysOpen, setAlwaysOpen] = React.useState(true);
    const [selectedDisease, setSelectedDisease] = useState(null);
    const [mkb10Data, setMkb10Data] = useState([]);
    const [selectedMKB10, setSelectedMKB10] = useState([]);
    const TABLE_HEAD = ["Код", "Номланиши", "Харакат"];
    const animatedComponents = makeAnimated();

    useEffect(() => {
        async function fetchData() {
            const data = await fetchMkb10Data();
            setMkb10Data(data);
        }
        fetchData();
    }, []);

    const handleAlwaysOpen = () => setAlwaysOpen((cur) => !cur);
    const handleOpen = (value) => setOpen(open === value ? 0 : value);

    const axiosInstance = axios.create({
        baseURL: 'https://back.geolink.uz/api/v1'
    });

    axiosInstance.interceptors.request.use(
        config => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        error => {
            return Promise.reject(error);
        }
    );

    const fetchMkb10Data = async () => {
        try {
            const response = await axiosInstance.get('/mkb10');
            return response.data.data.map(item => ({
                value: item.code,
                label: `${item.code} - ${item.name}`,
                ...item
            }));
        } catch (error) {
            console.error("Error fetching MKB-10 data:", error);
            return [];
        }
    };

    // Функция для отправки данных MKB-10

    const sendMKB10Data = async (selectedOptions) => {
        if (selectedOptions.length === 0) {
            alert("The mkb10 field is required.");
            return;
        }

        // Извлекаем только идентификаторы из выбранных опций
        const mkb10Ids = selectedOptions.map(option => option.id);

        let config = {
            method: 'post',
            url: `https://back.geolink.uz/api/v1/patient/mkb10/${patientId}`,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({ mkb10: mkb10Ids })
        };

        try {
            const response = await axios.request(config);
            console.log("MKB-10 data sent successfully:", response.data);
        } catch (error) {
            console.error("Error sending MKB-10 data:", error);
        }
    };
    const handleSelectChange = (selectedOptions) => {
        setSelectedDisease(selectedOptions);
    };

    const templates = [
        {
            name: 'Template-1',
            html: '<p>HTML source1</p>'
        },
        {
            name: 'Template-2',
            html: '<p>HTML source2</p>'
        }
    ];


    return (
        <>
            <Accordion open={alwaysOpen} icon={<Icon id={1} open={open} />}>
                <AccordionHeader className='text-sm' onClick={handleAlwaysOpen}>Қайта қабул</AccordionHeader>
                <AccordionBody>
                    <div className="flex gap-4">
                        <DatePicker/>
                        <Button className='flex gap-x-1'><ArrowPathIcon className='w-4 h-4' /> Қайта қабулга қўшиш</Button>
                    </div>
                </AccordionBody>
            </Accordion>
            <Accordion open={open === 2} icon={<Icon id={2} open={open} />}>
                <AccordionHeader className='text-sm' onClick={() => handleOpen(2)}>
                    Анализга юбориш
                </AccordionHeader>
                <AccordionBody>
                    <SendAnalysis/>
                </AccordionBody>
            </Accordion>
            <Accordion open={open === 3} icon={<Icon id={3} open={open} />}>
                <AccordionHeader className='text-sm' onClick={() => handleOpen(3)}>
                    Диспансер рўйхати
                </AccordionHeader>
                <AccordionBody>
                    <div className="flex gap-4">
                        <DatePicker/>
                        <Button className='flex gap-x-1'><ArrowPathIcon className='w-4 h-4' />Диспонсер рўйхатига қўшиш</Button>
                    </div>
                </AccordionBody>
            </Accordion>
            <Accordion open={open === 4} icon={<Icon id={4} open={open} />}>
                <AccordionHeader className='text-sm' onClick={() => handleOpen(4)}>
                    Врач хулосаси
                </AccordionHeader>
                <AccordionBody>
                    <SunEditor
                        showToolbar={true}
                        height="80vh"
                        setOptions={{
                            mode: 'classic',
                            rtl: false,
                            previewTemplate: "<div style='width:auto; max-width:1080px; margin:auto;'>    <h1>Preview Template</h1>     {{contents}}     <div>_Footer_</div></div>",
                            printTemplate: "<div style='width:auto; max-width:1080px; margin:auto;'>    <h1>Print Template</h1>     {{contents}}     <div>_Footer_</div></div>",
                            katex: 'window.katex',
                            imageGalleryUrl: 'https://etyswjpn79.execute-api.ap-northeast-1.amazonaws.com/suneditor-demo',
                            videoFileInput: false,
                            tabDisable: false,
                            templates: templates,
                            buttonList: [
                                [
                                    'undo',
                                    'redo',
                                    'font',
                                    'fontSize',
                                    'formatBlock',
                                    'paragraphStyle',
                                    'blockquote',
                                    'bold',
                                    'underline',
                                    'italic',
                                    'strike',
                                    'subscript',
                                    'superscript',
                                    'fontColor',
                                    'hiliteColor',
                                    'textStyle',
                                    'removeFormat',
                                    'outdent',
                                    'indent',
                                    'align',
                                    'horizontalRule',
                                    'list',
                                    'lineHeight',
                                    'table',
                                    'link',
                                    'image',
                                    'video',
                                    'audio',
                                    'math',
                                    'imageGallery',
                                    'fullScreen',
                                    'showBlocks',
                                    'codeView',
                                    'preview',
                                    'print',
                                    'save',
                                    'template'
                                ]
                            ],
                        }}
                    />
                </AccordionBody>
            </Accordion>
            <Accordion open={open === 5} icon={<Icon id={5} open={open} />}>
                <AccordionHeader className='text-sm' onClick={() => handleOpen(5)}>
                    МКБ-10
                </AccordionHeader>
                <AccordionBody>
                    <div className=" px-5">
                       <div className='flex gap-x-4'>
                           <Select
                               components={animatedComponents}
                               className='lg:w-4/5 rounded-none'
                               isMulti
                               options={mkb10Data}
                               value={selectedDisease}
                               onChange={handleSelectChange}
                               placeholder="Кассаликни танланг..."
                           />
                           <Button className='rounded-md' onClick={() => sendMKB10Data(selectedDisease)}>Саклаш</Button>
                       </div>
                        <Card className="h-full w-full rounded-none mt-5 overflow-scroll">
                            <table className="w-full min-w-max table-auto text-left">
                                <thead>
                                <tr>
                                    {TABLE_HEAD.map((head) => (
                                        <th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal leading-none opacity-70"
                                            >
                                                {head}
                                            </Typography>
                                        </th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                {mkb10.map(({ id, code, name }) => (
                                    <tr key={id} className="even:bg-blue-gray-50/50">
                                        <td className="p-4">
                                            <Typography variant="small" color="blue-gray" className="font-normal">
                                                {code}
                                            </Typography>
                                        </td>
                                        <td className="p-4">
                                            <Typography variant="small" color="blue-gray" className="font-normal">
                                                {name}
                                            </Typography>
                                        </td>  <td className="p-4">
                                            <Typography variant="small" color="blue-gray" className="font-normal">
                                                <Tooltip content="Ўзгартириш">
                                                    <IconButton variant="text">
                                                        <PencilIcon className="h-4 w-4" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Typography>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </Card>
                    </div>
                </AccordionBody>
            </Accordion>
        </>
    );
}

function PatientDetailTabs({patientId, mkb10}) {
    const axiosInstance = axios.create({
        baseURL: 'https://back.geolink.uz/api/v1'
    });

    axiosInstance.interceptors.request.use(
        config => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        error => {
            return Promise.reject(error);
        }
    );

    const [visits, setVisits] = useState({});

    useEffect(() => {
        const fetchVisits = async () => {
            try {
                const response = await axiosInstance.get(`https://back.geolink.uz/api/v1/visit?patient_id=${patientId}`);
                setVisits((prevVisits) => ({
                    ...prevVisits,
                    [patientId]: response.data.data,
                }));
            } catch (error) {
                console.error('Ошибка при получении данных о визитах:', error);
            }
        };

        fetchVisits();
    }, [patientId]);

    const [selectedTab, setSelectedTab] = useState(1);

    const [doctorId, setDoctorId] = useState('');

    const handleDoctorIdChange = (event) => {
        setDoctorId(event.target.value);
    };

    const handleNewVisitSubmit = async () => {
        try {
            // Используем axiosInstance для отправки запроса
            const response = await axiosInstance.post(`/visit?patient_id=${patientId}&doctor_id=${doctorId}`);
            console.log("New visit created:", response.data);
            // Дополнительные действия после успешной отправки, например, обновление интерфейса или отображение уведомления
        } catch (error) {
            console.error("Error creating new visit:", error);
            // Обработка ошибки, например, отображение сообщения об ошибке пользователю
        }
    };

    const data = [
        {
            label: "Янги қабул",
            value: 1,
            desc: <AccordionCustomIcon mkb10 ={mkb10} patientId={patientId} value={1} />,
        },
        {
            label: "Тўловлар тарихи",
            value: 2,
            desc: <PaymentHistoryTable value={2} />,
        },

        {
            label: "Қабулларни кўриш",
            value: 3,
            desc:  <VisitPatientStartEnd patientId={patientId} visits={visits} />,
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
    )
}

export default PatientDetailTabs;
