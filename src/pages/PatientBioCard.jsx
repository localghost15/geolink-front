import React, { useState, useEffect } from 'react';
import axiosInstance from '../axios/axiosInstance';
import {useNavigate, useParams} from 'react-router-dom';
import {
    Avatar,
    Tabs,
    Modal,
    Button,
    Select,
    Tag,
    Typography,
    Divider,
    Switch,
    Spin,
    Collapse,
    Checkbox,
    Alert,
    Descriptions, Image,
    Space
} from 'antd';
import { endVisit, fetchVisits, startVisit } from '../services/visitService';
import { PaymentHistoryTable } from '../components/PaymentHistoryTable';
import AccordionCustomIcon from '../components/AccordionCustomIcon';
import {PiEyeClosedBold} from "react-icons/pi";
import {ImEye} from "react-icons/im";
import {MdHealthAndSafety, MdOutlineAdsClick, MdPlayLesson} from "react-icons/md";
import {BsFillStopwatchFill} from "react-icons/bs";
import {ChevronUpDownIcon} from "@heroicons/react/24/outline";
import {getDispensaryDataPatient} from "../services/dispansery";
const { Panel } = Collapse;

function PatientBioCard() {
    const token = localStorage.getItem('token');
    const { index } = useParams();
    const [patientData, setPatientData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mostRecentVisit, setMostRecentVisit] = useState(null);
    const [visits, setVisits] = useState({});
    const [visitId, setVisitId] = useState(null);
    const [dataCache, setDataCache] = useState({});
    const [isModalVisible, setIsModalVisible] = useState(false); 
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [epidemData, setEpidemData] = useState([]);
    const [selectedService, setSelectedService] = useState(null); // Состояние для выбранного сервиса
    const [selectedPartner, setSelectedPartner] = useState(null); // Состояние для выбранного партнера
    const [services, setServices] = useState([]); // Состояние для списка сервисов
    const [partners, setPartners] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [isButtonLoading, setIsButtonLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const fetchPatientData = async () => {
        try {
            const patientResponse = await axiosInstance.get(`https://back.geolink.uz/api/v1/patients/${index}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            const { data } = patientResponse.data;

            const partnerId = data.partner_id;
            const districtId = data.district_id;

            let partnerResponse, districtResponse;

            if (partnerId) {
                partnerResponse = await axiosInstance.get(`https://back.geolink.uz/api/v1/partners/${partnerId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
            }

            if (districtId) {
                districtResponse = await axiosInstance.get(`https://back.geolink.uz/api/v1/global/district/${districtId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
            }

            const patientData = {
                patient: data,
                partnerName: partnerResponse ? partnerResponse.data.data.name : null,
                provinceName: districtResponse ? districtResponse.data.data.province.name : null,
                districtName: districtResponse ? districtResponse.data.data.name : null,
            };

            setPatientData(patientData);
            setLoading(false);
        } catch (error) {
            console.error("Ошибка при получении информации о пациенте:", error);
        }
    };
    useEffect(() => {


        fetchPatientData();
    }, [index, token]);

    const handleClick = () => {
        navigate(`/patient/admission/${index}`); // Replace with your desired route
    };

    const fetchDoctors = async () => {
        try {
            const response = await axiosInstance.get("/admin/users");
            const doctorUsers = response.data.data.filter(user => user.roles.includes('doctor'));
            setDoctors(doctorUsers);
        } catch (error) {
            console.error("Ошибка при получении списка врачей:", error);
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    const toggleEpidemActiveStatus = (id) => {
        setEpidemData(epidemData.map(item =>
            item.id === id ? { ...item, active: !item.active } : item
        ));
    };


    const handleOk = () => {
        if (patient && patient.epidem) {
            const updatedEpidemData = epidemData.map(epidem => ({
                ...epidem,
                active: patient.epidem.some(patEpidem => patEpidem.id === epidem.id)
            }));
            setEpidemData(updatedEpidemData);
        }
        setIsModalOpen(true);
        // Add your form submission logic here
    };

    const handleNotOk = () => {
        setIsModalOpen(false);
        // Add your form submission logic here
    };

    const fetchRecords = async () => {
        try {
            const response = await axiosInstance.get("/epidemiological");
            const epidemData = response.data.data;
            setEpidemData(epidemData);
            if (patientData) {
                const initialSelectedEpidemIds = patientData.epidem.map(item => item.id);
                const updatedEpidemData = epidemData.map(item => ({
                    ...item,
                    active: initialSelectedEpidemIds.includes(item.id)
                }));
                setEpidemData(updatedEpidemData);
            }
        } catch (error) {
            console.error("Ошибка при получении списка эпидемии:", error);
        }
    };




    const handleSwitchChange = (checked) => {
        setIsVisible(checked); // Toggle the visibility state
      };

    const handleServiceSelect = (value) => {
        setSelectedService(value); // Обновляем выбранный сервис
    };

    const handlePartnerSelect = (value) => {
        setSelectedPartner(value); // Обновляем выбранного партнера
    };

    const handleCreateVisit = async () => {
        try {
            const response = await axiosInstance.post(`/visit?patient_id=${index}&doctor_id=${selectedPartner}&service_id=${selectedService}`);
            console.log("New visit created:", response.data);
    
            setVisitId(response.data.id);
            setMostRecentVisit(response.data);

            fetchPatientVisits();
    
            setIsModalVisible(false);
        } catch (error) {
            console.error("Error creating new visit:", error);
        }
    };

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await axiosInstance.get("/admin/service?primary=1");
                setServices(response.data.data); // Установить список сервисов
            } catch (error) {
                console.error("Ошибка при получении списка услуг:", error);
            }
        };

        const fetchPartners = async () => {
            try {
                const response = await axiosInstance.get("https://back.geolink.uz/api/v1/partners");
                const partners = response.data.data;
                setPartners(partners); // Установить список партнеров
            } catch (error) {
                console.error("Ошибка при получении списка партнеров:", error);
            }
        };

        fetchServices();
        fetchPartners();
    }, []);


    const showModal = () => {
        setIsModalVisible(true); // Показать модальное окно при клике на кнопку
    };

    const handleCancel = () => {
        setIsModalVisible(false); // Скрыть модальное окно
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



    const statusNames = {
        new: 'Янги',
        queue: 'Навбатда',
        pending: 'Ожидание',
        examined: 'Қабулда',
        completed: 'Завершён',
        canceled: 'Отменён',
    };
    const files = mostRecentVisit?.files ?? [];


    const vistTable = [
        {
            key: '1',
            label: 'Қабул санаси:',
            children: (
                <>
                    {mostRecentVisit && mostRecentVisit.date_at}
                </>
            ),
        },
        {
            key: '2',
            label: 'Врач хулосаси:',
            children: (
                <>
                    {mostRecentVisit && mostRecentVisit.remark ?  mostRecentVisit.remark : 'Хулоса йоқ'}
                </>
            ),
        }, {
            key: '3',
            label: 'МКБ10:',
            children: (
                <>
                    {patientData && Array.isArray(patientData.patient.mkb10) && patientData.patient.mkb10.length > 0 ? (
                        patientData.patient.mkb10.map(item => (
                            <div key={item.id}>
                                <p>{item.name}</p>
                            </div>
                        ))
                    ) : (
                        <p>Данные по MKB10 отсутствуют.</p>
                    )}
                </>
            ),
        }, {
            key: '4',
            label: 'Қайта қабул санаси:',
            children: (
                <>
                    {mostRecentVisit ? mostRecentVisit.date_at : ''}
                </>
            ),
        }, {
            key: '5',
            label: 'Диспансер хисобига олинганми:',
            children: (
                <>
                    {renderDispensaryDates()}
                </>
            ),
        }, {
            key: '6',
            label: 'Юкланган файллар:',
            children: (
                <>
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
                            {Array.isArray(files) && files.length > 0 ? (
                                files.map(file => (
                                    <Image
                                        key={file.id}
                                        width={50}
                                        src={file.url}
                                        alt={file.name}
                                    />
                                ))
                            ) : (
                                <p>Файлы отсутствуют.</p>
                            )}
                        </Image.PreviewGroup>

                    </Typography>
                </>
            ),
        }, {
            key: '7',
            label: 'Қўриш:',
            children: (
                <>
                   <Button onClick={handleClick} className="flex items-center" icon={<MdOutlineAdsClick className="text-lg" />} type="link">Барча малумотларини кўриш</Button>
                </>
            ),
        },
    ];

    const sendEpidemData = async () => {
        const activeEpidems = epidemData.filter(item => item.active).map(item => item.id);
        const data = { epidem: activeEpidems };

        const config = {
            method: 'post',
            url: `https://back.geolink.uz/api/v1/patient/epidem/${index}`,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(data)
        };

        try {
            const response = await axiosInstance.request(config);
            console.log("Epidem data sent successfully:", response.data);
            setIsModalOpen(false);
            await fetchPatientData();
            await fetchRecords();
        } catch (error) {
            console.error("Error sending epidem data:", error);
        }
    };
      

      const fetchPatientVisits = async () => {
        try {
            let visitData = [];
            const fetchAllPages = async (patientId) => {
                let allData = [];
                let page = 1;
                let lastPage = 1;

                while (page <= lastPage) {
                    try {
                        const response = await fetchVisits(patientId, page);
                        const pageData = response.data.data;
                        const meta = response.data.meta;

                        allData = [...allData, ...pageData];
                        lastPage = meta.last_page; // обновляем количество страниц
                        page += 1; // переходим к следующей странице
                    } catch (error) {
                        console.error(`Ошибка при получении данных со страницы ${page}:`, error);
                        break;
                    }
                }

                return allData;
            };
            visitData = await fetchAllPages(index);

            // Находим последний визит пациента
            const recentVisit = visitData.find(visit =>
                visit.parent_id === null &&
                (visit.bill === "payed" || visit.bill === "pending") && (visit.status === "new" || visit.status === "examined" || visit.status === "queue")
            );

            // Устанавливаем состояния
            setVisitId(recentVisit ? recentVisit.id : null);
            setVisits(prevVisits => ({
                ...prevVisits,
                [index]: visitData,
            }));
            setMostRecentVisit(recentVisit);
        } catch (error) {
            console.error('Error fetching patient visits:', error);
        }
    };

    useEffect(() => {
        fetchRecords();
    }, []);

      useEffect(() => {
        fetchPatientVisits();
    }, [index]);
    
 
    const handleStartVisit = async () => {
        setIsButtonLoading(true);
        try {
            await startVisit(visitId);
            setMostRecentVisit(prevVisit => ({ ...prevVisit, status: "examined" }));

        } catch (error) {
            console.error('Error starting visit:', error);
    
        } finally {
            setIsButtonLoading(false);
        }
    };

    const handleEndVisit = async () => {
        setIsButtonLoading(true);
        try {
            await endVisit(visitId);
            setMostRecentVisit(prevVisit => ({ ...prevVisit, status: "", total_payed: 0 }));

        } catch (error) {
            console.error('Error ending visit:', error);
            
        } finally {
            setIsButtonLoading(false);
        }
    };




    const shouldRenderAccordionIcon = mostRecentVisit && mostRecentVisit.status === "examined";
    const isBillPending = mostRecentVisit &&
        typeof mostRecentVisit.total_payed === 'number' &&
        mostRecentVisit.total_payed <= 0;

    const statusColors = {
        queue: 'gold',
        examined: 'green',
        new: 'blue',
        pending: 'orange',
        payed: 'purple',
        revisit: 'red'
    };

    const color = mostRecentVisit && mostRecentVisit.status
        ? statusColors[mostRecentVisit.status] || statusColors.default
        : statusColors.default;

    const items = [
        {
          key: '1',
          label: 'Янги Қабул',
          children: <div>
 <div className="p-4 bg-white mb-3 border border-gray-200 rounded-md">
      <Divider orientation="left" orientationMargin={0} className="text-sm font-semibold mb-3 text-gray-800">
        Янги қабул ҳолати
      </Divider>

      <Space direction="vertical" size="small" className="w-full mb-4">
        <Typography.Text className="text-sm font-medium text-gray-700">
          Жорий ҳолат:
          <Tag bordered={false} color={color} className="ml-2 px-2 py-1 font-medium" style={{ backgroundColor: '#F3F4F6', color: '#333' }}>
            {mostRecentVisit && statusNames[mostRecentVisit.status] || mostRecentVisit?.status}
          </Tag>
        </Typography.Text>

        <Typography.Text className="text-sm font-medium text-gray-700">
          Қабул ташриф буюрган:
          <Tag bordered={false} color="processing" className="ml-2 px-2 py-1 font-medium" style={{ backgroundColor: '#E5F3FF', color: '#0052CC' }}>
            {mostRecentVisit?.visit_at}
          </Tag>
        </Typography.Text>
      </Space>

      <Space direction="horizontal" size="small" className="w-full mb-4">
        {(mostRecentVisit && (mostRecentVisit.status === "new" || mostRecentVisit.status === "queue")) && (
          <Button
            icon={<MdPlayLesson />}
            size="middle"
            type="primary"
            className="bg-blue-600 border-none rounded-md hover:bg-blue-700"
            onClick={handleStartVisit}
            disabled={isButtonLoading || isBillPending}
            loading={isButtonLoading}
            style={{ fontWeight: 500 }}
          >
            {isButtonLoading ? 'Қабул бошлаяпти...' : 'Қабулни Бошлаш'}
          </Button>
        )}

        {mostRecentVisit && mostRecentVisit.status === "examined" && (
          <Button
            icon={<BsFillStopwatchFill />}
            size="middle"
            type="primary"
            className="bg-blue-600 border-none rounded-md hover:bg-blue-700"
            onClick={handleEndVisit}
            disabled={isButtonLoading}
            loading={isButtonLoading}
            style={{ fontWeight: 500 }}
          >
            {isButtonLoading ? 'Қабул Тугатяпти...' : 'Қабулни тугатиш'}
          </Button>
        )}
      </Space>

      <Divider orientation="left" orientationMargin={0} className="text-sm font-semibold mt-3 text-gray-800">
        Бемор ҳаракати
      </Divider>
 </div>
              {patientData && shouldRenderAccordionIcon && mostRecentVisit ? (
                  <>
                      <AccordionCustomIcon
                          status={mostRecentVisit.status} // Pass the status to control the icon
                          visits={visits[index]}
                          patientId={index}
                          visitId={visitId}
                          mkb10={patientData.patient.mkb10}
                      />
                  </>
              ) : (
                  <>
                      {mostRecentVisit && mostRecentVisit.total_payed > 0 ? (
                          <Alert
                              message="Бемор қабул бошланишга таййор"
                              description="Бемор хизмат учун пул тўлади учрашув бошланиши мумкин"
                              type="success"
                              showIcon
                          />
                      ) : mostRecentVisit && mostRecentVisit.status === "new" ? (
                          <Alert
                              message="Янги қабул қушилди"
                              description="Қабул қушилган, аммо бемор хали пул тўланмаган"
                              type="warning"
                              showIcon
                          />
                      ) : (
                          <Alert
                              message="Бемор қабулга қўшилмаган"
                              description="Даволашни бошлаш учун илтимос беморни қабулга қўшинг"
                              type="info"
                              showIcon
                          />
                      )}
                  </>
              )}


          </div>,
        },
        {
          key: '2',
          label: 'Тўловлар Тарихи',
          children: <PaymentHistoryTable patientId={index} />,
        },
        {
          key: '3',
          label: 'Қабулларни Кўриш',
          children: <Descriptions column={1} title="Охирги қабул" bordered items={vistTable} />,
        },
      ];

    if (loading) {
        return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
            <Spin tip="Loading" size="large"/>
        </div>;
    }

    const {patient, partnerName, provinceName, districtName} = patientData;
    const isButtonDisabled = mostRecentVisit ? ["examined", "new", "queue"].includes(mostRecentVisit.status) : false;


    return (
       <>
        <div className='flex items-center gap-x-3 px-10 mb-4'>
        <Switch checked={isVisible} onChange={handleSwitchChange} />
            <Typography className="flex items-center gap-2">
                {isVisible ? (
                    <>
                        <ImEye className="text-lg" />
                        <span>Бемор картасини яшириш</span>
                    </>
                ) : (
                    <>
                        <PiEyeClosedBold className="text-lg" />
                        <span>Бемор картасини куриш</span>
                    </>
                )}
            </Typography>
        </div>
        <div className="flex w-full sticky top-0 relative space-x-10">
        {isVisible && (
            <div className='pl-10  w-1/2'>
              <div className="px-4 sm:px-0 ">
                <h3 className="text-xl font-semibold leading-7 text-gray-900">Бемор картаси</h3>
              </div>
              <div className="mt-3 border-t border-gray-100">
                <dl className="divide-y divide-gray-100">
                  <div className="px-4 py-3 sm:grid sm:grid-cols-1 sm:gap-1 sm:px-0">
                    <div className="flex items-center gap-4">
                      <Avatar size={64} loading="lazy" src={`${patient.avatar}`} alt="avatar" variant="rounded"/>
                      <div>
                        <h3 className="text-base font-semibold leading-7 text-gray-900">{patient.name}</h3>
                        <p className="mt-0 max-w-2xl text-sm leading-6 text-gray-500">Код: {patient.code}</p>
                        <p className="mt-0 max-w-2xl text-sm leading-6 text-gray-500">Хозирги қабул рақами: {visitId}</p>
                      </div>
                    </div>
                    <Button type="primary" disabled={isButtonDisabled} onClick={showModal}>Беморни қабулга қушиш</Button>
                <Modal centered title="Создать визит" visible={isModalVisible} onCancel={handleCancel} footer={[
                <Button key="back" onClick={handleCancel}>
                    Отмена
                </Button>,
                <Button key="submit" type="primary" onClick={handleCreateVisit}>
                    Создать
                </Button>,
            ]}>
                <div className='flex items-center flex-row gap-2'>
                <div className='w-full'>
                    <label htmlFor="service">Хизмат:</label>
                    <Select className='w-full' id="service" value={selectedService} onChange={handleServiceSelect} style={{ width: 200 }}>
                        {services.map(service => (
                            <Select.Option key={service.id} value={service.id}>{service.name}</Select.Option>
                        ))}
                    </Select>
                </div>
                <div className='w-full'>
                    <label htmlFor="partner">Доктор:</label>
                    <Select className='w-full' id="partner" value={selectedPartner} onChange={handlePartnerSelect} style={{ width: 200 }}>
                        {doctors.map(partner => (
                            <Select.Option key={partner.id} value={partner.id}>{partner.name}</Select.Option>
                        ))}
                    </Select>
                </div>
                </div>
            </Modal>
                  </div>
                  <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">Иш жойи:</dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{patient.work_address}</dd>
                  </div>
                  <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">Туғилган сана:</dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">1988-04-13</dd>
                  </div>
                  <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">Манзил:</dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{patient.home_address}</dd>
                  </div>
                  <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">Телефон номер:</dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {patient.phone}
                    </dd>
                  </div>
                  <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">Вилоят:</dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {provinceName ? provinceName : 'Нет данных о районе'}
                    </dd>
                  </div>
                  <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">Шаҳар/туман:</dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {districtName ? districtName : 'Нет данных о районе'}
                    </dd>
                  </div>
                  <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">Касби:</dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {patient.profession}
                    </dd>
                  </div>
                  <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">Ким юборди:</dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {partnerName ? partnerName : 'Нет данных о партнере'}
                    </dd>
                  </div>
                  <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">Изоҳ:</dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {patient.remark}
                    </dd>
                  </div>

                </dl>
              </div>
                <Collapse accordion className="w-full">
                    <Panel header="Эпиденамнез" key="1">
                        <Button className="w-full mb-5" onClick={handleOk}>
                            Қушиш
                        </Button>

                        <Modal
                            title="Эпиданамнез Қушиш"
                            visible={isModalOpen}
                            onOk={sendEpidemData}
                            onCancel={handleNotOk}
                            okText="Қушиш"
                            cancelText="Бекор қилиш"
                        >
                            <table className="mt-4 w-full min-w-max table-auto text-left">
                                <thead>
                                <tr>
                                    <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                                        <Typography variant="small" color="blue-gray"
                                                    className="flex items-center justify-between gap-2 font-normal leading-none opacity-70">
                                            ID{" "}
                                        </Typography>
                                    </th>
                                    <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                                        <Typography variant="small" color="blue-gray"
                                                    className="flex items-center justify-between gap-2 font-normal leading-none opacity-70">
                                            Бемор ФИО{" "}
                                            <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4"/>
                                        </Typography>
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {epidemData.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <Checkbox
                                                checked={item.active}
                                                onChange={() => toggleEpidemActiveStatus(item.id)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </Modal>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th
                                    className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                                >
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                                    >
                                        Номланиши
                                        <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4"/>

                                    </Typography>
                                </th>


                                <th
                                    className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                                >
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
                            <tbody className="bg-white divide-y divide-gray-200">
                            {patient.epidem.map(epidem => (
                                <tr key={epidem.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{epidem.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {epidem.description ? epidem.description : 'Малумот йоқ'}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </Panel>
                </Collapse>
            </div>
        )}

            <div className='w-full'>
                <Tabs
                    className='px-12'
                    animated={true}
                    defaultActiveKey="1"
                    type="card"
                    size="large"
                    items={items}
                />
            </div>
        </div>
       </>
    );
}

export default PatientBioCard;
