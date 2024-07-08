import React, { useState, useEffect } from 'react';
import { ChevronUpDownIcon, PencilIcon, TrashIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import { Dialog, Transition } from '@headlessui/react';
import {
  Card,
  Typography,
  CardBody,
  CardFooter,
  Tooltip,
  Input,
  Switch
} from "@material-tailwind/react";
import axios from 'axios';
import {Button} from "antd";
import axiosInstance from "../axios/axiosInstance";

const TABLE_HEAD = ["ID", "Номланиши", "Нархи", "Хизмат тури","Харакат"];

export default function Services() {
  const [isOpen, setIsOpen] = useState(false);
  const [services, setServices] = useState([]);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');
  const [newServiceTime, setNewServiceTime] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);
  const [editServiceId, setEditServiceId] = useState(null);
  console.log(process.env.REACT_APP_API_URL)

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
    setEditServiceId(null)
    setNewServiceName('');
    setNewServicePrice('');
    setIsPrimary(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editServiceId) {
        await axiosInstance.put(`/admin/service/${editServiceId}`, {
          name: newServiceName,
          price: newServicePrice,
          primary: isPrimary ? 1 : 0
        });
      } else {
        await axiosInstance.post("/admin/service", {
          name: newServiceName,
          price: newServicePrice,
          primary: isPrimary ? 1 : 0
        });
      }
      fetchServices();
      closeModal();
    } catch (error) {
      console.error("Ошибка при сохранении сервиса:", error);
    }
  };

  const handleEdit = (service) => {
    setEditServiceId(service.id);
    setNewServiceName(service.name);
    setNewServicePrice(service.price);
    setIsPrimary(service.primary);
    openModal();
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
        <Typography className="mx-2 mb-2" variant="h5" color="black">Асосий хизматлар</Typography>
        <div className="flex items-center shrink-0 flex-col gap-2 sm:flex-row">
          <Button type="primary" onClick={openModal} className="flex h-10 items-center gap-3 normal-case font-normal" size="sm">
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
                          <Input label="Хизмат номи: *" size="lg" value={newServiceName}
                                 onChange={(e) => setNewServiceName(e.target.value)}/>
                          <Input label="Нархи: *" size="lg" value={newServicePrice}
                                 onChange={(e) => setNewServicePrice(e.target.value)}/>
                        </div>
                        <div className="flex items-center mt-2 gap-4">
                          <Switch label={isPrimary ? 'Основной' : 'Дополнительный'}
                              className="h-full w-full checked:bg-[#012c6e]"
                              containerProps={{
                                className: "w-11 h-6",
                              }}
                              circleProps={{
                                className: "before:hidden left-0.5 border-none",
                              }}
                              checked={isPrimary}
                              onChange={(e) => setIsPrimary(e.target.checked)}
                          />
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
          {services.map((service, index) => (
              <tr key={service.id} className={`transition-colors hover:bg-blue-gray-50 ${index % 2 === 0 ? "bg-blue-gray-50/50" : ""}`}>
                <td className="p-2 text-sm">{index+1}</td>
                <td className="p-2 text-sm">{service.name}</td>
                <td className="p-2 text-sm">{service.price} сум</td>
                <td className="p-2 text-sm">{service.primary ? 'Основной' : 'Дополнительный'}</td>
                <td className="p-2 text-sm">
                  <div className="flex items-center gap-4">
                    <Tooltip className="border border-blue-gray-50 text-black bg-white px-4 py-3 shadow-xl shadow-black/10" content="Ўзгартириш">
                      <Button type="dashed" onClick={() => handleEdit(service)} variant="text">
                        <PencilIcon className="h-4 w-4"/>
                      </Button>
                    </Tooltip>
                    <Tooltip className="border border-blue-gray-50 text-black bg-white px-4 py-3 shadow-xl shadow-black/10" content="Ўчириш">
                      <Button type="dashed" onClick={() => handleDelete(service.id)} variant="text">
                        <TrashIcon className="h-4 w-4"/>
                      </Button>
                    </Tooltip>
                  </div>
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
