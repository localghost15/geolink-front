import React, { useEffect, useState } from 'react';
import {
    ChevronUpDownIcon,
    InformationCircleIcon,
    PaperAirplaneIcon,
} from '@heroicons/react/24/outline';
import {
    Card,
    CardBody,
    CardFooter,
    IconButton,
} from '@material-tailwind/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {List, Button, Input, Modal, Divider, Typography} from 'antd';
import POSReceipt from "./POSReceipt";
import {FaReceipt} from "react-icons/fa6";

const TABLE_HEAD = ['Хизматлар', 'Нархи', 'Количество', 'Умумий сумма'];

export default function SendAnalysis({ visitId, open }) {
    const [quantities, setQuantities] = useState({});
    const [services, setServices] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalAmount, setModalAmount] = useState(0);

    const [showReceipt, setShowReceipt] = useState(false);
    const [receiptData, setReceiptData] = useState(null);

    const axiosInstance = axios.create({
        baseURL: 'https://back.geolink.uz/api/v1',
    });


    const showModal = () => {
        setIsModalVisible(true);
    };

    const hideModal = () => {
        setIsModalVisible(false);
        setModalAmount(0);
    }

    const handleModalOk = () => {
        const dataToSend = {
            service: selectedServices.map((item) => item.id),
            service_count: selectedServices.map((item) => item.count),
            type: "cash",
            cash: 1,
            amount: modalAmount,
        };

        axiosInstance
            .post(`visit/service_mass/${visitId}`, dataToSend)
            .then((response) => {
                console.log(response.data);
                setReceiptData({
                    services: selectedServices,
                    amountPaid: modalAmount,
                    totalCost: calculateTotalServicesAmount(),
                    paymentMethod: "Нақд", // or retrieve it dynamically if needed
                });
                setShowReceipt(true);
                toast.success('Хизмат чеки кассага юборилди!');
            })
            .catch((error) => {
                toast.error('Хизмат ни танланг ва Навбатга кушилганини хам текширинг !');
                console.error('There was an error!', error);
            });
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        setShowReceipt(false); // Reset the receipt state when the modal is closed
        setSelectedServices([]); // Clear the selected services when closing the modal
        setModalAmount(0); // Reset the modal amount when closing
        setReceiptData(null); // Clear the receipt data when closing the modal
    };


    // Initialize axios interceptor for authorization
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

    useEffect(() => {
        fetchServices(currentPage);
    }, [open, currentPage]);

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

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const incrementQuantity = (service) => {
        setQuantities((prevQuantities) => ({
            ...prevQuantities,
            [service.id]: (prevQuantities[service.id] || 0) + 1,
        }));

        updateSelectedServices(service.id, 1);
    };

    const decrementQuantity = (service) => {
        setQuantities((prevQuantities) => {
            const newQuantity = Math.max((prevQuantities[service.id] || 0) - 1, 0);
            return {
                ...prevQuantities,
                [service.id]: newQuantity,
            };
        });

        updateSelectedServices(service.id, -1);
    };

    const updateSelectedServices = (serviceId, countChange) => {
        setSelectedServices((prevSelected) => {
            const existingServiceIndex = prevSelected.findIndex(item => item.id === serviceId);
            if (existingServiceIndex !== -1) {
                const updatedSelected = [...prevSelected];
                updatedSelected[existingServiceIndex].count += countChange;
                if (updatedSelected[existingServiceIndex].count <= 0) {
                    updatedSelected.splice(existingServiceIndex, 1);
                }
                return updatedSelected;
            } else {
                const serviceToAdd = services.find(service => service.id === serviceId);
                return [...prevSelected, { ...serviceToAdd, count: 1 }];
            }
        });
    };

    const calculateSum = (price, quantity) => {
        return price * quantity;
    };

    const calculateTotalSum = () => {
        return selectedServices.reduce((total, service) => {
            return total + calculateSum(service.price, service.count);
        }, 0);
    };

    const handleSubmitRegister = () => {
        // Filter services with non-zero counts
        const serviceCountArray = selectedServices
            .filter(service => service.count > 0)
            .map(service => ({
                id: service.id,
                count: service.count
            }));

        const dataToSend = {
            service: serviceCountArray.map(item => item.id),
            service_count: serviceCountArray.map(item => item.count),
            type: "cash",
            cash: 0,
            amount: 0
        };

        axiosInstance.post(`visit/service_mass/${visitId}`, dataToSend)
            .then(response => {
                console.log(response.data);
                setQuantities({});
                setSelectedServices([]);
                toast.success('Хизмат чеки кассага юборилди!');
            })
            .catch(error => {
                toast.error('Хизмат ни танланг ва Навбатга кушилганини хам текширинг !');
                console.error('There was an error!', error);
            });
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const filteredServices = services.filter(service =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const calculateTotalServicesAmount = () => {
        return selectedServices.reduce((total, service) => {
            return total + (service.price * service.count);
        }, 0);
    };

    const totalServicesAmount = calculateTotalServicesAmount();
    const remainingAmount = modalAmount - totalServicesAmount;

    const handleAmountChange = (e) => {
        const value = Number(e.target.value) || 0; // Handle invalid input gracefully
        setModalAmount(value);
    };

    const printReceipt = () => {
        window.print();
        handleModalCancel();
    };


    return (
        <>
            <Card className="h-full w-full rounded-none pt-5">
                <div className="flex mx-8 justify-between gap-8">
                    <Input.Search
                        placeholder="Хизмат номини йозинг"
                        allowClear
                        enterButton="Излаш"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        style={{ marginBottom: 2, width: 300 }}
                    />
                </div>
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
                        {filteredServices.map(({ id, name, price }) => {
                            const quantity = quantities[id] || 0;
                            return (
                                <tr key={id}>
                                    <td className="p-4 border-b border-blue-gray-50">
                                        <Typography variant="small" color="blue-gray" className="font-normal">
                                            {name}
                                        </Typography>
                                    </td>
                                    <td className="p-4 border-b border-blue-gray-50">
                                        <Typography variant="small" color="blue-gray" className="font-normal">
                                            {price} сум
                                        </Typography>
                                    </td>
                                    <td className="p-4 border-b border-blue-gray-50">
                                        <div className="flex items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() => decrementQuantity({ id, name, price })}
                                                className="bg-gray-100 border border-gray-300 p-2 focus:outline-none"
                                            >
                                                -
                                            </button>
                                            <Typography variant="small" color="blue-gray" className="font-normal">
                                                {quantity}
                                            </Typography>
                                            <button
                                                type="button"
                                                onClick={() => incrementQuantity({ id, name, price })}
                                                className="bg-gray-100 border border-gray-300 rounded-full p-2 focus:outline-none"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </td>
                                    <td className="p-4 border-b border-blue-gray-50">
                                        <Typography variant="small" color="blue-gray" className="font-normal">
                                            {calculateSum(price, quantity)} сум
                                        </Typography>
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
                <CardFooter className="flex items-center justify-between border-t
                 border-blue-gray-50 p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                        Сахифа {currentPage}/{totalPages}
                    </Typography>
                    <div className="flex gap-2">
                        <Button size="middle" className="flex items-center" icon={<FaReceipt className="text-lg" />} type="dashed" onClick={showModal}>
                           Тўлаш ва чекни чиқариш
                        </Button>
                        <Modal
                            title="Тўлов -> чекни қикариш"
                            centered
                            visible={isModalVisible}
                            onOk={showReceipt ? printReceipt : handleModalOk}
                            onCancel={handleModalCancel}
                            cancelText="Орқага"
                            okText={showReceipt ? "Чекни чиқариш" : "Тўлаш"}
                        >
                            {showReceipt ? (
                                <div
                                    className="max-w-sm mx-auto bg-white border border-gray-300 rounded-lg shadow-md p-6">
                                    {/* Header with Shop Logo and Name */}
                                    <div className="text-center mb-4">
                                        <img src="/logo.svg" alt="Shop Logo" className="h-10 mx-auto mb-2"/>
                                        <Typography.Title level={5} style={{fontWeight: 'bold'}} className="uppercase">Geolink
                                            Clinic</Typography.Title>
                                        <Typography.Text className="text-gray-500">ул. Мустақиллик, 123, г.
                                            Бухара</Typography.Text>
                                    </div>

                                    <Divider dashed className="border-gray-300"/>

                                    {/* Services or Products */}
                                    <div className="mb-3 text-gray-700">
                                        {receiptData.services.map(service => (
                                            <div key={service.id} className="flex justify-between">
                                                <span>{service.name} x {service.count}</span>
                                                <span>{service.price * service.count} сум</span>
                                            </div>
                                        ))}
                                    </div>

                                    <Divider dashed className="border-gray-300"/>

                                    {/* Summary */}
                                    <div className="mb-2 text-gray-700">
                                        <div className="flex justify-between">
                                            <Typography.Text strong>Жами қиймат:</Typography.Text>
                                            <Typography.Text>{receiptData.totalCost} сўм</Typography.Text>
                                        </div>
                                        <div className="flex justify-between">
                                            <Typography.Text strong>Тўланган:</Typography.Text>
                                            <Typography.Text>{receiptData.amountPaid} сўм</Typography.Text>
                                        </div>
                                    </div>

                                    <Divider dashed className="border-gray-300"/>

                                    {/* Payment Information */}
                                    <div className="mb-4 text-gray-700">
                                        <div className="flex justify-between">
                                            <Typography.Text>Тўлов усули:</Typography.Text>
                                            <Typography.Text>{receiptData.paymentMethod}</Typography.Text>
                                        </div>
                                    </div>

                                    <Divider dashed className="border-gray-300"/>
                                    <img src="/qr.svg" className="mx-auto mt-2" width="140" height="140" alt="QR Code"/>

                                    {/* Footer */}
                                    <div className="text-center">
                                        <Typography.Text className="text-gray-500">Харидингиз учун
                                            рахмат!</Typography.Text>
                                        <br/>
                                        <Typography.Text className="text-gray-500">Тел: +998 33 135 21
                                            01</Typography.Text>
                                        <br/>
                                        <Typography.Text className="text-gray-500">front.geolink.uz</Typography.Text>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div className="mb-4">
                                        <List
                                            size="small"
                                            locale={{emptyText: 'Хизматларни танланг'}}
                                            bordered
                                            dataSource={selectedServices}
                                            renderItem={(service) => (
                                                <List.Item>
                                                    <div>
                                                        <strong>{service.name} x{service.count}</strong> - {service.price} сум
                                                    </div>
                                                </List.Item>
                                            )}
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            size="large"
                                            type="number"
                                            placeholder="Жами"
                                            value={modalAmount}
                                            onChange={handleAmountChange}
                                        />
                                        <span>сўм</span>
                                    </div>
                                    <div style={{marginTop: 16}}>
                                        <strong>Хизматларнинг умумий қиймати: </strong>{totalServicesAmount} сум
                                    </div>
                                    <div style={{marginTop: 8}}>
                                        <strong>Қолган миқдори: </strong>{remainingAmount} сум
                                    </div>
                                </div>
                            )}
                        </Modal>
                        <Button type="primary" onClick={handleSubmitRegister} size="sm"
                                className="flex py-3 items-center gap-x-1">
                            <PaperAirplaneIcon className="w-4 h-4"/> Кассага юбориш
                        </Button>
                    </div>
                </CardFooter>
                <CardFooter className="flex items-center justify-center border-t border-blue-gray-50 p-4">
                    <div className="flex items-center gap-2">
                        {Array.from({length: totalPages}, (_, i) => i + 1).map((page) => (
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
                    </div>
                </CardFooter>
            </Card>
        </>
    );
}
