import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Avatar, Button, Card, CardBody, CardFooter, CardHeader, IconButton, Tooltip, Typography } from "@material-tailwind/react";
import { MagnifyingGlassIcon, ChevronUpDownIcon, PencilIcon, EyeIcon, TrashIcon } from "@heroicons/react/24/outline";
import ListsMenu from "./components/ListsMenu";
import PatientsDialog from "./components/PatientsDialog";
import { Link, useNavigate } from "react-router-dom";
import PatientsPostDialog from "./components/PatientsPostDialog";
import PatientsUpdateDialog from "./components/PatientsUpdateDialog";
import toast from "react-hot-toast";
import debounce from 'lodash/debounce'; // Add this import

const TABLE_HEAD = ["ФИО", "Туғилган санаси", "Телефон", "Харакат"];

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // Add this state
  const navigate = useNavigate();

  const fetchPatients = useCallback(async (query) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`https://back.geolink.uz/api/v1/patients`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: query ? { name: query } : {}
      });
      setPatients(response.data.data);
    } catch (error) {
      console.error("Ошибка при получении пациентов:", error);
    }
  }, []);

  useEffect(() => {
    fetchPatients(searchQuery);
  }, [fetchPatients, searchQuery]);

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
    setIsOpen(true); // Open the dialog when updating patient data
  };

  const handleUpdatePatient = async (updatedPatientData) => {
    try {
      const token = localStorage.getItem('token');

      // Remove PINFL from the updated data
      const { pinfl, ...dataWithoutPinfl } = updatedPatientData;

      // Check if remark is empty, if so, remove it from dataToSend
      const dataToSend = { ...dataWithoutPinfl };
      if (dataToSend.remark === null || dataToSend.remark === '') {
        delete dataToSend.remark;
      }

      // Send the request to update data without PINFL and possibly without remark
      const response = await axios.put(`https://back.geolink.uz/api/v1/patients/${selectedPatient.id}`, dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const updatedPatient = response.data.data;

      // Update the list of patients with the updated data
      const updatedPatients = patients.map(patient =>
          patient.id === selectedPatient.id ? updatedPatient : patient
      );
      setPatients(updatedPatients);
      setIsOpen(false); // Close the dialog after successful update
      setSelectedPatient(null);
    } catch (error) {
      console.error("Error updating patient:", error);
    }
  };

  const handleAddPatient = (newPatient) => {
    setPatients([...patients, newPatient]);
  };

  const handleSearchChange = debounce((e) => {
    setSearchQuery(e.target.value);
  }, 300); // Debounce the input to limit the API calls

  return (
      <Card className="h-full w-full rounded-none pt-5">
        <Typography className="mx-8 mb-2" variant="h3" color="black">
          Барча беморлар
        </Typography>

        <div className="flex mx-8 justify-between gap-8">
          <label
              className="relative bg-white min-w-sm flex flex-col md:flex-row items-center justify-center border py-2 px-2 rounded-md gap-2 focus-within:border-gray-300"
              htmlFor="search-bar"
          >
            <ListsMenu />

            <input
                id="search-bar"
                placeholder="Қидириш"
                className="px-8 py-1 w-full rounded-md flex-1 outline-none bg-white"
                onChange={handleSearchChange} // Add onChange handler
            />
            <Button size="md">
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
        <CardBody className="overflow-scroll px-0">
          <table className="mt-4 w-full min-w-max table-auto text-left ">
            <thead>
            <tr>
              {TABLE_HEAD.map((head, index) => (
                  <th
                      key={head}
                      className="cursor-pointer border-x dark:border-neutral-600 border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
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
            {patients.map((patient) => (
                <tr className="cursor-pointer transition-colors " key={patient.id}>
                  <td className="p-4 border-b border-blue-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {patient.name}
                        </Typography>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 border-b border-blue-gray-50 border-x dark:border-neutral-600">
                    <div className="flex flex-col">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {patient.birth_at}
                      </Typography>
                    </div>
                  </td>
                  <td className="p-4 border-b border-blue-gray-50 border-x dark:border-neutral-600">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {patient.phone}
                    </Typography>
                  </td>

                  <td className="p-4 border-b border-blue-gray-50 border-x dark:border-neutral-600">
                    <Tooltip content="Ўзгартириш">
                      <IconButton onClick={() => handleOpenUpdateDialog(patient)} variant="text">
                        <PencilIcon className="h-4 w-4" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip content="Бемор картаси">
                      <Link to={`/patient/${patient.id}`}>
                        <IconButton variant="text">
                          <EyeIcon className="h-4 w-4" />
                        </IconButton>
                      </Link>
                    </Tooltip>
                    <Tooltip content="Ўчириш">
                      <IconButton variant="text" onClick={() => handleRemovePatient(patient.id)}>
                        <TrashIcon className="h-4 w-4" />
                      </IconButton>
                    </Tooltip>
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
        </CardBody>
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
