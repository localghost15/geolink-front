import React, {useEffect, useState} from "react";
import makeAnimated from "react-select/animated";
import toast from "react-hot-toast";

import plugins from "suneditor/src/plugins";
import {
    Accordion,
    AccordionBody,
    AccordionHeader,
    Button,
    Card,
    CardFooter, IconButton,
    Switch,
    Typography
} from "@material-tailwind/react";
import {ArrowPathIcon, PauseCircleIcon, PlayCircleIcon, PlayPauseIcon} from "@heroicons/react/24/solid";
import CreateVisit from "./CreateVisit";
import DatePicker from "./DatePicker";
import SendAnalysis from "./SignAnalysis";
import SunEditor from "suneditor-react";
import Mkb10List from "../pages/Mkb10/components/Mkb10List";
import {MagnifyingGlassIcon} from "@heroicons/react/24/outline";
import {startVisit, endVisit,  sendDateToServer, uploadFiles} from "../services/visitService";
import {fetchMkb10Data, saveMKB10Data, searchMkb10Data} from "../services/MKB10Service";
import { fetchTemplates} from "../services/templateService";
import {Icon} from "./PatientDetailTabs";
import customPluginSubmenu from "../config/customPluginSubmenu";
import {postDispensaryData} from "../services/dispansery";
import {Upload, Button as ButtonAnt, Badge, Tag} from "antd";
import {DownloadOutlined} from "@ant-design/icons";
import {MdOutlineSync} from "react-icons/md";
import {BsFillStopCircleFill} from "react-icons/bs";
import {BiSolidHourglassTop} from "react-icons/bi";

export default function AccordionCustomIcon({ patientId, mkb10, visitId, visits, mostRecentVisit,  setMostRecentVisit, onUpdateVisits  }) {
    const [open, setOpen] = React.useState(0);
    const [alwaysOpen, setAlwaysOpen] = React.useState(true);
    const [selectedDisease, setSelectedDisease] = useState(null);
    const [mkb10Data, setMkb10Data] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedMKB10, setSelectedMKB10] = useState([]);
    const TABLE_HEAD = ["Код", "Номланиши", "Харакат"];
    const [currentPage, setCurrentPage] = useState(1); // Track current page
    const [totalPages, setTotalPages] = useState(1);
    const animatedComponents = makeAnimated();
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isVisitStarted, setIsVisitStarted] = useState(false);
    const [isButtonLoading, setIsButtonLoading] = useState(false);
    const [templates, setTemplates] = useState([]);

    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleFileChange = ({ fileList }) => {
        setSelectedFiles(fileList);
    };

    const handleUpload = async () => {
        try {
            if (selectedFiles.length === 0) {
                console.error("No files selected");
                return;
            }

            const formData = new FormData();
            selectedFiles.forEach((file, index) => {
                formData.append(`upload[${index}]`, file.originFileObj);
            });

            await uploadFiles(visitId, formData);
            console.log("Files uploaded successfully");
            toast.success('Расмлар юборилди !');
        } catch (error) {
            console.error("Error uploading files:", error);
            toast.error('Файлларни юклашда хатолик юз берди!');
        }
    };

    useEffect(() => {
        const status = localStorage.getItem("visitStatus");
        setIsVisitStarted(status === "started");
    }, []);


    const handleStartVisit = async () => {
        setIsButtonLoading(true);
        try {
            await startVisit(visitId);
            setMostRecentVisit(prevVisit => ({ ...prevVisit, status: "examined" }));
            toast.success('Қабул бошланди!');
        } catch (error) {
            console.error('Error starting visit:', error);
            toast.error('Қабулни бошлашда хатолик юз берди!');
        } finally {
            setIsButtonLoading(false);
        }
    };

    const handleEndVisit = async () => {
        setIsButtonLoading(true);
        try {
            await endVisit(visitId);
            setMostRecentVisit(prevVisit => ({ ...prevVisit, status: "closed" }));
            toast.success('Қабул тугади!');
        } catch (error) {
            console.error('Error ending visit:', error);
            toast.error('Қабулни тугатишда хатолик юз берди!');
        } finally {
            setIsButtonLoading(false);
        }
    };

    const handleAlwaysOpen = () => setAlwaysOpen(cur => !cur);
    const handleOpen = value => {
        setOpen(open === value ? 0 : value);
        if ((value === 4 && templates.length === 0) || (value === 5 && mkb10Data.length === 0)) {
            const fetchData = async () => {
                try {
                    if (value === 4) {
                        const data = await fetchTemplates();
                        setTemplates(data);
                    } else if (value === 5) {
                        const data = await fetchMkb10Data();
                        const initialSelectedMKB10 = mkb10.map(item => item.id);
                        const selectedData = data.filter(item => initialSelectedMKB10.includes(item.id));
                        const remainingData = data.filter(item => !initialSelectedMKB10.includes(item.id));
                        setMkb10Data([...selectedData, ...remainingData]);
                        setSelectedMKB10(initialSelectedMKB10);
                    }
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            };
            fetchData();
        }
    };



    const handleSwitchChange = (id, checked) => {
        setSelectedMKB10(prevState => {
            const updatedMKB10 = checked
                ? [...prevState, id]
                : prevState.filter(item => item !== id);
            return updatedMKB10;
        });
    };

    const handleSelectChange = selectedOptions => {
        setSelectedDisease(selectedOptions);
    };

    const handleSaveMKB10 = async () => {
        try {
            // Передаем идентификатор пациента и выбранные MKB-10 коды
            await saveMKB10Data(patientId, selectedMKB10);
            toast.success('МКБ қўшилди !');
        } catch (error) {
            console.error("Error sending MKB-10 data:", error);
        }
    };

    const sendDateData = async () => {
        if (!selectedDate) {
            toast.error('Илтимос кунни танланг!');
            return;
        }

        const payload = { date_at: selectedDate };

        try {
            await sendDateToServer(visitId, payload);
            toast.success(`Кайта кабул: ${selectedDate}`);
        } catch (error) {
            console.error("Error sending date data:", error);
        }
    };

    const sendDateDespansery = async (patientId) => {
        if (!selectedDate) {
            toast.error('Илтимос кунни танланг!');
            return;
        }

        const payload = {
            mouth_days: [selectedDate],
            patient_id: patientId,
            visit_id: mostRecentVisit.id,
            service_id: 1,
        };

        try {
            await postDispensaryData(payload);
            console.log('sen!!!')
            toast.success(`Деспансер рўйхати: ${selectedDate}`);
        } catch (error) {
            console.error("Error sending date data:", error);
        }
    };

    const handleSearch = async () => {
        setIsLoading(true);
        try {
            const responseData = await searchMkb10Data(searchQuery);
            setMkb10Data(responseData);
        } catch (error) {
            console.error("Error fetching MKB-10 data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearchChange = e => {
        setSearchQuery(e.target.value);
    };



    plugins.custom_plugin_submenu = customPluginSubmenu(setTemplates);

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



    const statusNames = {
        new: "Янги навбат",
        examined: "Қабулда",
        queue: "Навбатда",
        closed: "Қабул тугади"
    };

    return (
        <>
            <Typography className='text-sm font-semibold text-blue-gray-900'>Янги қабул харакати ва холати</Typography>
            {mostRecentVisit ? (
                <div className="mt-4">
                    <Typography className='text-sm mb-2 font-semibold text-blue-gray-900'>
                        Жорий холат: <Tag  bordered={false} color="gold">
                        {statusNames[mostRecentVisit.status] || mostRecentVisit.status}
                    </Tag>
                    </Typography>

                </div>
            ) : (
                <div className="mt-4">
                    <Typography className='text-sm mb-2 font-semibold text-blue-gray-900'>
                        Жорий холат: Пациентни қабулга қушинг
                    </Typography>
                </div>
            )}

            <div className="flex items-center mb-3 gap-x-1">

                {mostRecentVisit && mostRecentVisit.orders.transactions.some(transaction => ['credit', 'cash', 'debit'].includes(transaction.type)) && (
                    mostRecentVisit.status === "new" || mostRecentVisit.status === "queue" ? (
                        <Button size="sm" onClick={handleStartVisit} className="bg-[#15803d] rounded-md flex items-center font-medium gap-x-1 capitalize">
                            {isButtonLoading ? (
                                <>
                                    <ArrowPathIcon className='h-5 w-5 animate-spin' />
                                    <span className="ml-1">Илтимос кутинг</span>
                                </>
                            ) : (
                                <>
                                    <PlayCircleIcon className="h-5 w-5" />
                                    <span className="ml-1">Қабул бошланиш</span>
                                </>
                            )}
                        </Button>
                    ) : (
                        mostRecentVisit.status === "examined" && (
                            <Button size="sm"  onClick={handleEndVisit} className="flex bg-[#2563eb] rounded-md  items-center font-medium gap-x-1 capitalize">
                                {isButtonLoading ? (
                                    <>
                                        <ArrowPathIcon className='h-5 w-5 animate-spin' />
                                        <span className="ml-1">Илтимос кутинг</span>
                                    </>
                                ) : (
                                    <>
                                        <BiSolidHourglassTop className="h-5 w-5" />
                                        <span className="ml-1">Қабул тугатиш</span>
                                    </>
                                )}
                            </Button>
                        )
                    )
                )}

            </div>

            {/*<Typography className='text-sm font-semibold text-blue-gray-900'>Қабул қўшиш</Typography>*/}
            {/*<CreateVisit mostRecentVisit={mostRecentVisit} setMostRecentVisit={setMostRecentVisit} patientId={patientId}/>*/}

            {mostRecentVisit && mostRecentVisit.status === "examined" && (
                <>
                    <Accordion open={open === 1} icon={<Icon id={1} open={open}/>}>
                        <AccordionHeader className='text-sm' onClick={() => handleOpen(1)}>Қайта қабул</AccordionHeader>
                        <AccordionBody>
                            <div className="flex gap-4">
                                <DatePicker onChange={(date) => setSelectedDate(date)}/>
                                <ButtonAnt icon={<ArrowPathIcon className='w-4 h-4'/>} onClick={sendDateData}>
                                     Қайта қабулга қўшиш
                                </ButtonAnt>
                            </div>
                        </AccordionBody>
                    </Accordion>
                    <Accordion open={open === 2} icon={<Icon id={2} open={open}/>}>
                        <AccordionHeader className='text-sm' onClick={() => handleOpen(2)}>
                            Процедурага юбориш
                        </AccordionHeader>
                        <AccordionBody>
                            <SendAnalysis open={open} visitId={visitId}/>
                        </AccordionBody>
                    </Accordion>
                    <Accordion open={open === 3} icon={<Icon id={3} open={open}/>}>
                        <AccordionHeader className='text-sm' onClick={() => handleOpen(3)}>
                            Диспансер рўйхати
                        </AccordionHeader>
                        <AccordionBody>
                            <div className="flex gap-4">
                                <DatePicker onChange={(date) => setSelectedDate(date)}/>
                                <ButtonAnt className='flex gap-x-1' onClick={() => sendDateDespansery(patientId)}>
                                    <ArrowPathIcon className='w-4 h-4'/> {/* Иконка */}
                                    Диспонсер рўйхатига қўшиш
                                </ButtonAnt>
                            </div>
                        </AccordionBody>
                    </Accordion>
                    <Accordion open={open === 4} icon={<Icon id={4} open={open}/>}>
                        <AccordionHeader className='text-sm' onClick={() => handleOpen(4)}>
                            Врач хулосаси
                        </AccordionHeader>
                        <AccordionBody>

                            <Upload  beforeUpload={() => false} fileList={selectedFiles} multiple={true} onChange={handleFileChange}>
                                <ButtonAnt icon={<DownloadOutlined />}>   Рентген, документ , расм ...</ButtonAnt>
                            </Upload>

                            <ButtonAnt className="my-2" type="primary" onClick={handleUpload}>Саклаш ва юбориш</ButtonAnt>


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
                    <Accordion open={open === 5} icon={<Icon id={5} open={open}/>}>
                        <AccordionHeader className='text-sm' onClick={() => handleOpen(5)}>
                            МКБ-10
                        </AccordionHeader>
                        <AccordionBody>
                            <div className=" px-5">

                                <label
                                    className="relative  bg-white min-w-sm flex flex-col md:flex-row items-center justify-center border py-2 px-2 rounded-md gap-2  focus-within:border-gray-300"
                                    htmlFor="search-bar"
                                >
                                    <Mkb10List/>
                                    <input
                                        id="search-bar"
                                        placeholder="Қидириш"
                                        className="px-8 py-1 w-full rounded-md flex-1 outline-none bg-white"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                    />
                                    <ButtonAnt onClick={handleSearch} size="md"><MagnifyingGlassIcon className="h-5 w-5"/></ButtonAnt>
                                    <ButtonAnt className='rounded-md' onClick={handleSaveMKB10}>Саклаш</ButtonAnt>

                                </label>
                                <Card className="h-[40vh] w-full  rounded-none mt-5 overflow-scroll">
                                    <table className="w-full  min-w-max table-auto text-left">
                                        <thead>
                                        <tr>
                                            {TABLE_HEAD.map((head) => (
                                                <th key={head}
                                                    className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
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
                                        {mkb10Data.map(({id, code, name}) => (
                                            <tr key={id} className="even:bg-blue-gray-50/50">
                                                <td className="p-4">
                                                    <Typography variant="small" color="blue-gray"
                                                                className="font-normal">
                                                        {code}
                                                    </Typography>
                                                </td>
                                                <td className="p-4">
                                                    <Typography variant="small" color="blue-gray"
                                                                className="font-normal">
                                                        {name}
                                                    </Typography>
                                                </td>
                                                <td className="p-4">
                                                    <Switch id={id} checked={selectedMKB10.includes(id)}
                                                            onChange={(e) => handleSwitchChange(id, e.target.checked)}/>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </Card>
                                <CardFooter
                                    className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                                    <ButtonAnt variant="outlined" size="sm">
                                        Previous
                                    </ButtonAnt>
                                    <div className="flex items-center gap-2">
                                        <IconButton variant="outlined" size="sm">
                                            1
                                        </IconButton>
                                        <IconButton variant="text" size="sm">
                                            2
                                        </IconButton>
                                        <IconButton variant="text" size="sm">
                                            3
                                        </IconButton>
                                        <IconButton variant="text" size="sm">
                                            ...
                                        </IconButton>
                                        <IconButton variant="text" size="sm">
                                            8
                                        </IconButton>
                                        <IconButton variant="text" size="sm">
                                            9
                                        </IconButton>
                                        <IconButton variant="text" size="sm">
                                            10
                                        </IconButton>
                                    </div>
                                    <ButtonAnt   variant="outlined" size="sm">
                                        Next
                                    </ButtonAnt>
                                </CardFooter>
                            </div>
                        </AccordionBody>
                    </Accordion>
                </>
            )}


        </>
    );
}