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
  ArrowPathIcon,
  ClipboardDocumentCheckIcon,
  EyeIcon,
  EyeSlashIcon, PauseCircleIcon,
  PlayCircleIcon
} from "@heroicons/react/24/solid";
import POSReceipt from "../components/POSReceipt";
import Mkb10List from "./Mkb10/components/Mkb10List";
import {MagnifyingGlassIcon} from "@heroicons/react/24/outline";

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

  const [selectedEpidem, setSelectedEpidem] = useState(null);
  const [selectedEpidemIds, setSelectedEpidemIds] = useState({});
  const [epidemSwitchState, setEpidemSwitchState] = useState({});

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





  const [allServices, setAllServices] = useState([]);
  // State для отфильтрованных услуг, где primary === 1
  const [primaryServices, setPrimaryServices] = useState([]);
  // State для выбранной услуги
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  // Функция для получения всех услуг
  const fetchServices = async () => {
    try {
      const response = await axiosInstance.get("/admin/service?primary=1");
      // Сохраняем все полученные услуги
      setAllServices(response.data.data);
      // Фильтруем услуги, где primary === 1
      const primaryServices = response.data.data.filter(service => service.primary === 1);
      // Сохраняем отфильтрованные услуги
      setPrimaryServices(response.data.data);
    } catch (error) {
      console.error("Ошибка при получении списка услуг:", error);
    }
  };

  // Функция для обработки выбора услуги из списка
  const handleServiceSelect = (selectedOption) => {
    setSelectedService(selectedOption);
    // Дополнительная логика при выборе услуги, если необходимо
  };



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
      return <div>Загрузка...</div>;
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
                          <Avatar src={`${patient.avatar}`} size="xl" alt="avatar" variant="rounded"/>
                          <div>
                            <h3 className="text-base font-semibold leading-7 text-gray-900">{patient.name}</h3>
                            <p className="mt-0 max-w-2xl text-sm leading-6 text-gray-500">Код: SHH7FX6DG</p>
                          </div>
                        </div>
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
              <PatientDetailTabs patientName={patient.name} mkb10={patient.mkb10} patientId={index}/>
            </div>
          </div>
        </>
    );
}
