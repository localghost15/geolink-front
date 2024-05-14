import React, {useState, useEffect} from 'react'

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
    Dialog,
    Input,
    Checkbox,
    Radio,
    RadioGroup,

} from "@material-tailwind/react";
import AdmissionsList from './components/AdmissionsList';
import Select from 'react-select';
import axios from 'axios'
import AddServiceVisit from "./components/AddServiceVisit";
import { v4 as uuidv4 } from 'uuid';


const TABLE_HEAD = ["ФИО","Идентификатор","Услуга","Tўлов","Tўлов килиш"];

const TABLE_ROWS = [
    {
        name: "Bekzod Negmatillayev",
        birth: "05-03-1999",
        phone: "+998901234567",
        service: "54354353",
        price: "80 000",
        sum: "140 000",
        payment: "Тўланган",

    },
];

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
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [open, setOpen] = React.useState(false);
    const [openPayDialog, setOpenPayDialog] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentType, setPaymentType] = useState('');
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [selectedVisitId, setSelectedVisitId] = useState(null);
    const handleOpen = (id) => {
        setOpen(true);
        setSelectedVisitId(id); // Устанавливаем выбранный id
    };

    // Функция для получения данных приемов
    const fetchAdmissions = async () => {
        try {
            const response = await axiosInstance.get('/visit');
            setAdmissions(response.data.data);
        } catch (error) {
            console.error("Error fetching admissions:", error);
        }
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
            // Отправка POST запроса
            const response = await axiosInstance.post(`/visit/service/${id}`, {
                service_id: selectedService,
                type: paymentMethod
            });
            console.log("Saved:", response.data);
            // Закрываем диалог
            setOpen(false);
        } catch (error) {
            console.error("Error saving data:", error);
        }
    };


    const handleOpenPayDialog = (orderId) => {
        setSelectedOrderId(orderId);
        console.log(orderId)
        setOpenPayDialog(true);
    };

    const handleClosePayDialog = () => {
        setSelectedOrderId(null);
        setOpenPayDialog(false); // Мы убрали это здесь
    };

    const handlePaymentTypeChange = (type) => {
        setPaymentType(type);
    };

    const handlePayment = async () => {
        try {
            const response = await axiosInstance.post(`/visit/pay/${selectedOrderId}`, {
                amount: paymentAmount,
                type: paymentType
            });
            console.log("Payment successful:", response.data);
            handleClosePayDialog();
        } catch (error) {
            console.error("Error making payment:", error);
        }
    };

    useEffect(() => {
        fetchServices();
        fetchAdmissions();
    }, []);

    return (
        <Card className="h-full w-full rounded-none pt-5">
            <Typography className="mx-8 mb-2" variant="h3" color="black">Навбатда</Typography>
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
                    <Button size="md" ><MagnifyingGlassIcon className="h-5 w-5" /></Button>
                </label>
            </div>
            <CardHeader floated={false} shadow={false} className="rounded-none" />
            <CardBody className="overflow-scroll px-0">
                <table className="mt-4  w-full min-w-max table-auto text-left">
                    <thead>
                    <tr>
                        <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                            <Typography variant="small" color="blue-gray"
                                        className="flex items-center justify-between gap-2 font-normal leading-none opacity-70">
                                ФИО{" "}
                                <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4"/>
                            </Typography>
                        </th>
                        <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                            <Typography variant="small" color="blue-gray"
                                        className="flex items-center justify-between gap-2 font-normal leading-none opacity-70">
                                Доктор{" "}
                                <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4"/>
                            </Typography>
                        </th>
                        <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                            <Typography variant="small" color="blue-gray"
                                        className="flex items-center justify-between gap-2 font-normal leading-none opacity-70">
                                Услуга кушиш{" "}
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
                                                              }) => {
                        const currentId = id;
                        const isLast = id === admissions.length - 1;
                        const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
                        const filteredOrders = orders.filter(order => order.visit_id === selectedVisitId);

                        return (
                            <tr key={id}>
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
                                <td className={classes}>
                                    <div className="flex items-center gap-3">
                                        <div className="flex flex-col">
                                            <Typography onClick={() => handleOpen(id)} variant="small" color="blue-gray" className="text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer">
                                                Услуга кушиш
                                            </Typography>

                                            <AddServiceVisit
                                                open={open}
                                                onClose={() => setOpen(false)}
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
                                              <span
                                                  className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-sm font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                          {status}
                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td className={classes}>
                                    <div className="flex items-center gap-3">
                                        <div className="flex flex-col">
                                            <Typography variant="small" color="blue-gray" className="font-normal">
                                                {debit}
                                            </Typography>
                                        </div>
                                    </div>
                                </td>
                                <td className={classes}>
                                    <div className="flex items-center gap-3">
                                        <div className="flex flex-col">
                                            <IconButton className="rounded-full" onClick={() => handleOpenPayDialog(id)}>
                                                <BanknotesIcon className='w-4 h-4'/>
                                            </IconButton>
                                            <Dialog size="sm" open={openPayDialog} onClose={handleClosePayDialog} className="bg-transparent shadow-none">
                                                <Card>
                                                    <CardBody className="flex flex-col gap-4">
                                                        {/* Добавляем элемент select для вывода ID, amount и payed выбранного ордера */}
                                                        <select value={selectedOrderId} onChange={(e) => setSelectedOrderId(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2">
                                                            {admissions.map((admission) => (
                                                                <optgroup key={admission.id} label={`Order ID: ${admission.id}`}>
                                                                    {admission.orders.map((order) => (
                                                                        <option key={order.id} value={order.id}>
                                                                            {`${order.service.name} - Общая сумма: ${order.amount} - Заплачено: ${order.payed}`}
                                                                        </option>
                                                                    ))}
                                                                </optgroup>
                                                            ))}
                                                        </select>
                                                        <input
                                                            type="number"
                                                            placeholder="Amount"
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