import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Typography, Input, Radio, Spin, Divider } from 'antd';
import axiosInstance from "../../axios/axiosInstance";
import toast from 'react-hot-toast';
import {PrinterIcon} from "@heroicons/react/24/solid";

const { Search } = Input;

const Admissions = () => {
    const [admissions, setAdmissions] = useState([]);
    const [filteredAdmissions, setFilteredAdmissions] = useState([]);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
    const [filters, setFilters] = useState({});
    const [sorter, setSorter] = useState({ field: 'id_visit', order: 'descend' });
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentType, setPaymentType] = useState('cash');
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [paymentReceipt, setPaymentReceipt] = useState(null);
    const [selectedVisit, setSelectedVisit] = useState(null); // Добавлено для отслеживания выбранного визита

    const fetchAdmissions = async (page = 1, pageSize = 10, sortField = 'id_visit', sortOrder = 'descend') => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/visit?page=${page}&size=${pageSize}&status[0]=revisit`);
            const admissionsData = response.data.data.map((item, index) => {
                const filteredOrders = item.orders.filter(order => order.service_type && parseFloat(order.payed) === 0);
                return {
                    key: index + 1,
                    id_visit: item.id,
                    patient_name: item.patient_id.name,
                    doctor_name: item.doctor.name,
                    total_amount: item.total_amount,
                    total_payed: item.total_payed,
                    total_debit: item.total_debit,
                    date_at: item.date_at,
                    status: item.status,
                    orders: filteredOrders,
                    children_amount: item.children_amount, // Добавляем необходимые поля
                    children_payed: item.children_payed,
                    children_debit: item.children_debit,
                    debit: item.debit
                };
            });
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
            setFilteredAdmissions(sortedData);
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
            revisit: 'Қабулда',
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
        if (record.orders && record.orders.length > 0) {
            setSelectedOrder(record.orders[0]);
        } else {
            setSelectedOrder(null);
        }
        setSelectedVisit(record); // Устанавливаем выбранный визит
        setIsModalVisible(true);

    };

    const handlePayment = async () => {
        if (selectedOrder) {
            const orderId = selectedOrder.id;
            const paymentUrl = `/visit/pay/${orderId}`;
            try {
                const response = await axiosInstance.post(paymentUrl, {
                    amount: paymentAmount,
                    type: paymentType
                });
                console.log('Оплата выполнена успешно:', response.data);
                const remainingAmount = parseFloat(selectedOrder.total_amount) - parseFloat(paymentAmount); // Исправлено на selectedOrder.total_amount
                // Вычисляем оставшуюся сумму дебита
                const remainingDebit = parseFloat(selectedOrder.debit) - parseFloat(paymentAmount);
                setPaymentReceipt({
                    service: selectedOrder.service.name,
                    amount: paymentAmount,
                    total_amount: selectedOrder.total_amount, // Выводим total_amount из selectedOrder
                    remaining: remainingDebit,
                    type: paymentType,
                    bill: 'payed'
                });

                fetchAdmissions();
                setPaymentAmount('');
                setPaymentType('cash');
                toast.success(`Оплата выполнена: ${orderId}`);
            } catch (error) {
                console.error('Ошибка при выполнении оплаты:', error);
                toast.error('Ошибка при выполнении оплаты');
            }
        } else {
            console.error('Выбранный заказ отсутствует для оплаты');
        }
    };


    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedOrder(null);
        setPaymentReceipt(null);
        setSelectedVisit(null); // Очищаем выбранный визит
    };

    const isPaymentButtonDisabled = (record) => {
        return record.orders.some(order => parseFloat(order.payed) > 0);
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
                    disabled={typeof record.total_payed === 'number' && record.total_payed > 0 ? 'disabled-row' : ''}
                >
                    Оплатить
                </Button>
            ),
        },
    ];

    const getRowClassName = (record) => {
        if (record.orders.some(order => parseFloat(order.payed) > 0)) {
            return 'disabled-row';
        }
        return '';
    };

    const handleSearch = (value) => {
        setSearchText(value);
        if (value) {
            const filteredData = admissions.filter((admission) =>
                admission.patient_name.toLowerCase().includes(value.toLowerCase()) ||
                admission.doctor_name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredAdmissions(filteredData);
        } else {
            setFilteredAdmissions(admissions);
        }
    };

    return (
        <div>
            <div className="px-10">
                <h1 className="text-xl font-semibold mb-3">Қайта Қабуллар</h1>
                <Input.Search
                    placeholder="Излаш..."
                    allowClear
                    enterButton="Излаш"
                    onSearch={handleSearch}
                    onChange={(e) => handleSearch(e.target.value)}
                    style={{width: 300, marginBottom: 16}}
                />
            </div>
            <Table
                columns={columns}
                dataSource={filteredAdmissions}
                pagination={pagination}
                loading={loading}
                onChange={handleTableChange}
                rowClassName={getRowClassName}
            />
            <Modal centered
                title="Тўлов -> чекни чиқариш"
                visible={isModalVisible}
                onCancel={handleModalClose}
                footer={[
                    <Button key="cancel" onClick={handleModalClose}>
                        Отмена
                    </Button>,
                    paymentReceipt && (
                        <Button icon={<PrinterIcon className="w-4 h-4 inline-flex items-center"/>} key="print"
                                type="primary" onClick={() => window.print()}>
                            Чекни чиқариш
                        </Button>
                    ),
                    paymentReceipt ? null : (
                        <Button key="submit" type="primary" onClick={handlePayment}>
                            Оплатить
                        </Button>
                    ),
                ]}
            >
                {paymentReceipt ? (
                    <div>
                        <div className="max-w-sm mx-auto bg-white border border-gray-300 rounded-lg shadow-md p-6">
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
                                {paymentReceipt.service}
                            </div>

                            <hr/>

                            {/* Summary */}
                            <div className="mb-2 text-gray-700">
                                <div className="flex justify-between">
                                    <Typography.Text strong>Миқдори:</Typography.Text>
                                    <Typography.Text>{selectedOrder.amount} сўм</Typography.Text>
                                </div>
                                <div className="flex justify-between">
                                    <Typography.Text strong>Тўланган:</Typography.Text>
                                    <Typography.Text>{paymentReceipt.amount} сўм</Typography.Text>
                                </div>
                                <div className="flex justify-between">
                                    <Typography.Text strong>Қолган сумма:</Typography.Text>
                                    <Typography.Text>{parseFloat(selectedOrder.amount) - parseFloat(paymentReceipt.amount)} сўм</Typography.Text>
                                </div>
                            </div>

                            <Divider dashed className="border-gray-300"/>

                            {/* Payment Information */}
                            <div className="mb-4 text-gray-700">
                                <div className="flex justify-between">
                                    <Typography.Text>Тўлов усули:</Typography.Text>
                                    <Typography.Text>{paymentTypeNames[paymentReceipt.type]}</Typography.Text>
                                </div>
                                <div className="flex justify-between">
                                    <Typography.Text>Тўлов холати:</Typography.Text>
                                    <Typography.Text>{paymentBillNames[paymentReceipt.bill]}</Typography.Text>
                                </div>
                            </div>

                            <Divider dashed className="border-gray-300"/>
                            <img src="/qr.svg" className="mx-auto mt-2" width="140" height="140"/>

                            {/* Footer */}
                            <div className="text-center">
                                <Typography.Text className="text-gray-500">Харидингиз учун рахмат!</Typography.Text>
                                <br/>
                                <Typography.Text className="text-gray-500">Тел: +998 33 135 21 01</Typography.Text>
                                <br/>
                                <Typography.Text className="text-gray-500">front.geolink.uz</Typography.Text>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>
                        {selectedOrder ? (
                            <div>
                                <Typography.Title level={5}>Выбранный заказ</Typography.Title>
                                <p>Услуга: {selectedOrder.service.name}</p>
                                <p>Сумма: {selectedOrder.amount} сўм</p>
                                <Input
                                    type="number"
                                    placeholder="Введите сумму оплаты"
                                    value={paymentAmount}
                                    onChange={(e) => setPaymentAmount(e.target.value)}
                                />
                                <Radio.Group
                                    value={paymentType}
                                    onChange={(e) => setPaymentType(e.target.value)}
                                    style={{marginTop: 10}}
                                >
                                    <Radio.Button value="cash">Нақд</Radio.Button>
                                    <Radio.Button value="card">Кредит карта</Radio.Button>
                                </Radio.Group>
                            </div>
                        ) : (
                            <p>Нет доступных заказов для оплаты</p>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Admissions;
