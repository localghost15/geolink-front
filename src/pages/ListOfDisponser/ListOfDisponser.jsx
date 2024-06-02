import React, {Fragment, useEffect, useState} from 'react'

import {
    MagnifyingGlassIcon,
    ChevronUpDownIcon,
  } from "@heroicons/react/24/outline";
  import { BanknotesIcon} from "@heroicons/react/24/solid";
  import {
    Card,
    CardHeader,
    Typography,
    Button,
    CardBody,
    CardFooter,
    IconButton,

  } from "@material-tailwind/react";
import ListOfDisponserList from './components/ListOfDisponserList';
import {getDispensaryData} from "../../services/dispansery";
   
 
   
  const TABLE_HEAD = ["ФИО","Туғилган санаси","Телефон номер","Идентификатор","Қабул куни"];


   
  export default function ListOfDisponser() {
      const [dispensaryData, setDispensaryData] = useState([]);

      useEffect(() => {
          const fetchData = async () => {
              try {
                  const data = await getDispensaryData();
                  setDispensaryData(data.data);
              } catch (error) {
                  console.error('Ошибка при получении данных о диспансере:', error);
              }
          };

          fetchData();
      }, []);

    return (
      <Card className="h-full w-full rounded-none pt-5">
           

        <Typography className="mx-8 mb-2" variant="h3" color="black">Диспонсер ҳисоби</Typography>

        <div className="flex mx-8 justify-between gap-8">
        <label
    className="relative  bg-white min-w-sm flex flex-col md:flex-row items-center justify-center border py-2 px-2 rounded-md gap-2  focus-within:border-gray-300"
    htmlFor="search-bar"
  >
    <ListOfDisponserList/>
  
    <input
      id="search-bar"
      placeholder="Қидириш"
      className="px-8 py-1 w-full rounded-md flex-1 outline-none bg-white"
    />
    <Button size="md" ><MagnifyingGlassIcon className="h-5 w-5" /></Button>
  </label>
  
        </div>
             
  
        <CardHeader floated={false} shadow={false} className="rounded-none">
  
         
        </CardHeader>
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
                                    <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4"/>
                                )}
                            </Typography>
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {dispensaryData.map(({patient, visit, service, user_id}, index) => {
                    const isLast = index === dispensaryData.length - 1;
                    const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                    return (
                        <tr key={patient.id}>
                            <td className={classes}>
                                <div className="flex items-center gap-3">
                                    <div className="flex flex-col">
                                        <Typography variant="small" color="blue-gray" className="font-normal">
                                            {patient.name}
                                        </Typography>
                                    </div>
                                </div>
                            </td>
                            <td className={classes}>
                                <div className="flex items-center gap-3">
                                    <div className="flex flex-col">
                                        <Typography variant="small" color="blue-gray" className="font-normal">
                                            {visit.date}
                                        </Typography>
                                    </div>
                                </div>
                            </td>
                            <td className={classes}>
                                <div className="flex items-center gap-3">
                                    <div className="flex flex-col">
                                        <Typography variant="small" color="blue-gray" className="font-normal">
                                            {user_id.name}
                                        </Typography>
                                    </div>
                                </div>
                            </td>
                            <td className={classes}>
                                <div className="flex items-center gap-3">
                                    <div className="flex flex-col">
                                        <Typography variant="small" color="blue-gray" className="font-normal">
                                            {service.id}
                                        </Typography>
                                    </div>
                                </div>
                            </td>
                            <td className={classes}>
                                <div className="flex items-center gap-3">
                                    <div className="flex flex-col">
                                        <Typography variant="small" color="blue-gray" className="font-normal">
                                            {visit.date}
                                        </Typography>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    );
                })}
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