import React, {useState, useEffect} from 'react';
import {
  Avatar,
  Typography,
  Accordion,
  AccordionHeader,
  AccordionBody,
  Button,
  IconButton,
  Drawer,
  Input,
  Switch
} from "@material-tailwind/react";
import { useParams } from 'react-router-dom';
import Select from 'react-select';
import PatientDetailTabs from '../components/PatientDetailTabs';
import axios from 'axios';
import {
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/solid";
import {MagnifyingGlassIcon} from "@heroicons/react/24/outline";
import axiosInstance from "../axios/axiosInstance";
import {useVisitId} from "../context/VisitIdContext";
import {fetchVisits} from "../services/visitService";
import CreateVisit from "../components/CreateVisit";
import {Spin} from "antd";

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

export default function PatientDetails() {
  const { index } = useParams();
  const [patient, setPatient] = useState(null);
  const [open, setOpen] = useState(0);
  const [partnerName, setPartnerName] = useState(null);
  const [districtName, setDistrictName] = useState(null);
  const [provinceName, setProvinceName] = useState(null);
  const [epidemData, setEpidemData] = useState([]);
  const [visits, setVisits] = useState({});
  const [visitId, setVisitId] = useState(null);
  const [dataCache, setDataCache] = useState({});
  const [selectedEpidem, setSelectedEpidem] = useState(null);
  const [selectedEpidemIds, setSelectedEpidemIds] = useState({});

  const [mostRecentVisit, setMostRecentVisit] = useState(null);

  useEffect(() => {
    if (visits && Object.keys(visits).length > 0) {
      const patientVisits = visits[index];
      if (Array.isArray(patientVisits)) {
        const recentVisit = patientVisits.reduce((latest, visit) => {
          if (!visit.parent_id && ["queue", "examined", "new"].includes(visit.status)) {
            if (!latest || new Date(visit.date_at) > new Date(latest.date_at)) {
              return visit;
            }
          }
          return latest;
        }, null);
        setMostRecentVisit(recentVisit);
      }
    }
  }, [visits, index]);

  useEffect(() => {
    const fetchPatientVisits = async () => {
      try {
        let visitData = [];
        if (!dataCache[index]) {
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

          setDataCache(prevCache => ({
            ...prevCache,
            [index]: visitData,
          }));
        } else {
          visitData = dataCache[index];
        }

        const recentVisit = visitData.find(visit =>
            visit.parent_id === null &&
            ( visit.bill === "payed" || visit.bill === "pending") && (visit.status === "new" || visit.status === "examined" || visit.status === "queue")
        );

        if (recentVisit) {
          setVisitId(recentVisit.id);
        } else {
          setVisitId(null);
        }

        setVisits(prevVisits => ({
          ...prevVisits,
          [index]: visitData,
        }));
      } catch (error) {
        console.error('Ошибка при получении данных о визитах:', error);
      }
    };

    fetchPatientVisits();
  }, [index, dataCache]);

  const handleSwitchChange = (epidemId) => {
    setEpidemData(prevState =>
        prevState.map(item =>
            item.id === epidemId ? { ...item, active: !item.active } : item
        )
    );

    setSelectedEpidemIds(prevState => ({
      ...prevState,
      [epidemId]: !prevState[epidemId]
    }));
  };

  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = () => {
    setIsVisible(prev => !prev);
  };



  const handleOpen = (value) => setOpen(open === value ? 0 : value);



  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchPatient = async () => {
      try {
        const response = await axios.get(`https://back.geolink.uz/api/v1/patients/${index}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        setPatient(response.data.data);
        const initialSelectedEpidemIds = response.data.data.epidem.map(item => item.id);
        setSelectedEpidemIds(initialSelectedEpidemIds);

        // Отфильтровать выбранные эпидемии и поместить их в начало массива
        const selectedEpidemData = response.data.data.epidem.filter(item => initialSelectedEpidemIds.includes(item.id));
        const unselectedEpidemData = response.data.data.epidem.filter(item => !initialSelectedEpidemIds.includes(item.id));
        const sortedEpidemData = [...selectedEpidemData, ...unselectedEpidemData];
        setEpidemData(sortedEpidemData);
        if (response.data.data.partner_id) {
          const partnerResponse = await axios.get(`https://back.geolink.uz/api/v1/partners/${response.data.data.partner_id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          });
          setPartnerName(partnerResponse.data.data.name);
        }
        if (response.data.data.district_id) {
          const districtResponse = await axios.get(`https://back.geolink.uz/api/v1/global/district/${response.data.data.district_id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          });
          setProvinceName(districtResponse.data.data.province.name);
          setDistrictName(districtResponse.data.data.name);
        }
      } catch (error) {
        console.error("Ошибка при получении информации о пациенте:", error);
      }
    };
    fetchRecords();
    fetchPatient();
  }, [index]);

  const fetchRecords = async () => {
    try {
      const response = await axiosInstance.get("/epidemiological");
      const epidemData = response.data.data;
      setEpidemData(epidemData);

      // Устанавливаем начальное состояние для выбранных эпидемий
      const initialSelectedEpidemIds = {};
      epidemData.forEach(item => {
        initialSelectedEpidemIds[item.id] = item.active;
      });
      setSelectedEpidem(initialSelectedEpidemIds); // Установить начальные выбранные эпидемии
    } catch (error) {
      console.error("Ошибка при получении списка эпидемии:", error);
    }
  };

  const sendEpidemData = async () => {
    const activeEpidems = epidemData.filter(item => item.active).map(item => item.id);
    if (activeEpidems.length === 0) {
      alert("The epidem field is required.");
      return;
    }

    setSelectedEpidem(activeEpidems); // Установить выбранные эпидемии

    const data = { epidem: activeEpidems };

    const config = {
      method: 'post',
      url: `https://back.geolink.uz/api/v1/patient/epidem/${index}`,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(data)
    };

    try {
      const response = await axios.request(config);
      console.log("Epidem data sent successfully:", response.data);
    } catch (error) {
      console.error("Error sending epidem data:", error);
    }
  };



  const CUSTOM_ANIMATION = {
    mount: { scale: 1 },
    unmount: { scale: 0.9 },
  };
  
  if (!patient) {
      return <Spin colorPrimary="#000" tip="Загрузка" ></Spin>;
  }

    return (
        <>
        <div className="pl-5 pb-5">
          <Switch  label={isVisible ? <div className="flex gap-x-1 items-center">
                <EyeSlashIcon className="w-4 h-4"/> Бемор картасини яшириш
              </div> :
              <div className="flex gap-x-1 items-center">
                <EyeIcon className="w-4 h-4"/> Бемор картасини курсатиш
              </div>
          }
                   checked={isVisible}
                   onChange={toggleVisibility}
          />

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
                          <Avatar loading="lazy" src={`${patient.avatar}`} size="lg" alt="avatar" variant="rounded"/>
                          <div>
                            <h3 className="text-base font-semibold leading-7 text-gray-900">{patient.name}</h3>
                            <p className="mt-0 max-w-2xl text-sm leading-6 text-gray-500">Код: SHH7FX6DG</p>
                          </div>
                        </div>
                        <CreateVisit  visit={visitId} patientId={index}/>
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
                      <div className="px-4 py-1 sm:grid sm:grid-cols-1 sm:gap-4 sm:px-0">
                        <Accordion animate={CUSTOM_ANIMATION} open={open === 1} icon={<Icon id={1} open={open}/>}>
                          <AccordionHeader className='text-sm'
                                           onClick={() => handleOpen(1)}>Эпиданамнез</AccordionHeader>
                          <AccordionBody>
                            <div className='flex gap-4'>
                              {/*<Select*/}
                              {/*    options={epidemData.map(item => ({value: item.id, label: item.name}))}*/}
                              {/*    value={selectedEpidem}*/}
                              {/*    onChange={(selectedOption) => setSelectedEpidem(selectedOption)}*/}
                              {/*    placeholder="Выберите эпидемиологическую запись..."*/}
                              {/*/>*/}
                              <label
                                  className="relative w-full bg-white min-w-sm flex flex-col md:flex-row items-center justify-center border py-2 px-2 rounded-md gap-2  focus-within:border-gray-300"
                                  htmlFor="search-bar"
                              >

                                <input
                                    id="search-bar"
                                    placeholder="Қидириш"
                                    className="px-8 py-1 w-full rounded-md flex-1 outline-none bg-white"

                                />
                                <Button  size="md"><MagnifyingGlassIcon
                                    className="h-5 w-5"/></Button>
                                <Button onClick={() => sendEpidemData(selectedEpidem)}>Саклаш</Button>

                              </label>

                            </div>
                            <div className="px-4 py-3 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-0">
                              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                <table className="min-w-full divide-y divide-gray-200">
                                  <thead className="bg-gray-50">
                                  <tr>
                                    <th scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Номланиши
                                    </th>
                                    <th scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Харакат
                                    </th>
                                  </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-gray-200">
                                  {epidemData.map((item) => (
                                      <tr key={item.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                          <Switch
                                              checked={selectedEpidemIds[item.id]}
                                              onChange={() => handleSwitchChange(item.id)}
                                          />
                                        </td>
                                      </tr>
                                  ))}
                                  </tbody>
                                </table>
                              </dd>
                            </div>

                          </AccordionBody>
                        </Accordion>
                      </div>
                    </dl>
                  </div>
                </div>
            )}
            <div className="w-full tabs-part max-w-full overflow-y-auto h-[85vh] pr-3 pl-3">
              <PatientDetailTabs mostRecentVisit={mostRecentVisit} setMostRecentVisit={setMostRecentVisit} visits={visits} visitId={visitId} patientName={patient.name} mkb10={patient.mkb10}  remark={patient.remark} patientId={index}/>
            </div>
          </div>
        </>
    );
}
