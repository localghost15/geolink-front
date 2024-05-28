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
import {ArrowPathIcon, PlusCircleIcon} from '@heroicons/react/24/solid';
import SendAnalysis from './SignAnalysis';
import { PaymentHistoryTable } from './PaymentHistoryTable';
import {PencilIcon} from "@heroicons/react/24/outline";
import VisitPatientStartEnd from "./VisitPatientStartEnd";
import toast from "react-hot-toast";

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

function AccordionCustomIcon({ patientId, mkb10, visitId  }) {
    const [open, setOpen] = React.useState(0);
    const [alwaysOpen, setAlwaysOpen] = React.useState(true);
    const [selectedDisease, setSelectedDisease] = useState(null);
    const [mkb10Data, setMkb10Data] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
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


    const sendDateData = async () => {
        if (!selectedDate) {
            toast.error('Илтимос кунни танланг!')
            return;
        }

        const payload = { date_at: selectedDate };
        console.log("Payload to send:", payload);

        let config = {
            method: 'post',
            url: `https://back.geolink.uz/api/v1/visit/revisit/${visitId}`, // Использование visitId в URL
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(payload)
        };

        try {
            const response = await axios.request(config);
            toast.success(`Кайта кабул: ${selectedDate}`);
            console.log("Date data sent successfully:", response.data);
        } catch (error) {
            console.error("Error sending date data:", error);
        }
    };

    const [templates, setTemplates] = useState([]);

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const response = await axiosInstance.get('/template');
                const apiData = response.data.data;
                const transformedTemplates = await Promise.all(apiData.map(async item => {
                    const textResponse = await axiosInstance.get(`/template/${item.id}`);
                    const textData = textResponse.data.data;
                    return {
                        name: item.title,
                        html: textData.text
                    };
                }));
                setTemplates(transformedTemplates);
            } catch (error) {
                console.error('Error fetching templates:', error);
            }
        };

        fetchTemplates();
    }, []);




    let plugin_submenu = {
        // @Required @Unique
        // plugin name
        name: 'custom_plugin_submenu',

        // @Required
        // data display
        display: 'submenu',

        // @Options
        title: 'Янги шаблон қушиш',
        buttonClass: '',
        innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
    <path fill-rule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd" />
</svg>
`,

        add: function (core, targetElement) {

            const context = core.context;
            context.customSubmenu = {
                targetButton: targetElement,
                titleElement: null,
                currentSpan: null
            };

            let listDiv = this.setSubmenu(core);

            context.customSubmenu.titleElement = listDiv.querySelector('.title-input');

            listDiv.querySelector('.se-btn-primary').addEventListener('click', this.onClick.bind(core, setTemplates));
            listDiv.querySelector('.se-btn').addEventListener('click', this.onClickRemove.bind(core));

            core.initMenuTarget(this.name, targetElement, listDiv);
        },

        setSubmenu: function (core) {
            const listDiv = core.util.createElement('DIV');

            listDiv.className = 'se-menu-container se-submenu se-list-layer';
            listDiv.innerHTML = '' +
                '<div class="se-list-inner">' +
                '<ul class="se-list-basic" style="width: 230px;">' +
                '<li>' +
                '<div class="se-form-group">' +
                '<input class="se-input-form title-input" type="text" placeholder="Insert title" style="border: 1px solid #CCC;" />' +
                '<button type="button" class="se-btn-primary se-tooltip">' +
                '<strong>OK</strong>' +
                '<span class="se-tooltip-inner"><span class="se-tooltip-text">OK</span></span>' +
                '</button>' +
                '<button type="button" class="se-btn se-tooltip" style="margin-left: 5px;">' +
                '<strong>X</strong>' +
                '<span class="se-tooltip-inner"><span class="se-tooltip-text">Remove all tags</span></span>' +
                '</button>' +
                '</div>' +
                '</li>' +
                '</ul>' +
                '</div>';
            return listDiv;
        },



        onClick: async function (setTemplates, e) {
            const title = this.context.customSubmenu.titleElement.value;
            const text = this.getContents();
            if (!title || !text) return;
            try {
                const response = await axiosInstance.post('/template', {
                    title: title,
                    text: text
                });

                const fetching = await axiosInstance.get('/template');
                const apiData = fetching.data.data;
                const transformedTemplates = apiData.map(item => ({
                    name: item.title,
                    html: item.title
                }));
                setTemplates(transformedTemplates);
                toast.success('Шаблон муафақиятли яратилди');

            } catch (error) {
                console.error("Error saving template:", error);
            }
        },



        onClickRemove: function (e) {
            this.focus();
            const node = this.util.getParentNode(this.context.customSubmenu.currentSpan, 'SPAN');
            this.util.removeItem(node);
            this.context.customSubmenu.currentSpan = null;
            this.submenuOff();
        }
    };

    plugins.custom_plugin_submenu = plugin_submenu;

    const editorOptions = {
        plugins: plugins,
        buttonList: [
            ['undo', 'redo'],
            ['font', 'fontSize', 'formatBlock'],
            ['paragraphStyle', 'blockquote'],
            ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
            ['fontColor', 'hiliteColor', 'textStyle'],
            ['removeFormat'],
            '/',
            ['outdent', 'indent'],
            ['align', 'horizontalRule', 'list', 'lineHeight'],
            ['table', 'link', 'image', 'video'],
            ['fullScreen', 'showBlocks', 'codeView'],
            ['preview', 'print'],
            ['custom_plugin_submenu'],
            ['template'],
            ['save'],
        ],
        templates: templates,
    };


    return (
        <>
            <Accordion open={alwaysOpen} icon={<Icon id={1} open={open} />}>
                <AccordionHeader className='text-sm' onClick={handleAlwaysOpen}>Қайта қабул</AccordionHeader>
                <AccordionBody>
                    <div className="flex gap-4">
                        <DatePicker onChange={(date) => setSelectedDate(date)} />
                        <Button className='flex gap-x-1' onClick={sendDateData}>
                            <ArrowPathIcon className='w-4 h-4' /> Қайта қабулга қўшиш
                        </Button>
                    </div>
                </AccordionBody>
            </Accordion>
            <Accordion open={open === 2} icon={<Icon id={2} open={open} />}>
                <AccordionHeader className='text-sm' onClick={() => handleOpen(2)}>
                    Процедурага юбориш
                </AccordionHeader>
                <AccordionBody>
                    <SendAnalysis visitId={visitId} />
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
                    {Array.isArray(templates) && (
                        <SunEditor
                            key={templates.length}
                            setOptions={editorOptions}
                            height="800px"
                            defaultValue=""
                            setDefaultStyle="font-family: Arial; font-size: 16px;"
                            onChange={(content) => {
                            }}
                        />
                    )}
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
    const [visitId, setVisitId] = useState(null);

    useEffect(() => {
        const fetchVisits = async () => {
            try {
                const response = await axiosInstance.get(`https://back.geolink.uz/api/v1/visit?patient_id=${patientId}`);
                const visitData = response.data.data;
                if (visitData.length > 0) {
                    const firstVisitId = visitData[0].id; // Получаем ID первого визита
                    setVisitId(firstVisitId); // Сохраняем ID первого визита в состоянии
                }
                setVisits(prevVisits => ({
                    ...prevVisits,
                    [patientId]: visitData,
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
            desc: <AccordionCustomIcon  visitId={visitId} mkb10 ={mkb10} patientId={patientId} value={1} />,
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
