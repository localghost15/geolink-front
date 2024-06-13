import React, { useState, useEffect } from 'react';
import {Table, Button, Modal, Typography, Input, Radio, Spin, Divider} from 'antd';
import axiosInstance from "../../axios/axiosInstance";
import toast from 'react-hot-toast';
import {Card} from "@material-tailwind/react";

const { Search } = Input;

const Admissions = () => {
    const [admissions, setAdmissions] = useState([]);
    const [filteredAdmissions, setFilteredAdmissions] = useState([]); // Состояние для отфильтрованных данных
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
    const [filters, setFilters] = useState({});
    const [sorter, setSorter] = useState({ field: 'id_visit', order: 'descend' });
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentType, setPaymentType] = useState('cash');
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState(''); // Состояние для текста поиска
    const [paymentReceipt, setPaymentReceipt] = useState(null);

    const fetchAdmissions = async (page = 1, pageSize = 10, sortField = 'id_visit', sortOrder = 'descend') => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/visit?page=${page}&size=${pageSize}&status[0]=new`);
            const admissionsData = response.data.data.map((item, index) => ({
                key: index + 1,
                id_visit: item.id,
                patient_name: item.patient_id.name,
                doctor_name: item.doctor.name,
                total_amount: item.total_amount,
                total_payed: item.total_payed,
                total_debit: item.total_debit,
                date_at: item.date_at,
                status: item.status,
                orders: item.orders
            }));
            const total = response.data.meta.total;

            const sortedData = admissionsData.sort((a, b) => {
                if (sortField && sortOrder) {
                    const orderMultiplier = sortOrder === 'ascend' ? 1 : -1;
                    if (sortField === 'id_visit' || sortField === 'key') {
                        return (a[sortField] - b[sortField]) * orderMultiplier;
                    }
                    return a[sortField].localeCompare(b[sortField]) * orderMultiplier;
                }
                return 0;
            });

            setAdmissions(sortedData);
            setFilteredAdmissions(sortedData); // Устанавливаем изначально все данные
            setPagination({ ...pagination, current: page, pageSize, total });
        } catch (error) {
            console.error("Error fetching admissions:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmissions();
    }, []);

    const handleTableChange = (pagination, filters, sorter) => {
        fetchAdmissions(pagination.current, pagination.pageSize, sorter.field, sorter.order);
        setFilters(filters);
        setSorter(sorter);
    };

    const getStatusName = (status) => {
        const statusNames = {
            new: 'Янги',
            queue: 'Навбатда',
            pending: 'Ожидание',
            examined: 'Қабулда',
            completed: 'Завершён',
            canceled: 'Отменён',
        };
        return statusNames[status] || status;
    };

    const paymentTypeNames = {
        cash: 'Нақд',
        credit: 'Қарзга',
        card: 'Кредит карта'
    };

    const paymentBillNames = {
        pending: 'Тўлов кутилмоқда...',
        payed: 'Тўланган',
    };

    const handlePaymentClick = (record) => {
        if (record.orders) {
            setSelectedOrder(record.orders);
        } else {
            setSelectedOrder(null);
        }
        setIsModalVisible(true);
    };

    const handlePayment = () => {
        if (selectedOrder) {
            const orderId = selectedOrder.id;
            const paymentUrl = `/visit/pay/${orderId}`;
            axiosInstance.post(paymentUrl, {
                amount: paymentAmount,
                type: paymentType
            })
                .then(response => {
                    console.log('Оплата выполнена успешно:', response.data);

                    setPaymentReceipt({
                        service: selectedOrder.service.name,
                        amount: paymentAmount,
                        payed: paymentAmount, // Пока используем сумму оплаты как сумму туланганного
                        type: paymentType,
                        bill: 'payed' // Пока устанавливаем статус оплачено
                    });


                    fetchAdmissions();
                    setPaymentAmount('');
                    setPaymentType('cash');
                    toast.success(`Оплачен: ${orderId}`);
                })
                .catch(error => {
                    console.error('Ошибка при выполнении оплаты:', error);
                });
        } else {
            console.error('Выбранный заказ отсутствует для оплаты');
        }
    };


    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedOrder(null);
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'key',
            key: 'id',
            sorter: (a, b) => a.key - b.key,
            sortOrder: sorter.field === 'key' && sorter.order,
        },
        {
            title: 'Беморнинг ФИО',
            dataIndex: 'patient_name',
            key: 'patient_name',
            sorter: (a, b) => a.patient_name.localeCompare(b.patient_name),
            sortOrder: sorter.field === 'patient_name' && sorter.order,
        },
        {
            title: 'Доктор',
            dataIndex: 'doctor_name',
            key: 'doctor_name',
            sorter: (a, b) => a.doctor_name.localeCompare(b.doctor_name),
            sortOrder: sorter.field === 'doctor_name' && sorter.order,
        },
        {
            title: 'Миқдори',
            dataIndex: 'total_amount',
            key: 'total_amount',
            sorter: (a, b) => a.total_amount - b.total_amount,
            sortOrder: sorter.field === 'total_amount' && sorter.order,
            render: (text) => `${text} сўм`
        },
        {
            title: 'Тўланган',
            dataIndex: 'total_payed',
            key: 'total_payed',
            sorter: (a, b) => a.total_payed - b.total_payed,
            sortOrder: sorter.field === 'total_payed' && sorter.order,
            render: (text) => `${text} сўм`
        },
        {
            title: 'Статус',
            dataIndex: 'status',
            key: 'status',
            sorter: (a, b) => a.status.localeCompare(b.status),
            sortOrder: sorter.field === 'status' && sorter.order,
            render: (text) => getStatusName(text),
        },
        {
            title: 'Оплата',
            key: 'payment',
            render: (_, record) => (
                <Button
                    type="primary"
                    onClick={() => handlePaymentClick(record)}
                    disabled={record.status === 'queue'}
                >
                    Оплатить
                </Button>
            ),
        },
    ];

    // Обработчик изменения текста поиска
    const handleSearch = (value) => {
        setSearchText(value);
        if (value) {
            const filteredData = admissions.filter((admission) =>
                admission.patient_name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredAdmissions(filteredData);
        } else {
            setFilteredAdmissions(admissions);
        }
    };

    const { Title, Text } = Typography;
    return (
        <div>
            <div className="px-10">
                <h1 className="text-xl font-semibold mb-3">Навбатда</h1>
                <Input.Search
                    placeholder="Поиск по имени пациента"
                    value={searchText}
                    allowClear
                    enterButton="Излаш"
                    onChange={(e) => handleSearch(e.target.value)}
                    style={{marginBottom: 16, width: 300}}
                />
            </div>
            <Spin spinning={loading}>
                <Table
                    columns={columns}
                    dataSource={filteredAdmissions}
                    pagination={pagination}
                    onChange={handleTableChange}
                    rowKey="key"
                    rowClassName={(record) => (record.status === 'queue' ? 'disabled-row' : '')}
                />
            </Spin>
            <Modal centered
                title="Тўлов малумоти -> Чек чикариш"
                visible={isModalVisible}
                onCancel={handleModalClose}
                footer={[
                    <Button key="back" onClick={handleModalClose}>
                        Орқага
                    </Button>,
                    paymentReceipt ? (
                        <Button key="print" type="primary" onClick={() => window.print()}>
                            Чекни чиқариш
                        </Button>
                    ) : (
                        <Button key="submit" type="primary" onClick={handlePayment}>
                            Тўлаш
                        </Button>
                    )
                ]}
            >
                {paymentReceipt ? ( // Проверяем, есть ли информация о чеке
                    <div>
                        <div className="max-w-sm mx-auto bg-white border border-gray-300 rounded-lg shadow-md p-6">
                            {/* Header with Shop Logo and Name */}
                            <div className="text-center mb-4">
                                <img src="/logo.svg" alt="Shop Logo" className="h-10 mx-auto mb-2"/>
                                <Title level={5} style={{fontWeight: 'bold'}} className="uppercase">Geolink Clinic</Title>
                                <Text className="text-gray-500">ул. Мустақиллик, 123, г. Бухара</Text>
                                <br/>
                            </div>


                            <Divider dashed className="border-gray-300"/>

                            {/* Services or Products */}
                            <div className="mb-3 text-gray-700">
                                {selectedOrder && selectedOrder.service.name}
                            </div>
                            <hr/>
                            {/* Summary */}
                            <div className="mb-2 text-gray-700">
                                <div className="flex justify-between">
                                    <Text strong>Миқдори:</Text>
                                    <Text>{paymentReceipt.amount} сўм</Text>
                                </div>
                                <div className="flex justify-between">
                                    <Text strong>Тўланган:</Text>
                                    <Text>{selectedOrder?.payed || 0} сўм</Text>
                                </div>
                            </div>

                            <Divider dashed className="border-gray-300"/>

                            {/* Payment Information */}
                            <div className="mb-4 text-gray-700">
                                <div className="flex justify-between">
                                    <Text>Тўлов усули:</Text>
                                    <Text>{paymentTypeNames[paymentReceipt.type]}</Text>
                                </div>
                                <div className="flex justify-between">
                                    <Text>Тўлов холати:</Text>
                                    <Text>{paymentBillNames[paymentReceipt.bill]}</Text>
                                </div>
                            </div>

                            <Divider dashed className="border-gray-300"/>
                            <img src="/qr.svg" className="mx-auto mt-2" width="140" height="140"/>
                            {/* Footer */}
                            <div className="text-center">
                                <Text className="text-gray-500">Харидингиз учун рахмат!</Text>
                                <br/>
                                <Text className="text-gray-500">Тел: +998 33 135 21 01</Text>
                                <br/>
                                <Text className="text-gray-500">front.geolink.uz</Text>
                            </div>
                        </div>


                    </div>
                ) : selectedOrder ? (
                    <div>
                        <Typography.Title level={4}>Тўлов квитанцияси</Typography.Title>
                        <p><strong>Хизмат:</strong> {selectedOrder.service.name}</p>
                        <p><strong>Миқдори:</strong> {selectedOrder.amount}</p>
                        <p><strong>Туланган:</strong> {selectedOrder.payed}</p>
                        <p><strong>Тўлов усули:</strong> {paymentTypeNames[selectedOrder.type]}</p>
                        <p><strong>Тўлов холати:</strong> {paymentBillNames[selectedOrder.bill]}</p>
                        <Input
                            className='mb-5'
                            type="number"
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(e.target.value)}
                            placeholder="Сумма оплаты"
                            style={{marginTop: 10}}
                        />
                        <Radio.Group onChange={(e) => setPaymentType(e.target.value)} value={paymentType}>
                            <Radio value="cash">Нақд</Radio>
                            {/*<Radio value="credit">Қарз</Radio>*/}
                            <Radio value="card">Кредит карта</Radio>
                        </Radio.Group>
                    </div>
                ) : (
                    <p>Нет данных о заказе.</p>
                )}
            </Modal>
        </div>
    );
};

export default Admissions;
