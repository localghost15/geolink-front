import React, {useState, useEffect} from 'react';
import { Avatar, Typography,Accordion,AccordionHeader,AccordionBody,} from "@material-tailwind/react";
import { useParams } from 'react-router-dom';
import PatientDetailTabs from '../components/PatientDetailTabs';
import axios from 'axios';

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
        // Проверяем наличие партнера у пациента
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

    fetchPatient();
  }, [index]);

  const CUSTOM_ANIMATION = {
    mount: { scale: 1 },
    unmount: { scale: 0.9 },
  };
  
  if (!patient) {
      return <div>Загрузка...</div>;
  }


    return (
       <div className="grid grid-cols-3 space-x-10">
 <div className='pl-10 col-span-1'>
      <div className="px-4 sm:px-0">
        <h3 className="text-xl font-semibold leading-7 text-gray-900">Бемор картаси</h3>
      </div>
      <div className="mt-3 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-3 sm:grid sm:grid-cols-1 sm:gap-1 sm:px-0">
          <div className="flex items-center gap-4">
        <Avatar src={`${patient.avatar}`} size="xl" alt="avatar" variant="rounded" />
        {/* <div>
          <Typography variant="h6">Tania Andrew</Typography>
          <Typography variant="small" color="gray" className="font-normal">
            Web Developer
          </Typography>
        </div> */}
      </div>
        <h3 className="text-base font-semibold leading-7 text-gray-900">{patient.name}</h3>
        <p className="mt-0 max-w-2xl text-sm leading-6 text-gray-500">Код: SHH7FX6DG</p>
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
          <Accordion animate={CUSTOM_ANIMATION} open={open === 1} icon={<Icon id={1} open={open} />}>
        <AccordionHeader className='text-sm' onClick={() => handleOpen(1)}>Эпиданамнез</AccordionHeader>
        <AccordionBody>
        Эпидемиологик
        </AccordionBody>
      </Accordion>
          </div>
        </dl>
      </div>
    </div>
    <div className="col-span-2 pr-10">
        <PatientDetailTabs/>
    </div>
       </div>
    );
}
