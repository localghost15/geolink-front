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
import {Upload, Button as ButtonAnt, Badge, Tag, Collapse, Table, message, Pagination} from "antd";
import {DownloadOutlined} from "@ant-design/icons";
import {MdOutlineSync} from "react-icons/md";
import {BsFillStopCircleFill} from "react-icons/bs";
import {BiSolidHourglassTop} from "react-icons/bi";
const { Panel } = Collapse;

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
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filteredData, setFilteredData] = useState([]);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 30,
            total: 0,
        },
    });

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

    useEffect(() => {
        fetchData();
    }, [tableParams.pagination.current]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const { formattedData, meta } = await fetchMkb10Data(tableParams.pagination.current);

            const initialSelectedMKB10 = mkb10.map(item => item.id);
            const selectedData = formattedData.filter(item => initialSelectedMKB10.includes(item.id));
            const remainingData = formattedData.filter(item => !initialSelectedMKB10.includes(item.id));

            const combinedData = [...selectedData, ...remainingData];
            setData(combinedData);
            setFilteredData(combinedData);
            setSelectedMKB10(initialSelectedMKB10);

            setTableParams({
                ...tableParams,
                pagination: {
                    ...tableParams.pagination,
                    total: meta.total,
                },
            });
        } catch (error) {
            console.error('Error fetching data:', error);
            message.error('Failed to load data');
        }
        setLoading(false);
    };

    const handleTableChange = (pagination) => {
        setTableParams({
            pagination,
        });
    };



    const handleAlwaysOpen = () => setAlwaysOpen(cur => !cur);
    const handleOpen = () => {
        setOpen(open);
    };




    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
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

        const payload = {
            mouth_days: [selectedDate],
            patient_id: patientId,
            visit_id: visitId,
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
        setLoading(true);
        try {
            const responseData = await searchMkb10Data(searchQuery);
            setData(responseData);
        } catch (error) {
            console.error('Error fetching MKB-10 data:', error);
            message.error('Failed to search data');
        }
        setLoading(false);
    };

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query) {
            const lowerCaseQuery = query.toLowerCase();
            const filtered = data.filter(item =>
                item.code.toLowerCase().includes(lowerCaseQuery) ||
                item.name.toLowerCase().includes(lowerCaseQuery)
            );
            setFilteredData(filtered);
        } else {
            setFilteredData(data);
        }
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


    const columns = [
        {
            title: 'Код',
            dataIndex: 'code',
            sorter: true,
            width: '20%',
        },
        {
            title: 'Номланиши',
            dataIndex: 'name',
            width: '50%',
        },
        {
            title: 'Харакат',
            dataIndex: 'id',
            render: (id) => (
                <Switch
                    checked={selectedMKB10.includes(id)}
                    onChange={(checked) => handleSwitchChange(id, checked)}
                />
            ),
        },
    ];


    return (
        <>
    
    <div >
    <Collapse
      defaultActiveKey={['1']}
      expandIcon={({ isActive }) => <Icon id={isActive ? open : null} open={open} />}
    >
      <Panel header={<span onClick={() => handleOpen(1)} className='text-sm'>Қайта қабул</span>} key="1">
        <div className="flex gap-4 items-center">
          <DatePicker onChange={(date) => setSelectedDate(date)} />
          <ButtonAnt type="primary" className="flex items-center" icon={<ArrowPathIcon className='w-4 h-4' />} onClick={sendDateData}>
            Қайта қабулга қўшиш
          </ButtonAnt>
        </div>
      </Panel>
      <Panel header={<span onClick={() => handleOpen(2)} className='text-sm'>Процедурага юбориш</span>} key="2">
        <SendAnalysis open={open} visitId={visitId} />
      </Panel>
      <Panel header={<span onClick={() => handleOpen(3)} className='text-sm'>Диспансер рўйхати</span>} key="3">
        <div className="flex gap-4 items-center">
          <DatePicker onChange={(date) => setSelectedDate(date)} />
          <ButtonAnt type="primary" className='flex items-center gap-x-1' onClick={() => sendDateDespansery(patientId)}>
            <ArrowPathIcon className='w-4 h-4' />
            Диспонсер рўйхатига қўшиш
          </ButtonAnt>
        </div>
      </Panel>
      <Panel header={<span onClick={() => handleOpen(4)} className='text-sm'>Врач хулосаси</span>} key="4">
        <Upload beforeUpload={() => false} fileList={selectedFiles} multiple={true} onChange={handleFileChange}>
          <ButtonAnt icon={<DownloadOutlined />}>Рентген, документ , расм ...</ButtonAnt>
        </Upload>
        <ButtonAnt className="my-2" type="primary" onClick={handleUpload}>Саклаш ва юбориш</ButtonAnt>
        {Array.isArray(templates) && (
          <SunEditor
            key={templates.length}
            setOptions={editorOptions}
            height="800px"
            defaultValue=""
            setDefaultStyle="font-family: Arial; font-size: 16px;"
            onChange={(content) => { }}
          />
        )}
      </Panel>
      <Panel header={<span onClick={() => handleOpen(5)} className='text-sm'>МКБ-10</span>} key="5">
        <div className="px-5">
          <label
            className="relative bg-white min-w-sm flex flex-col md:flex-row items-center justify-center border py-2 px-2 rounded-md gap-2 focus-within:border-gray-300"
            htmlFor="search-bar"
          >
            <Mkb10List />
            <input
              id="search-bar"
              placeholder="Қидириш"
              className="px-8 py-1 w-full rounded-md flex-1 outline-none bg-white"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <ButtonAnt onClick={handleSearch} size="md"><MagnifyingGlassIcon className="h-5 w-5" /></ButtonAnt>
            <ButtonAnt className='rounded-md' onClick={handleSaveMKB10}>Саклаш</ButtonAnt>
          </label>
          <Card className="h-[40vh] w-full rounded-none mt-5 overflow-scroll">
              <Table
                  columns={columns}
                  rowKey={(record) => record.id}
                  dataSource={filteredData}
                  loading={loading}
                  onChange={handleTableChange}
              />
          </Card>

           <CardFooter>
               <Pagination
                   {...tableParams.pagination}
                   onChange={(page, pageSize) => {
                       setTableParams({
                           pagination: { current: page, pageSize, total: tableParams.pagination.total },
                       });
                   }}
               />
           </CardFooter>
        </div>
      </Panel>
    </Collapse>
                </div>


        </>
    );
}