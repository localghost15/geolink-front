import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Avatar, Card, CardBody, CardFooter, CardHeader, Tooltip, Typography } from "@material-tailwind/react";
import { MagnifyingGlassIcon, ChevronUpDownIcon, } from "@heroicons/react/24/outline";
import ListsMenu from "./components/ListsMenu";
import { Link, useNavigate } from "react-router-dom";
import PatientsPostDialog from "./components/PatientsPostDialog";
import PatientsUpdateDialog from "./components/PatientsUpdateDialog";
import toast from "react-hot-toast";
import debounce from 'lodash/debounce';
import {EyeIcon, PencilIcon, TrashIcon} from "@heroicons/react/24/solid";
import {Badge, Button, Tag} from 'antd'
import {Spin} from "antd";

const TABLE_HEAD = ["","Код","ФИО", "Туғилган санаси","Холати","Манзил" , "Телефон", "Харакат"];

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("name");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPatients = useCallback(
      debounce(async (query, category) => {
        setIsLoading(true); // Set loading state to true
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`https://back.geolink.uz/api/v1/patients`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: query ? { [category]: query } : {}
          });
          setPatients(response.data.data);
        } catch (error) {
          console.error("Ошибка при получении пациентов:", error);
        } finally {
          setIsLoading(false); // Set loading state to false
        }
      }, 300),
      []
  );

  useEffect(() => {
    fetchPatients(searchQuery, searchCategory);
  }, [searchQuery, searchCategory, fetchPatients]);

  const handleRemovePatient = async (patientId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://back.geolink.uz/api/v1/patients/${patientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const updatedPatients = patients.filter(patient => patient.id !== patientId);
      setPatients(updatedPatients);
      toast.success('Бемор учрилди!');
    } catch (error) {
      console.error("Ошибка при удалении пациента:", error);
    }
  };

  const handleOpenUpdateDialog = (patient) => {
    setSelectedPatient(patient);
    setIsOpen(true);
  };

  const handleUpdatePatient = async (updatedPatientData) => {
    try {
      const token = localStorage.getItem('token');
      const { pinfl, ...dataWithoutPinfl } = updatedPatientData;

      const dataToSend = { ...dataWithoutPinfl };
      if (dataToSend.remark === null || dataToSend.remark === '') {
        delete dataToSend.remark;
      }

      const response = await axios.put(`https://back.geolink.uz/api/v1/patients/${selectedPatient.id}`, dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const updatedPatient = response.data.data;

      const updatedPatients = patients.map(patient =>
          patient.id === selectedPatient.id ? updatedPatient : patient
      );
      setPatients(updatedPatients);
      setIsOpen(false);
      setSelectedPatient(null);
    } catch (error) {
      console.error("Error updating patient:", error);
    }
  };

  const handleAddPatient = (newPatient) => {
    setPatients([...patients, newPatient]);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const statusLabels = {
    queue: 'Навбатда...',
    examined: 'Қабулда...',
    new: 'Янги кабул',
    pending: 'Ожидает оплаты',
    payed: 'Оплачено',
    revisit: 'Навбатда...'
  };

  const statusColors = {
    queue: 'gold',
    examined: 'green',
    new: 'blue',
    pending: 'orange',
    payed: 'purple',
    revisit: 'gold'
  };

  return (
      <Card className="h-full w-full rounded-none pt-5">
        <Typography className="mx-8 mb-4" variant="h5" color="black">
          Барча беморлар
        </Typography>

        <div className="flex mx-8 justify-between gap-8">
          <label
              className="relative bg-white min-w-sm flex flex-col md:flex-row items-center justify-center border py-2 px-2 rounded-md gap-2 focus-within:border-gray-300"
              htmlFor="search-bar"
          >
            <ListsMenu onSelect={setSearchCategory} />
            <input
                id="search-bar"
                placeholder="Қидириш"
                className="px-8 py-1 w-full rounded-md flex-1 outline-none bg-white"
                onChange={handleSearchChange}
            />
            <Button type="primary" size="md">
              <MagnifyingGlassIcon className="h-5 w-5" />
            </Button>
          </label>

          <div className="flex items-center shrink-0 flex-col gap-2 sm:flex-row">
            <PatientsPostDialog onAddPatient={handleAddPatient} />
            <PatientsUpdateDialog
                selectedPatient={selectedPatient}
                onUpdatePatient={handleUpdatePatient}
            />
          </div>
        </div>

        <CardHeader floated={false} shadow={false} className="rounded-none"></CardHeader>
        <Spin colorPrimary="#000" tip="Загрузка" spinning={isLoading}>
          <CardBody className="overflow-scroll px-0">
            <table className=" w-full min-w-max table-auto text-left">
              <thead>
              <tr>
                {TABLE_HEAD.map((head, index) => (
                    <th
                        key={head}
                        className="cursor-pointer  dark:border-neutral-600 border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                    >
                      <Typography
                          variant="small"
                          color="blue-gray"
                          className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                      >
                        {head}{" "}
                        {index !== TABLE_HEAD.length - 1 && (
                            <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
                        )}
                      </Typography>
                    </th>
                ))}
              </tr>
              </thead>
              <tbody>
              {patients.map((patient, index) => (
                  <tr className="cursor-pointer transition-colors hover:bg-gray-100"   onClick={() => navigate(`/patient/${patient.id}`)} key={patient.id}>
                    <td className="p-2 border-b border-blue-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <Typography variant="small" color="blue-gray" className="font-normal">
                            {index + 1}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td className="p-2 border-b border-blue-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <Typography variant="small" color="blue-gray" className="font-normal">
                            {patient.code}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td className="p-2 border-b border-blue-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <Typography variant="small" color="blue-gray" className="font-normal">
                            {patient.name}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td className="p-2 border-b border-blue-gray-50  dark:border-neutral-600">
                      <div className="flex flex-col">
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {patient.birth_at}
                        </Typography>
                      </div>
                    </td>
                    <td className="p-2 border-b border-blue-gray-50  dark:border-neutral-600">
                      <div className="">
                        <Tag bordered={false} color={patient.visit_status ? statusColors[patient.visit_status.status] : 'defaultColor'}>
                          {patient.visit_status ? statusLabels[patient.visit_status.status] : 'Статус неизвестен'}
                        </Tag>
                      </div>
                    </td>
                    <td className="p-2 border-b border-blue-gray-50  dark:border-neutral-600">
                      <div className="flex flex-col">
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {patient.home_address}
                        </Typography>
                      </div>
                    </td>
                    <td className="p-2 border-b border-blue-gray-50  dark:border-neutral-600">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {patient.phone}
                      </Typography>
                    </td>

                    <td className="p-2 border-b border-blue-gray-50 space-x-1  dark:border-neutral-600">
                      <Tooltip  className="border border-blue-gray-50 text-black bg-white px-4 py-3 shadow-xl shadow-black/10" content="Ўзгартириш">
                        <Button type="dashed" className="rounded-full" size="sm" variant="gradient" onClick={(e) => {
                          e.stopPropagation();
                          handleOpenUpdateDialog(patient)
                        }} >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                      </Tooltip>
                      <Link to={`/patient/${patient.id}`}>
                        <Tooltip  className="border border-blue-gray-50 text-black bg-white px-4 py-3 shadow-xl shadow-black/10" content="Бемор картаси">
                          <Button type="dashed" className="rounded-full" size="sm" variant="gradient" >
                            <EyeIcon className="h-4 w-4" />
                          </Button>
                        </Tooltip>
                      </Link>
                      <Tooltip  className="border border-blue-gray-50 text-black bg-white px-4 py-3 shadow-xl shadow-black/10" content="Ўчириш">
                        <Button type="dashed" className="rounded-full"  size="sm" variant="gradient"  onClick={(e) => {
                          e.stopPropagation();
                          handleRemovePatient(patient.id)
                        }}>
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </Tooltip>
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
          </CardBody>
        </Spin>
        <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
          <Typography variant="small" color="blue-gray" className="font-normal">
            Сахифа 1/10
          </Typography>
          <div className="flex gap-2">
            <Button variant="outlined" size="sm">
              Олдинги
            </Button>
            <Button variant="outlined" size="sm">
              Кейингиси
            </Button>
          </div>
        </CardFooter>
      </Card>
  );
}
