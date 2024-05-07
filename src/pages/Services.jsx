import React, { useState, useEffect } from 'react';
import { ChevronUpDownIcon, PencilIcon, TrashIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import { Dialog, Transition } from '@headlessui/react';
import { Card, Typography, Button, CardBody, CardFooter, IconButton, Tooltip, Input } from "@material-tailwind/react";
import axios from 'axios';

const TABLE_HEAD = ["Номланиши", "Нархи", "Процедура вакти" , "Харакат"];

export default function Services() {
  const [isOpen, setIsOpen] = useState(false);
  const [services, setServices] = useState([]);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');
  const [newServiceTime, setNewServiceTime] = useState('');
  const [records, setRecords] = useState([]);
  
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
    fetchServices();
  }, []); 

  const fetchServices = async () => {
    try {
      const response = await axiosInstance.get("/admin/service");
      setServices(response.data.data);
    } catch (error) {
      console.error("Ошибка при получении списка сервисов:", error);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setNewServiceName('');
    setNewServicePrice('');
    setNewServiceTime('');
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const handleSave = async () => {
    try {
      await axiosInstance.post("/admin/service", { name: newServiceName, price: newServicePrice, time: newServiceTime });
      fetchServices(); 
      closeModal();
    } catch (error) {
      console.error("Ошибка при сохранении сервиса:", error);
    }
  };

  const handleDelete = async (serviceId) => {
    try {
      await axiosInstance.delete(`/admin/service/${serviceId}`);
      fetchServices(); 
    } catch (error) {
      console.error("Ошибка при удалении сервиса:", error);
    }
  };

  return (
    <Card className="h-full w-full rounded-none pt-5">
      <div className="flex items-center mx-8 justify-between gap-8">
        <Typography className="mx-2 mb-2" variant="h3" color="black">Асосий хизматлар</Typography>
        <div className="flex items-center shrink-0 flex-col gap-2 sm:flex-row">
          <Button onClick={openModal} className="flex h-12 items-center gap-3 normal-case font-normal" size="sm">
            <UserPlusIcon strokeWidth={2} className="h-5 w-5 " /> Янги  қўшиш
          </Button>
          <Transition appear show={isOpen} as={React.Fragment}>
            <Dialog as="div" className="relative z-10" onClose={closeModal}>
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black/25" />
              </Transition.Child>
              <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                  <Transition.Child
                    as={React.Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                      <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                        Хизмат кўшиш
                      </Dialog.Title>
                      <div className="mt-2">
                        <div className="grid grid-cols-1 gap-4">
                          <Input label="Хизмат номи: *" size="lg" value={newServiceName} onChange={(e) => setNewServiceName(e.target.value)} />
                          <Input label="Нархи: *" size="lg" value={newServicePrice} onChange={(e) => setNewServicePrice(e.target.value)} />
                          <Input label="Процедура вакти (минут): *" type="number" size="lg" value={newServiceTime} onChange={(e) => setNewServiceTime(e.target.value)} />
                        </div>
                      </div>
                      <div className="mt-4">
                        <Button onClick={handleSave} variant="gradient" fullWidth>Сақлаш</Button>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>
        </div>
      </div>
      <CardBody className="overflow-scroll px-0">
        <table className="mt-4 w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head, index) => (
                <th key={head} className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                  <Typography variant="small" color="blue-gray" className="flex items-center justify-between gap-2 font-normal leading-none opacity-70">
                    {head} {index !== TABLE_HEAD.length - 1 && (<ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />)}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {services.map(({ id, name, price, time }) => (
              <tr key={id} className="transition-colors hover:bg-blue-gray-50 text-sm">
                <td className="p-4">{name}</td>
                <td className="p-4">{price} сум</td>
                <td className="p-4">{time} минут</td>
                <td className="p-4">
                  <Tooltip content="Ўзгартириш">
                    <IconButton onClick={() => console.log("Edit:", id)} variant="text"><PencilIcon className="h-4 w-4" /></IconButton>
                  </Tooltip>
                  <Tooltip content="Ўчириш">
                    <IconButton onClick={() => handleDelete(id)} variant="text"><TrashIcon className="h-4 w-4" /></IconButton>
                  </Tooltip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardBody>
      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        <Typography variant="small" color="blue-gray" className="font-normal">Сахифа 1/10</Typography>
        <div className="flex gap-2">
          <Button variant="outlined" size="sm">Олдинги</Button>
          <Button variant="outlined" size="sm">Кейингиси</Button>
        </div>
      </CardFooter>
    </Card>
  );
}
