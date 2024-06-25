import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Typography, Input, Radio, Spin, Divider } from 'antd';
import axiosInstance from "../../axios/axiosInstance";
import toast from 'react-hot-toast';

const NewAdmissions = () => {
    const [admissions, setAdmissions] = useState([]);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
    const [sorter, setSorter] = useState({ field: 'id_visit', order: 'descend' });
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedVisit, setSelectedVisit] = useState(null);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentType, setPaymentType] = useState('cash');
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [paymentReceipt, setPaymentReceipt] = useState(null);

    const fetchAdmissions = async (page = 1, pageSize = 10, sortField = 'id_visit', sortOrder = 'descend') => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/visit?page=${page}&size=${pageSize}&status[0]=examined&status[1]=new`);
            const admissionsData = response.data.data
                .filter(admission => admission.bill === 'payed' || admission.bill === 'pending')
                .map((item, index) => ({
                    key: index + 1,
                    id_visit: item.id,
                    patient_name: item.patient_id.name,
                    doctor_name: item.doctor.name,
                    total_amount: item.total_amount,
                    children_debit: item.children_debit,
                    children_amount: item.children_amount,
                    children_payed: item.children_payed,
                    total_payed: item.total_payed,
                    date_at: item.date_at,
                    status: item.status,
                    bill: item.bill,
                    debit: item.debit,
                    chilrens: item.chilrens,
                    orders: item.orders
                })).filter(admission => admission.debit !== 0);


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
        setSorter(sorter);
    };

    const filteredData = admissions.filter(admission =>
        admission.patient_name && admission.patient_name.toLowerCase().includes(searchText.toLowerCase())
    );

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
        pending: 'Тўлов кутилмоқда',
        payed: 'Тўланган',
    };

    const handlePaymentClick = (record) => {
        setSelectedVisit(record);
        console.log(record)
        setIsModalVisible(true);
    };

    const payForServices = async (orderId, amount, paymentType) => {
        try {
            const response = await axiosInstance.post(`/visit/pay/${orderId}`, {
                amount: parseInt(amount),
                type: paymentType
            });
            return response.data;
        } catch (error) {
            console.error("Ошибка при оплате сервисов:", error);
            throw error;
        }
    };

    const handlePayment = () => {
        if (selectedVisit) {
            const firstOrder = selectedVisit.orders[0];
            if (!firstOrder) {
                console.error('Нет доступного ID ордера для оплаты');
                return;
            }

            const orderId = firstOrder.id;
            const amount = paymentAmount;
            payForServices(orderId, amount, paymentType)
                .then(response => {
                    console.log('Оплата выполнена успешно:', response);
                    fetchAdmissions();
                    setPaymentReceipt(response.data);
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
        setSelectedVisit(null);
        setPaymentReceipt(null);
    };

    const handleSearch = (value) => {
        setSearchText(value);
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
            title: 'ID визита',
            dataIndex: 'id_visit',
            key: 'id_visit',
            sorter: (a, b) => a.id_visit - b.id_visit,
            sortOrder: sorter.field === 'id_visit' && sorter.order,
            defaultSortOrder: sorter.field === 'id_visit' ? sorter.order : 'descend',
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
            key: 'children_amount',
            sorter: (a, b) => a.children_amount - b.children_amount,
            sortOrder: sorter.field === 'children_amount' && sorter.order,
            render: (text) => `${text} сўм`
        },
        {
            title: 'Тўланган',
            dataIndex: 'total_payed',
            key: 'children_payed',
            sorter: (a, b) => a.children_payed - b.children_payed,
            sortOrder: sorter.field === 'children_payed' && sorter.order,
            render: (text) => `${text} сўм`
        },
        {
            title: 'Қолган сумма',
            dataIndex: 'debit',
            key: 'debit',
            sorter: (a, b) => a.debit - b.debit,
            sortOrder: sorter.field === 'debit' && sorter.order,
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
                    disabled={typeof record.debit === 'number' && record.debit === 0 ? 'disabled-row' : ''}
                >
                    Оплатить
                </Button>
            ),
        },
    ];



    return (
        <div>
            <div className="px-10">
                <h1 className="text-xl font-semibold mb-3">Қарздорлар рўхати</h1>
                <Input.Search
                    placeholder="ФИОни киритинг"
                    allowClear
                    enterButton="Излаш"
                    onSearch={handleSearch}
                    onChange={(e) => handleSearch(e.target.value)}
                    style={{ width: 300, marginBottom: 16 }}
                />
            </div>
            <Spin spinning={loading}>
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    pagination={pagination}
                    onChange={handleTableChange}
                    rowKey="key"
                    rowClassName={(record) => (typeof record.debit === 'number' && record.debit === 0 ? 'disabled-row' : '')}
                />
            </Spin>
            <Modal
                centered
                title={paymentReceipt ? "Чек чикариш" : "Тўлов малумоти"}
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
                {paymentReceipt ? (
                    <div className="max-w-sm mx-auto bg-white border border-gray-300 rounded-lg shadow-md p-6">
                        {/* Header with Shop Logo and Name */}
                        <div className="text-center mb-4">
                            <img src="/logo.svg" alt="Shop Logo" className="h-10 mx-auto mb-2"/>
                            <Typography.Title level={5} style={{fontWeight: 'bold'}} className="uppercase">Geolink Clinic</Typography.Title>
                            <Typography.Text className="text-gray-500">ул. Мустақиллик, 123, г. Бухара</Typography.Text>
                        </div>

                        <Divider dashed className="border-gray-300"/>

                        {/* Services or Products */}
                        <div className="mb-3 text-gray-700">
                            {selectedVisit && selectedVisit.orders && selectedVisit.orders.service && (
                                selectedVisit.orders.service.name
                            )}
                        </div>

                        <hr/>

                        {/* Summary */}
                        <div className="mb-2 text-gray-700">
                            <div className="flex justify-between">
                                <Typography.Text strong>Миқдори:</Typography.Text>
                                <Typography.Text>{paymentReceipt.total_amount} сўм</Typography.Text>
                            </div>
                            <div className="flex justify-between">
                                <Typography.Text strong>Тўланган:</Typography.Text>
                                <Typography.Text>{selectedVisit.total_payed} сўм</Typography.Text>
                            </div>
                            <div className="flex justify-between">
                                <Typography.Text strong>Қолган сумма:</Typography.Text>
                                <Typography.Text>{selectedVisit.debit} сўм</Typography.Text>
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
                ) : selectedVisit ? (
                    <div>
                        <Typography.Title level={4}>Тўлов квитанцияси</Typography.Title>
                        <p><strong>Асосий Хизмат:</strong> {selectedVisit.orders[0]?.service?.name}</p>
                        <p><strong>Хизматлар:</strong>
                            {selectedVisit && selectedVisit.orders && selectedVisit.orders.length > 0 ? (
                                selectedVisit.orders.map((order, index) => (
                                    <span key={order.id}>
                                        {index > 0 && ', '}
                                        {order.service.name} x{order.count}
                                    </span>
                                ))
                            ) : (
                                'Нет данных о хизматларе'
                            )}
                        </p>
                        <p><strong>Миқдори:</strong> {selectedVisit.total_amount} сўм</p>
                        <p><strong>Тўланган:</strong> {selectedVisit.total_payed} сўм</p>
                        <Input
                            className='mb-5'
                            type="number"
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(e.target.value)}
                            placeholder="Сумма оплаты"
                            style={{ marginTop: 10 }}
                        />
                        <Radio.Group onChange={(e) => setPaymentType(e.target.value)} value={paymentType}>
                            <Radio value="cash">Нақд</Radio>
                            {/* <Radio value="credit">Қарз</Radio> */}
                            <Radio value="card">Кредит карта</Radio>
                        </Radio.Group>
                        <Divider/>
                        <p><strong>Тўлов суммаси:</strong> {selectedVisit.debit} сўм</p>
                    </div>
                ) : (
                    <p>Нет данных о заказе.</p>
                )}
            </Modal>
        </div>
    );
};

export default NewAdmissions;
