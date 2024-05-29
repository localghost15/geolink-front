import React, { useEffect, useState } from 'react';
import {
    MagnifyingGlassIcon,
    ChevronUpDownIcon,
    InformationCircleIcon,
    DocumentArrowDownIcon,
    PaperAirplaneIcon,
} from '@heroicons/react/24/outline';
import {
    Card,
    CardHeader,
    Typography,
    Button,
    CardBody,
    CardFooter,
    IconButton,
    Tooltip,
    Input,
} from '@material-tailwind/react';
import SignAnalysisList from './Lists/SignAnalysisList';
import axios from 'axios';
import POSReceipt from "./POSReceipt";
import toast from "react-hot-toast";

const TABLE_HEAD = ['Хизматлар', 'Нархи', 'Количество', 'Умумий сумма'];

export default function SendAnalysis({visitId}) {
    const [quantities, setQuantities] = useState({});
    const [services, setServices] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const axiosInstance = axios.create({
        baseURL: 'https://back.geolink.uz/api/v1',
    });

    axiosInstance.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );


    const handleSubmitRegister = () => {
        // Отправляем POST-запрос на сервер
        axiosInstance.post(`visit/service/${visitId}`, {
            service: selectedServices.map(service => service.id), // Отправляем только id сервисов
            type: "cash",
            cash: 0
        })

            .then(response => {
                console.log(response.data);
                setQuantities({});
                toast.success('Хизмат чеки кассага юборилди!');

            })
            .catch(error => {
                toast.error('Хизмат ни танланг ва Навбатга кушилганини хам текширинг !')
                console.error('There was an error!', error); // Обрабатываем ошибку
            });
    };

    useEffect(() => {
        fetchServices(currentPage);
    }, [currentPage]);

    const fetchServices = async (page) => {
        try {
            const response = await axiosInstance.get(`/admin/service?page=${page}&primary=0`);
            const services = response.data.data;
            setServices(services);

            // Initialize quantities state with 0 for each service
            const initialQuantities = services.reduce((acc, service) => {
                acc[service.id] = 0;
                return acc;
            }, {});
            setQuantities(initialQuantities);

            // Update pagination info
            const { current_page, last_page } = response.data.meta;
            setCurrentPage(current_page);
            setTotalPages(last_page);
        } catch (error) {
            console.error('Ошибка при получении списка сервисов:', error);
        }
    };

    const incrementQuantity = (service) => {
        setQuantities((prevQuantities) => ({
            ...prevQuantities,
            [service.id]: (prevQuantities[service.id] || 0) + 1,
        }));
        setSelectedServices((prevSelected) => [...prevSelected, { id: service.id, name: service.name, price: service.price}]);
    };

    const decrementQuantity = (service) => {
        setQuantities((prevQuantities) => {
            const newQuantity = Math.max((prevQuantities[service.id] || 0) - 1, 0);
            return {
                ...prevQuantities,
                [service.id]: newQuantity,
            };
        });
        setSelectedServices((prevSelected) => {
            const index = prevSelected.findIndex((selected) => selected.id === service.id);
            if (index > -1) {
                const updatedSelected = [...prevSelected];
                updatedSelected.splice(index, 1);
                return updatedSelected;
            }
            return prevSelected;
        });
    };



    useEffect(() => {
        console.log("Выбранные сервисы:", selectedServices);
    }, [selectedServices]);


    const calculateSum = (price, quantity) => {
        return price * quantity;
    };

    const calculateTotalSum = () => {
        return services.reduce((total, service) => {
            const quantity = quantities[service.id] || 0;
            return total + calculateSum(service.price, quantity);
        }, 0);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredServices = services.filter((service) =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <>
            <Card className="h-full w-full rounded-none pt-5">
                <div className="flex mx-8 justify-between gap-8">
                    <label
                        className="relative bg-white min-w-sm flex flex-col md:flex-row items-center justify-center border py-2 px-2 rounded-md gap-2 focus-within:border-gray-300"
                        htmlFor="search-bar"
                    >
                        <SignAnalysisList />

                        <input
                            id="search-bar"
                            placeholder="Қидириш"
                            className="px-8 py-1 w-full rounded-md flex-1 outline-none bg-white"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                        <Button size="md">
                            <MagnifyingGlassIcon className="h-5 w-5" />
                        </Button>
                    </label>
                </div>

                <CardHeader floated={false} shadow={false} className="rounded-none"></CardHeader>
                <CardBody className="overflow-scroll px-0">
                    <table className="mt-1 w-full min-w-max table-auto text-left">
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
                                        {head}
                                        {index !== TABLE_HEAD.length - 1 && (
                                            <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
                                        )}
                                    </Typography>
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {filteredServices.map(({ id, name, price }, index) => {
                            const isLast = index === filteredServices.length - 1;
                            const classes = isLast ? 'p-4' : 'p-4 border-b border-blue-gray-50';
                            const quantity = quantities[id] || 0;

                            return (
                                <tr key={id}>
                                    <td className={classes}>
                                        <div className="flex items-center gap-3">
                                            <div className="flex flex-col">
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {name}
                                                </Typography>
                                            </div>
                                        </div>
                                    </td>
                                    <td className={classes}>
                                        <div className="flex items-center gap-3">
                                            <div className="flex flex-col">
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {price} сум
                                                </Typography>
                                            </div>
                                        </div>
                                    </td>
                                    <td className={classes}>
                                        <div className="flex items-center gap-3">
                                            <div className="flex flex-col">
                                                <form className="max-w-xs mx-auto">
                                                    <div className="relative flex items-center max-w-[11rem]">
                                                        <button
                                                            type="button"
                                                            onClick={() => decrementQuantity({ id, name, price })}
                                                            className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                                                        >
                                                            <svg
                                                                className="w-3 h-3 text-gray-900 dark:text-white"
                                                                aria-hidden="true"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 18 2"
                                                            >
                                                                <path
                                                                    stroke="currentColor"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M1 1h16"
                                                                />
                                                            </svg>
                                                        </button>
                                                        <input
                                                            type="text"
                                                            id="bedrooms-input"
                                                            value={quantity}
                                                            aria-describedby="helper-text-explanation"
                                                            className="bg-gray-50 border-x-0 border-gray-300 h-11 font-medium text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full pb-6 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                            placeholder=""
                                                            required
                                                            readOnly
                                                        />
                                                        <div className="absolute bottom-1 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 flex items-center text-xs text-gray-400 space-x-1 rtl:space-x-reverse">
                                                            <InformationCircleIcon className="h-4 w-4" />
                                                            <span>Хизмат</span>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => incrementQuantity({ id, name, price })}
                                                            className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                                                        >
                                                            <svg
                                                                className="w-3 h-3 text-gray-900 dark:text-white"
                                                                aria-hidden="true"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 18 18"
                                                            >
                                                                <path
                                                                    stroke="currentColor"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M9 1v16M1 9h16"
                                                                />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </td>
                                    <td className={classes}>
                                        <div className="flex flex-col">
                                            <Typography variant="small" color="blue-gray" className="font-normal">
                                                {calculateSum(price, quantity)} сум
                                            </Typography>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </CardBody>
                <div className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                    <div> Уммумий киймат:</div>
                    <div>{calculateTotalSum()} сум</div>
                </div>
                <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                        Сахифа {currentPage}/{totalPages}
                    </Typography>
                    <div className="flex gap-2">
                        <POSReceipt visitId={visitId} selectedServices={selectedServices} />
                        <Button onClick={handleSubmitRegister} size="sm" className="flex py-3 items-center gap-x-1">
                            <PaperAirplaneIcon className="w-4 h-4" /> Кассага юбориш
                        </Button>
                    </div>
                </CardFooter>
                <CardFooter className="flex items-center justify-center border-t border-blue-gray-50 p-4">
                    <div className="flex items-center gap-2">
                        <IconButton variant="outlined" size="sm" onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
                            1
                        </IconButton>
                        {Array.from({ length: totalPages - 2 }, (_, i) => i + 2).map((page) => (
                            <IconButton
                                key={page}
                                variant="text"
                                size="sm"
                                onClick={() => handlePageChange(page)}
                                disabled={currentPage === page}
                            >
                                {page}
                            </IconButton>
                        ))}
                        <IconButton variant="text" size="sm" onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}>
                            {totalPages}
                        </IconButton>
                    </div>
                </CardFooter>
            </Card>
        </>
    );
}
