import React, { useState, useEffect } from 'react';
import {
    MagnifyingGlassIcon,
    ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import { BanknotesIcon } from "@heroicons/react/24/solid";
import {
    Card,
    CardHeader,
    Typography,
    Button,
    CardBody,
    CardFooter,
    IconButton,
    Dialog,
    Input,
    Checkbox,
    Radio,
} from "@material-tailwind/react";
import axios from 'axios';
import AddServiceVisit from "../Admissions/components/AddServiceVisit";
import { v4 as uuidv4 } from 'uuid';
import toast from "react-hot-toast";
import {Spin, Tag} from "antd";

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

export default function NewAdmissions() {
    const [admissions, setAdmissions] = useState([]);
    const [selectedAdmissionId, setSelectedAdmissionId] = useState(null);
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [open, setOpen] = React.useState(false);
    const [openPayDialog, setOpenPayDialog] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentType, setPaymentType] = useState('');
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [selectedVisitId, setSelectedVisitId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const handleOpen = (id) => {
        setOpen((cur) => !cur);
        setSelectedVisitId(id);
    };

    const statusNames = {
        new: "Янги навбат",
        examined: "Қабулда...",
        completed: "Завершен",
        cancelled: "Отменен"
    };

    const fetchAdmissions = async (page = 1) => {
        setIsLoading(true); // Установить состояние загрузки в true
        try {
            const response = await axiosInstance.get(`/visit?page=${page}&status[0]=examined`);
            const admissionsData = response.data.data;

            // Reverse the admissions array to show the ones at the bottom first
            setAdmissions(admissionsData.reverse());
            setCurrentPage(response.data.meta.current_page);
            setTotalPages(response.data.meta.last_page);
        } catch (error) {
            console.error("Error fetching admissions:", error);
        } finally {
            setIsLoading(false); // Установить состояние загрузки в false после завершения запроса
        }
    };

    const selectedAdmission = admissions.find(admission => admission.id === selectedAdmissionId);

    const handleAdmissionSelect = (admissionId) => {
        setSelectedAdmissionId(admissionId);
    };

    const fetchServices = async () => {
        try {
            const response = await axiosInstance.get('/admin/service');
            setServices(response.data.data);
        } catch (error) {
            console.error("Error fetching services:", error);
        }
    };

    const handleServiceSelect = (service) => {
        setSelectedService(service);
    };

    const handlePaymentMethodSelect = (method) => {
        setPaymentMethod(method);
    };

    const handleSave = async (id) => {
        try {
            const response = await axiosInstance.post(`/visit/service/${id}`, {
                service_id: selectedService,
                type: paymentMethod
            });
            console.log("Saved:", response.data);
            setOpen(false);
        } catch (error) {
            console.error("Error saving data:", error);
        }
    };

    const handleOpenPayDialog = (orderId) => {
        setSelectedOrderId(orderId);
        setOpenPayDialog((cur) => !cur);
    };

    const handleClosePayDialog = () => {
        setSelectedOrderId(null);
        setOpenPayDialog(false);
    };

    const handlePaymentTypeChange = (type) => {
        setPaymentType(type);
    };

    const handlePayment = async () => {
        try {
            console.log("Выбранный orderId:", selectedOrder);

            const response = await axiosInstance.post(`/visit/pay/${selectedOrder}`, {
                amount: paymentAmount,
                type: paymentType
            });
            console.log("Payment successful:", response.data);
            toast.success('Тўлов юборилди !')
            handleClosePayDialog();
        } catch (error) {
            console.error("Error making payment:", error);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
            fetchAdmissions(newPage);
        }
    };

    useEffect(() => {
        fetchServices();
        fetchAdmissions(currentPage);
    }, [currentPage]);


    return (
        <>
            <Card className="h-full w-full rounded-none pt-5">
                <Typography className="mx-8 mb-2" variant="h4" color="black">Қайта навбатлар</Typography>
                <div className="flex mx-8 justify-between gap-8">
                    <label
                        className="relative bg-white min-w-sm flex flex-col md:flex-row items-center justify-center border py-2 px-2 rounded-md gap-2  focus-within:border-gray-300"
                        htmlFor="search-bar"
                    >
                        <input
                            id="search-bar"
                            placeholder="Қидириш"
                            className="px-8 py-1 w-full rounded-md flex-1 outline-none bg-white"
                        />
                        <Button size="md"><MagnifyingGlassIcon className="h-5 w-5" /></Button>
                    </label>
                </div>
                <CardHeader floated={false} shadow={false} className="rounded-none" />
                <Spin colorPrimary="#000" tip="Загрузка" spinning={isLoading}>
                <CardBody className="overflow-scroll px-0">
                    <table className="mt-4 w-full min-w-max table-auto text-left">
                        <thead>
                        <tr>
                            <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                                <Typography variant="small" color="blue-gray"
                                            className="flex items-center justify-between gap-2 font-normal leading-none opacity-70">
                                    ID{" "}
                                    <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4"/>
                                </Typography>
                            </th>
                            <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                                <Typography variant="small" color="blue-gray"
                                            className="flex items-center justify-between gap-2 font-normal leading-none opacity-70">
                                    Бемор ФИО{" "}
                                    <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4"/>
                                </Typography>
                            </th>
                            <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                                <Typography variant="small" color="blue-gray"
                                            className="flex items-center justify-between gap-2 font-normal leading-none opacity-70">
                                    Шифокор Доктор{" "}
                                    <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4"/>
                                </Typography>
                            </th>
                            <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                                <Typography variant="small" color="blue-gray"
                                            className="flex items-center justify-between gap-2 font-normal leading-none opacity-70">
                                    Хизмат қушиш{" "}
                                    <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4"/>
                                </Typography>
                            </th>
                            <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                                <Typography variant="small" color="blue-gray"
                                            className="flex items-center justify-between gap-2 font-normal leading-none opacity-70">
                                    Статус{" "}
                                    <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4"/>
                                </Typography>
                            </th>
                            <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                                <Typography variant="small" color="blue-gray"
                                            className="flex items-center justify-between gap-2 font-normal leading-none opacity-70">
                                    Tўлов{" "}
                                    <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4"/>
                                </Typography>
                            </th>
                            <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                                <Typography variant="small" color="blue-gray"
                                            className="flex items-center justify-between gap-2 font-normal leading-none opacity-70">
                                    Жами{" "}
                                    <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4"/>
                                </Typography>
                            </th>
                            <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                                <Typography variant="small" color="blue-gray"
                                            className="flex items-center justify-between gap-2 font-normal leading-none opacity-70">
                                    Навбат сана{" "}
                                    <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4"/>
                                </Typography>
                            </th>
                            <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                                <Typography variant="small" color="blue-gray"
                                            className="flex items-center justify-between gap-2 font-normal leading-none opacity-70">
                                    Tўлов килиш{" "}
                                    <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4"/>
                                </Typography>
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {admissions.length > 0 && admissions.map(({
                                                                      id,
                                                                      patient_id,
                                                                      total_amount,
                                                                      user_id,
                                                                      doctor,
                                                                      date_at,
                                                                      remark,
                                                                      status,
                                                                      bill,
                                                                      visit_at,
                                                                      debit,
                                                                      order_count,
                                                                      orders
                                                                  }, index) => {
                            const currentId = id;
                            const isLast = id === admissions.length - 1;
                            const classes = isLast ? "p-2" : "p-2 border-b border-blue-gray-50";

                            return (
                                <tr key={uuidv4()}>
                                    <td className={classes}>
                                        <div className="flex items-center gap-3">
                                            <div className="flex flex-col">
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {index+1}
                                                </Typography>
                                            </div>
                                        </div>
                                    </td>   <td className={classes}>
                                        <div className="flex items-center gap-3">
                                            <div className="flex flex-col">
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {patient_id.name}
                                                </Typography>
                                            </div>
                                        </div>
                                    </td>
                                    <td className={classes}>
                                        <div className="flex items-center gap-3">
                                            <div className="flex flex-col">
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {doctor.name}
                                                </Typography>
                                            </div>
                                        </div>
                                    </td>
                                    <td className={classes}>
                                        <div className="flex items-center gap-3">
                                            <div className="flex flex-col">
                                                <Typography onClick={() => handleOpen(currentId)} variant="small" color="blue-gray" className="text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer">
                                                    Услуга кушиш
                                                </Typography>
                                                <AddServiceVisit
                                                    open={open}
                                                    onClose={() => setOpen((false))}
                                                    services={services}
                                                    handleServiceSelect={handleServiceSelect}
                                                    handlePaymentMethodSelect={handlePaymentMethodSelect}
                                                    handleSave={handleSave}
                                                    id={selectedVisitId}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className={classes}>
                                        <div className="flex items-center gap-3">
                                            <div className="flex flex-col">
                                                <Tag bordered={false} color={`${
                                                    status === 'new'
                                                        ? 'blue'
                                                        : status === 'queue'
                                                            ? 'gold'
                                                            : 'success'
                                                }`}>
                                                    {statusNames[status] || status}
                                                </Tag>
                                            </div>
                                        </div>
                                    </td>
                                    <td className={classes}>
                                        <div className="flex items-center gap-3">
                                            <div className="flex flex-col">
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {total_amount} сўм
                                                </Typography>
                                            </div>
                                        </div>
                                    </td>
                                    <td className={classes}>
                                        <div className="flex items-center gap-3">
                                            <div className="flex flex-col">
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {debit} сўм
                                                </Typography>
                                            </div>
                                        </div>
                                    </td>
                                    <td className={classes}>
                                        <div className="flex items-center gap-3">
                                            <div className="flex flex-col">
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {date_at}
                                                </Typography>
                                            </div>
                                        </div>
                                    </td>

                                    <td className={classes}>
                                        <div className="flex items-center gap-3">
                                            <div className="flex flex-col">
                                                <IconButton className="rounded-full"
                                                            onClick={() => handleOpenPayDialog(id)}>
                                                    <BanknotesIcon className='w-4 h-4'/>
                                                </IconButton>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </CardBody>
                </Spin>
                <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                        Сахифа {currentPage} / {totalPages}
                    </Typography>
                    <div className="flex gap-2">
                        <Button
                            variant="outlined"
                            size="sm"
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                        >
                            Олдинги
                        </Button>
                        <Button
                            variant="outlined"
                            size="sm"
                            disabled={currentPage === totalPages}
                            onClick={() => handlePageChange(currentPage + 1)}
                        >
                            Кейингиси
                        </Button>
                    </div>
                </CardFooter>
            </Card>

            <Dialog size="sm" open={openPayDialog} handler={setOpenPayDialog} className="bg-transparent shadow-none">
                <Card>
                    <CardBody className="flex flex-col gap-4">

                        {/*<select*/}
                        {/*    value={selectedOrder}*/}
                        {/*    onChange={(e) => setSelectedOrder(e.target.value)}*/}
                        {/*    className="border border-gray-300 rounded-md px-3 py-2"*/}
                        {/*>*/}
                        {/*    {admissions.map((admission) => {*/}
                        {/*        return (*/}
                        {/*            <option key={admission.orders.id} value={admission.orders.id}>*/}
                        {/*                {`${admission.orders.service.name} - Общая сумма: ${admission.orders.amount} - Заплачено: ${admission.orders.payed}`}*/}
                        {/*            </option>*/}
                        {/*        );*/}
                        {/*    })}*/}
                        {/*</select>*/}

                        <select
                            value={selectedOrder}
                            onChange={(e) => {
                                setSelectedOrder(e.target.value);
                                setSelectedAdmissionId(admissions.find(admission => admission.id === e.target.value).id);
                            }}
                            className="border border-gray-300 rounded-md px-3 py-2"
                        >
                            <option value="">Хизматни танланг</option>
                            {admissions.map((admission) => {
                                if (admission.id === selectedOrderId) {
                                    return (
                                        <optgroup key={admission.id} label={`Admission ID: ${admission.id}`}>
                                            {/* Map through children of each admission */}
                                            {admission.chilrens.map((child) => (
                                                <option key={child.id} value={child.orders.id}>
                                                    {`${child.orders.service.name} - Жами: ${child.orders.amount} - Туланган: ${child.orders.payed}`}
                                                </option>
                                            ))}
                                        </optgroup>
                                    );
                                }
                            })}
                        </select>


                        <Input
                            type="number"
                            label="Жами"
                            placeholder="Жами"
                            className="border border-gray-300 rounded-md px-3 py-2"
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(e.target.value)}
                        />
                        <div className="flex flex-col">
                            <label className="inline-flex items-center">
                                <Radio
                                    checked={paymentType === "cash"}
                                    onChange={() => handlePaymentTypeChange("cash")}
                                />
                                <span className="ml-2">Наличные</span>
                            </label>
                            <label className="inline-flex items-center">
                                <Radio
                                    checked={paymentType === "card"}
                                    onChange={() => handlePaymentTypeChange("card")}
                                />
                                <span className="ml-2">Карта</span>
                            </label>
                            <label className="inline-flex items-center">
                                <Radio
                                    checked={paymentType === "credit"}
                                    onChange={() => handlePaymentTypeChange("credit")}
                                />
                                <span className="ml-2">Кредит</span>
                            </label>
                        </div>
                    </CardBody>
                    <CardFooter className="pt-0">
                        <Button onClick={handlePayment}>Оплатить</Button>
                    </CardFooter>
                </Card>
            </Dialog>
        </>
    );
}


