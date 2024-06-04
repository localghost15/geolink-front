import React, { useState, useEffect } from 'react';
import {
    MagnifyingGlassIcon,
    ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import {BanknotesIcon, PrinterIcon} from "@heroicons/react/24/solid";
import {
    Card,
    CardHeader,
    Typography,

    CardBody,
    CardFooter,
    IconButton,
    Dialog,
    Input,
    Checkbox,
    Radio, Tooltip,
} from "@material-tailwind/react";
import axios from 'axios';
import AddServiceVisit from "./components/AddServiceVisit";
import { v4 as uuidv4 } from 'uuid';
import toast from "react-hot-toast";
import {InputNumber, Spin, Button, Select} from "antd";

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

export default function Admissions() {
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
    const [isPaymentCompleted, setIsPaymentCompleted] = useState(false);

    const handleOpen = (id) => {
        setOpen((cur) => !cur);
        setSelectedVisitId(id);
    };

    const handlePrint = () => {
        window.print(); // Эта функция открывает окно печати браузера
    };


    const statusNames = {
        new: "Янги навбат",
        queue: <span>Навбатда &#8230;</span>,
        completed: "Завершен",
        cancelled: "Отменен"
    };

    const fetchAdmissions = async (page = 1) => {
        setIsLoading(true); // Установить состояние загрузки в true
        try {
            const response = await axiosInstance.get(`/visit?page=${page}&status[0]=new&status[1]=queue`);
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


    useEffect(() => {
        if (!openPayDialog) {
            setSelectedOrderId(null);
            setSelectedOrder(null);
            setPaymentAmount('');
            setPaymentType('');
            setIsPaymentCompleted(false);
        }
    }, [openPayDialog]);

    const handleClosePayDialog = () => {
        setSelectedOrderId(null);
        setOpenPayDialog(false);
        setIsPaymentCompleted(false);
        setSelectedOrder(null); // Очистить выбранный заказ
        setPaymentAmount(''); // Сбросить сумму оплаты
        setPaymentType(''); // Сбросить тип оплаты
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
            fetchAdmissions();
            setIsPaymentCompleted(true);
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
                <Typography className="mx-8 mb-2" variant="h4" color="black">Навбатда</Typography>
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
                            {/*<th className="cursor-pointer border-y border-blue-gray-100bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">*/}
                            {/*    <Typography variant="small" color="blue-gray"*/}
                            {/*                className="flex items-center justify-between gap-2 font-normal leading-none opacity-70">*/}
                            {/*        Услуга кушиш{" "}*/}
                            {/*        <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />*/}
                            {/*    </Typography>*/}
                            {/*</th>*/}
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
                            const isLast = index === admissions.length - 1;
                            const classes = isLast ? "p-3" : "p-3 border-b border-blue-gray-50";

                            return (
                                <tr
                                    className={` ${
                                        status === 'new'
                                            ? ''
                                            : status === 'queue'
                                                ? 'bg-blue-gray-50/50 cursor-not-allowed opacity-60'
                                                : ''
                                    }`}
                                    key={uuidv4()}>
                                    <td className={classes}>
                                        <div className="flex items-center gap-3">
                                            <div className="flex flex-col">
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {index + 1}
                                                </Typography>
                                            </div>
                                        </div>
                                    </td>
                                    <td className={classes}>
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
                                    {/*<td className={classes}>*/}
                                    {/*    <div className="flex items-center gap-3">*/}
                                    {/*        <div className="flex flex-col">*/}
                                    {/*            <Typography onClick={() => handleOpen(currentId)} variant="small" color="blue-gray" className="text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer">*/}
                                    {/*                Услуга кушиш*/}
                                    {/*            </Typography>*/}
                                    {/*            <AddServiceVisit*/}
                                    {/*                open={open}*/}
                                    {/*                onClose={() => setOpen(false)}*/}
                                    {/*                services={services}*/}
                                    {/*                handleServiceSelect={handleServiceSelect}*/}
                                    {/*                handlePaymentMethodSelect={handlePaymentMethodSelect}*/}
                                    {/*                handleSave={handleSave}*/}
                                    {/*                id={selectedVisitId}*/}
                                    {/*            />*/}
                                    {/*        </div>*/}
                                    {/*    </div>*/}
                                    {/*</td>*/}
                                    <td className={classes}>
                                        <div className="flex items-center gap-3">
                                            <div className="flex flex-col">
                                                   <span
                                                       className={`inline-flex items-center rounded-sm px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                                                           status === 'new'
                                                               ? 'bg-blue-50 text-blue-700 ring-blue-600/20'
                                                               : status === 'queue'
                                                                   ? 'bg-green-50 text-green-700 ring-green-600/20'
                                                                   : 'bg-green-50 text-green-700 ring-green-600/20'
                                                       }`}
                                                   >
    {statusNames[status] || status}
</span>

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
                                                {
                                                status === 'new'
                                                    ?
                                                    <Tooltip content="Тўлаш">
                                                        <IconButton className="rounded-full"
                                                                    onClick={() => handleOpenPayDialog(id)}>
                                                            <BanknotesIcon className='w-4 h-4'/>
                                                        </IconButton>
                                                    </Tooltip>

                                                    : status === 'queue'
                                                        ?  ''
                                                        : ''
                                            }

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
                <Card className="p-0">
                    <CardBody className="flex flex-col gap-4">
                        {/*<div className="border border-gray-300 rounded-md px-3 py-2 mb-4">*/}
                        {/*    Выбранная услуга: {selectedOrder && admissions.find(admission => admission.orders.id === selectedOrder)?.orders.service.name}*/}
                        {/*</div>*/}

                        {/*<div className="border border-gray-300 rounded-md px-3 py-2 mb-4">*/}
                        {/*    Заплачено: {selectedOrder && admissions.find(admission => admission.orders.id === selectedOrder)?.orders.payed}*/}
                        {/*    Осталось заплатить: {selectedOrder && (admissions.find(admission => admission.orders.id === selectedOrder)?.orders.amount - admissions.find(admission => admission.orders.id === selectedOrder)?.orders.payed)}*/}
                        {/*</div>*/}

                        {isPaymentCompleted ? (
                            // <div className="border border-gray-300 rounded-md px-3 py-2 mt-4">
                            //     Чек об оплате:
                            //     <br/>
                            //     Услуга: {selectedOrder && admissions.find(admission => admission.orders.id === selectedOrder)?.orders.service.name}
                            //     <br/>
                            //     Заплачено: {paymentAmount}
                            //     <br/>
                            //     Осталось
                            //     заплатить: {selectedOrder && (admissions.find(admission => admission.orders.id === selectedOrder)?.orders.amount - paymentAmount)}
                            //
                            //
                            //
                            //
                            // </div>
                                <div
                                    className="flex items-center px-12 py-12 rounded-b-lg lg:rounded-r-lg lg:rounded-bl-none login-bg">
                            <div id="invoice-POS" >
                                <center id="top">
                                    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M1 17H0H1ZM7 17H6H7ZM17 27V28V27ZM27 17H28H27ZM17 0C12.4913 0 8.1673 1.79107 4.97918 4.97918L6.3934 6.3934C9.20644 3.58035 13.0218 2 17 2V0ZM4.97918 4.97918C1.79107 8.1673 0 12.4913 0 17H2C2 13.0218 3.58035 9.20644 6.3934 6.3934L4.97918 4.97918ZM0 17C0 21.5087 1.79107 25.8327 4.97918 29.0208L6.3934 27.6066C3.58035 24.7936 2 20.9782 2 17H0ZM4.97918 29.0208C8.1673 32.2089 12.4913 34 17 34V32C13.0218 32 9.20644 30.4196 6.3934 27.6066L4.97918 29.0208ZM17 34C21.5087 34 25.8327 32.2089 29.0208 29.0208L27.6066 27.6066C24.7936 30.4196 20.9782 32 17 32V34ZM29.0208 29.0208C32.2089 25.8327 34 21.5087 34 17H32C32 20.9782 30.4196 24.7936 27.6066 27.6066L29.0208 29.0208ZM34 17C34 12.4913 32.2089 8.1673 29.0208 4.97918L27.6066 6.3934C30.4196 9.20644 32 13.0218 32 17H34ZM29.0208 4.97918C25.8327 1.79107 21.5087 0 17 0V2C20.9782 2 24.7936 3.58035 27.6066 6.3934L29.0208 4.97918ZM17 6C14.0826 6 11.2847 7.15893 9.22183 9.22183L10.636 10.636C12.3239 8.94821 14.6131 8 17 8V6ZM9.22183 9.22183C7.15893 11.2847 6 14.0826 6 17H8C8 14.6131 8.94821 12.3239 10.636 10.636L9.22183 9.22183ZM6 17C6 19.9174 7.15893 22.7153 9.22183 24.7782L10.636 23.364C8.94821 21.6761 8 19.3869 8 17H6ZM9.22183 24.7782C11.2847 26.8411 14.0826 28 17 28V26C14.6131 26 12.3239 25.0518 10.636 23.364L9.22183 24.7782ZM17 28C19.9174 28 22.7153 26.8411 24.7782 24.7782L23.364 23.364C21.6761 25.0518 19.3869 26 17 26V28ZM24.7782 24.7782C26.8411 22.7153 28 19.9174 28 17H26C26 19.3869 25.0518 21.6761 23.364 23.364L24.7782 24.7782ZM28 17C28 14.0826 26.8411 11.2847 24.7782 9.22183L23.364 10.636C25.0518 12.3239 26 14.6131 26 17H28ZM24.7782 9.22183C22.7153 7.15893 19.9174 6 17 6V8C19.3869 8 21.6761 8.94821 23.364 10.636L24.7782 9.22183ZM10.3753 8.21913C6.86634 11.0263 4.86605 14.4281 4.50411 18.4095C4.14549 22.3543 5.40799 26.7295 8.13176 31.4961L9.86824 30.5039C7.25868 25.9371 6.18785 21.9791 6.49589 18.5905C6.80061 15.2386 8.46699 12.307 11.6247 9.78087L10.3753 8.21913ZM23.6247 25.7809C27.1294 22.9771 29.1332 19.6127 29.4958 15.6632C29.8549 11.7516 28.5904 7.41119 25.8682 2.64741L24.1318 3.63969C26.7429 8.20923 27.8117 12.1304 27.5042 15.4803C27.2001 18.7924 25.5372 21.6896 22.3753 24.2191L23.6247 25.7809Z"
                                            fill="black"/>
                                    </svg>
                                    <div className="info-logo">
                                        <h2 className="font-bold">Geolink Clinic</h2>
                                    </div>
                                    {/*End Info*/}
                                </center>
                                {/*End InvoiceTop*/}
                                <div id="mid">
                                    <div className="info text-center">
                                        <h2>Богланиш малумот</h2>
                                        <p>
                                            Манзил : Бухоро, Мустакиллик 31 кучаси
                                            <br/>
                                            Phone : 555-555-5555
                                            <br/>
                                        </p>
                                    </div>
                                </div>
                                {/*End Invoice Mid*/}
                                <div id="bot">
                                    <div id="table">
                                        <table>
                                            <tbody>
                                            <tr className="tabletitle">
                                                <td className="item">
                                                    <h2>Хизмат</h2>
                                                </td>
                                                <td className="Rate">
                                                    <h2>Нархи</h2>
                                                </td>
                                            </tr>

                                            <td className="tableitem">
                                                <p className="itemtext">{selectedOrder && admissions.find(admission => admission.orders.id === selectedOrder)?.orders.service.name}</p>
                                            </td>

                                            <td className="tableitem">
                                                <p className="itemtext">{selectedOrder && admissions.find(admission => admission.orders.id === selectedOrder)?.orders.amount} сўм</p>
                                            </td>
                                            <tr className="tabletitle">
                                                <td className="Rate">
                                                    <h2>Жами</h2>
                                                </td>
                                                <td className="payment">
                                                    <h2>{paymentAmount} сўм</h2>
                                                </td>
                                            </tr>
                                            <tr className="tabletitle">
                                                <td className="Rate">
                                                    <h2>Қолган</h2>
                                                </td>
                                                <td className="payment">
                                                    <h2>{selectedOrder && (admissions.find(admission => admission.orders.id === selectedOrder)?.orders.amount - admissions.find(admission => admission.orders.id === selectedOrder)?.orders.payed)} сўм</h2>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    {/*End Table*/}
                                    <div id="legalcopy">
                                        <p className="legal">
                                            <strong>Biznesingiz uchun rahmat!</strong>&nbsp;To'lov 31 kun ichida kutilmoqda; shu
                                            vaqt ichida ushbu hisob-fakturani qayta ishlang. Kechiktirilgan hisobvaraq-fakturalar
                                            uchun oyiga 5% foiz undiriladi.
                                        </p>
                                    </div>
                                    <img src="/qr.svg" className="mx-auto mt-2" width="150" height="150"/>
                                </div>


                                {/*End InvoiceBot*/}
                            </div>
                                </div>
                        ) : (
                            <>
                                <select value={selectedOrder} onChange={(e) => setSelectedOrder(e.target.value)}
                                        className="border focus:outline-none border-gray-300 rounded-md px-3 py-2">
                                    <option value="">Хизматни танланг</option>
                                    {admissions.map((admission) => {
                                        if (admission.id === selectedOrderId) {
                                            return (
                                                <optgroup key={admission.id} label={`Идентификатор: ${admission.id}`}>
                                                    <option key={admission.orders.id} value={admission.orders.id}>
                                                        {`${admission.orders.service.name} - Жами: ${admission.orders.amount} - Туланган: ${admission.orders.payed}`}
                                                    </option>
                                                </optgroup>
                                            );
                                        }
                                        return null;
                                    })}
                                </select>

                                <InputNumber
                                    type="number"
                                    label="Жами"
                                    placeholder="Жами"
                                    className="w-full px-3 py-2"
                                    value={paymentAmount}
                                    onChange={(value) => setPaymentAmount(value)}
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
                            </>
                        )}
                    </CardBody>
                    {!isPaymentCompleted ? (
                        <CardFooter className="pt-0">
                            <Button className="w-full" onClick={handlePayment}>Оплатить</Button>
                        </CardFooter>
                    ) : (
                        <CardFooter className="pt-0">
                            <Button className="w-full" onClick={handlePrint}>Чекни чиқариш</Button>
                        </CardFooter>
                    )}

                </Card>
            </Dialog>

        </>
    );
}


