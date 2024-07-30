import React, { useState, useEffect } from 'react';
import { PencilIcon, TrashIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import { Dialog, Transition } from '@headlessui/react';
import {Card,  Tooltip,  Switch, CardBody} from "@material-tailwind/react";
import {Typography,Input, Button, Table, Pagination } from "antd";
import axiosInstance from "../axios/axiosInstance";
import {BiDialpadAlt} from "react-icons/bi";
import {FaAddressBook} from "react-icons/fa";

const TABLE_HEAD = ["ID", "Номланиши", "Нархи", "Хизмат тури", "Харакат"];

export default function Services() {
  const [isOpen, setIsOpen] = useState(false);
  const [services, setServices] = useState([]);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);
  const [editServiceId, setEditServiceId] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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
    setEditServiceId(null);
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

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const filteredServices = services.filter(service =>
      service.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Номланиши', dataIndex: 'name', key: 'name' },
    { title: 'Префикс', dataIndex: 'prefix', key: 'prefix' },
    { title: 'Нархи', dataIndex: 'price', key: 'price' },
    { title: 'Хизмат тури', dataIndex: 'primary', key: 'primary', render: text => text ? 'Основной' : 'Дополнительный' },
    {
      title: 'Харакат',
      key: 'action',
      render: (text, record) => (
          <div className="flex items-center gap-4">
            <Tooltip className="border border-blue-gray-50 text-black bg-white px-4 py-3 shadow-xl shadow-black/10" content="Ўзгартириш">
              <Button type="dashed" onClick={() => handleEdit(record)} variant="text">
                <PencilIcon className="h-4 w-4" />
              </Button>
            </Tooltip>
            <Tooltip className="border border-blue-gray-50 text-black bg-white px-4 py-3 shadow-xl shadow-black/10" content="Ўчириш">
              <Button type="dashed" onClick={() => handleDelete(record.id)} variant="text">
                <TrashIcon className="h-4 w-4" />
              </Button>
            </Tooltip>
          </div>
      )
    }
  ];

  return (
      <Card className="h-full w-full rounded-none pt-5">
        <div className="px-10">
          <Typography.Title level={3}>Асосий хизматлар</Typography.Title>

          <div className="w-full flex items-center justify-between" style={{marginBottom: 16}}>
            <Input
                prefix={<BiDialpadAlt  size="20"  />}
                style={{width: 300}}
                placeholder="Қидириш..."
                value={searchText}
                onChange={handleSearch}
                className="my-4"
            />
            <Button type="primary" onClick={openModal} className="flex h-10 items-center gap-3 normal-case font-normal"
                    size="sm">
              <UserPlusIcon strokeWidth={2} className="h-5 w-5"/> Янги қўшиш
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
                  <div className="fixed inset-0 bg-black/25"/>
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
                      <Dialog.Panel
                          className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                        <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                          Хизмат кўшиш
                        </Dialog.Title>
                        <div className="mt-2">
                          <div className="grid grid-cols-1 gap-4">
                            <Input placeholder="Хизмат номи: *" size="lg" value={newServiceName}
                                   onChange={(e) => setNewServiceName(e.target.value)}/>
                            <Input placeholder="Нархи: *" size="lg" value={newServicePrice}
                                   onChange={(e) => setNewServicePrice(e.target.value)}/>
                          </div>
                          <div className="flex items-center mt-2 gap-4">
                            <Switch label={isPrimary ? 'Основной' : 'Дополнительный'}
                                    className="h-full w-full checked:bg-[#00AA81]"
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
                        <div className="mt-4 w-full">
                          <Button onClick={handleSave} type="primary" block>Сақлаш</Button>
                        </div>
                      </Dialog.Panel>
                    </Transition.Child>
                  </div>
                </div>
              </Dialog>
            </Transition>
          </div>
        </div>


        <CardBody>

          <Table
              columns={columns}
              dataSource={filteredServices.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
              pagination={false}
              rowKey="id"
          />
        </CardBody>
        <Pagination
            current={currentPage}
            pageSize={pageSize}
            onChange={page => setCurrentPage(page)}
            total={filteredServices.length}
            showSizeChanger
            onShowSizeChange={(current, size) => setPageSize(size)}
        />
      </Card>
  );
}
