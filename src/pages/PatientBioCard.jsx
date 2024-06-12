import React, { useState, useEffect } from 'react';
import axiosInstance from '../axios/axiosInstance';
import { useParams } from 'react-router-dom';
import {Avatar, Tabs, Modal, Button, Select, Tag, Typography, Divider, Switch, Spin, Collapse, Checkbox} from 'antd';
import { endVisit, fetchVisits, startVisit } from '../services/visitService';
import { PaymentHistoryTable } from '../components/PaymentHistoryTable';
import AccordionCustomIcon from '../components/AccordionCustomIcon';
import {PiEyeClosedBold} from "react-icons/pi";
import {ImEye} from "react-icons/im";
import {MdHealthAndSafety, MdPlayLesson} from "react-icons/md";
import {BsFillStopwatchFill} from "react-icons/bs";
import {ChevronUpDownIcon} from "@heroicons/react/24/outline";
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
    const [isButtonLoading, setIsButtonLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);

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
            
            // После создания визита вызываем функцию fetchPatientVisits для обновления данных
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

    const statusNames = {
        new: 'Янги',
        queue: 'Навбатда',
        pending: 'Ожидание',
        examined: 'Қабулда',
        completed: 'Завершён',
        canceled: 'Отменён',
    };


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
            setMostRecentVisit(prevVisit => ({ ...prevVisit, status: "closed" }));

        } catch (error) {
            console.error('Error ending visit:', error);
            
        } finally {
            setIsButtonLoading(false);
        }
    };


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

    const shouldRenderAccordionIcon = mostRecentVisit && mostRecentVisit.status === "examined";
    const isBillPending = mostRecentVisit &&
        typeof mostRecentVisit.total_payed === 'number' &&
        mostRecentVisit.total_payed <= 0;

    const items = [
        {
          key: '1',
          label: 'Янги Қабул',
          children: <div>
              <Divider orientation="left" orientationMargin="0">
      Янги қабул холати
    </Divider>
     <Typography className='text-sm mb-2 font-semibold text-blue-gray-900'>
    Жорий холат: <Tag bordered={false} color="gold">
    {mostRecentVisit && statusNames[mostRecentVisit.status] || mostRecentVisit && mostRecentVisit.status}
    </Tag>
</Typography>
    <Typography className='text-sm mb-2 font-semibold text-blue-gray-900'>
    Қабул ташриф буюрган: <Tag bordered={false} color="processing">
    {mostRecentVisit && mostRecentVisit.visit_at || mostRecentVisit && mostRecentVisit.visit_at}
    </Tag>
</Typography>

{(mostRecentVisit && (mostRecentVisit.status === "new" || mostRecentVisit.status === "queue")) && (
    <Button  className="items-center flex" icon={ <MdPlayLesson /> } type='primary' onClick={handleStartVisit}  disabled={isButtonLoading || isBillPending} loading={isButtonLoading}>
        {isButtonLoading ? 'Қабул бошлаяпти...' : 'Қабулни Бошлаш'}
    </Button>
)}


{mostRecentVisit && mostRecentVisit.status === "examined" && (
    <Button className="items-center flex" icon={ <BsFillStopwatchFill /> }  type='primary' onClick={handleEndVisit} disabled={isButtonLoading} loading={isButtonLoading}>
        {isButtonLoading ? 'Қабул Тугатяпти...' : 'Қабулни тугатиш'}
    </Button>
)}
              <Divider orientation="left" orientationMargin="0">
              Бемор харакати
    </Divider>
              {patientData && shouldRenderAccordionIcon && (
                  <AccordionCustomIcon
                      status={mostRecentVisit && mostRecentVisit.status} // Pass the status to control the icon
                      visits={visits[index]}
                      patientId={index}
                      visitId={visitId}
                      mkb10={patientData.patient.mkb10}
                  />
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
          children: 'Content of Tab Pane 3',
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
                        <p className="mt-0 max-w-2xl text-sm leading-6 text-gray-500">Код: SHH7FX6DG</p>
                        <p className="mt-0 max-w-2xl text-sm leading-6 text-gray-500">Текущий визит ID: {visitId}</p>
                      </div>
                    </div>
                    <Button disabled={isButtonDisabled} onClick={showModal}>Беморни қабулга қушиш</Button>
                                 <Modal title="Создать визит" visible={isModalVisible} onCancel={handleCancel} footer={[
                <Button key="back" onClick={handleCancel}>
                    Отмена
                </Button>,
                <Button key="submit" type="primary" onClick={handleCreateVisit}>
                    Создать
                </Button>,
            ]}>
                <div className='flex items-center flex-row gap-2'>
                <div className='w-full'>
                    <label htmlFor="service">Сервис:</label>
                    <Select className='w-full' id="service" value={selectedService} onChange={handleServiceSelect} style={{ width: 200 }}>
                        {services.map(service => (
                            <Select.Option key={service.id} value={service.id}>{service.name}</Select.Option>
                        ))}
                    </Select>
                </div>
                <div className='w-full'>
                    <label htmlFor="partner">Партнер:</label>
                    <Select className='w-full' id="partner" value={selectedPartner} onChange={handlePartnerSelect} style={{ width: 200 }}>
                        {partners.map(partner => (
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
                    size="small"
                    items={items}
                />
            </div>
        </div>
       </>
    );
}

export default PatientBioCard;
