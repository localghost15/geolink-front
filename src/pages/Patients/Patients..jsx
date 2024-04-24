import React, { useState, useEffect } from "react";
import axios from "axios";
import { Avatar, Button, Card, CardBody, CardFooter, CardHeader, IconButton, Tooltip, Typography } from "@material-tailwind/react";
import { MagnifyingGlassIcon, ChevronUpDownIcon, PencilIcon, EyeIcon, TrashIcon } from "@heroicons/react/24/outline";
import ListsMenu from "./components/ListsMenu";
import PatientsDialog from "./components/PatientsDialog";
import { Link } from "react-router-dom";

const TABLE_HEAD = ["ФИО", "Туғилган санаси", "Телефон", "Идентификатор", "Харакат"];

export default function Patients() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://back.geolink.uz/api/v1/patients', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPatients(response.data.data);
      } catch (error) {
        console.error("Ошибка при получении пациентов:", error);
      }
    };

    fetchPatients();
  }, []);

  return (
    <Card className="h-full w-full rounded-none pt-5">
      <Typography className="mx-8 mb-2" variant="h3" color="black">
        Барча беморлар
      </Typography>

      <div className="flex mx-8 justify-between gap-8">
        <label
          className="relative  bg-white min-w-sm flex flex-col md:flex-row items-center justify-center border py-2 px-2 rounded-md gap-2  focus-within:border-gray-300"
          htmlFor="search-bar"
        >
          <ListsMenu/>

          <input
            id="search-bar"
            placeholder="Қидириш"
            className="px-8 py-1 w-full rounded-md flex-1 outline-none bg-white"
          />
          <Button size="md">
            <MagnifyingGlassIcon className="h-5 w-5" />
          </Button>
        </label>

        <div className="flex items-center shrink-0 flex-col gap-2 sm:flex-row">
          <PatientsDialog />
        </div>
      </div>

      <CardHeader floated={false} shadow={false} className="rounded-none"></CardHeader>
      <CardBody className="overflow-scroll px-0">
        <table className="mt-4  w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head, index) => (
                <th
                  key={head}
                  className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
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
              <tr key={patient.id}>
                <td className="p-4 border-b border-blue-gray-50">
                  <div className="flex items-center gap-3">
                    <Avatar src={`${patient.avatar}`} size="sm" />
                    <div className="flex flex-col">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {patient.name}
                      </Typography>
                      <Typography variant="small" color="blue-gray" className="font-normal opacity-70">
                        {patient.workPlace}
                      </Typography>
                    </div>
                  </div>
                </td>
                <td className="p-4 border-b border-blue-gray-50">
                  <div className="flex flex-col">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {patient.birthDate}
                    </Typography>
                  </div>
                </td>
                <td className="p-4 border-b border-blue-gray-50">
                  <Typography variant="small" color="blue-gray" className="font-normal">
                    {patient.phone}
                  </Typography>
                </td>
                <td className="p-4 border-b border-blue-gray-50">
                  <div className="w-max">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {patient.id}
                    </Typography>
                  </div>
                </td>

                <td className="p-4 border-b border-blue-gray-50">
                  <Tooltip content="Ўзгартириш">
                    <IconButton variant="text">
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
                    <IconButton variant="text">
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
