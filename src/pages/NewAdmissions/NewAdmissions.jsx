import { useState, useEffect } from 'react';
import { Table, Button, Modal, Typography, Input, Radio, Spin } from 'antd';
import axiosInstance from "../../axios/axiosInstance";
import toast from 'react-hot-toast';

const NewAdmissions = () => {
    const [admissions, setAdmissions] = useState([]);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
    const [filters, setFilters] = useState({});
    const [sorter, setSorter] = useState({ field: 'id_visit', order: 'descend' });
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedVisit, setSelectedVisit] = useState(null);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentType, setPaymentType] = useState('cash');
    const [loading, setLoading] = useState(false);
    const [totalDebit, setTotalDebit] = useState(0);

    // Функция для получения визитов с фильтром по статусу оплаты "pending"
    const fetchAdmissions = async (page = 1, pageSize = 10, sortField = 'id_visit', sortOrder = 'descend') => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/visit?page=${page}&size=${pageSize}&status[0]=examined`);
            const admissionsData = response.data.data
                .filter(admission => admission.bill === 'payed' || admission.bill === 'pending') // Фильтрация по статусу оплаты
                .map((item, index) => ({
                    key: index + 1,
                    id_visit: item.id,
                    patient_name: item.patient_id.name,
                    doctor_name: item.doctor.name,
                    total_amount: item.total_amount,
                    total_payed: item.total_payed,
                    total_debit: item.total_debit,
                    date_at: item.date_at,
                    status: item.status,
                    bill: item.bill,
                    chilrens: item.chilrens,
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
        pending: 'Тўлов кутилмоқда',
        payed: 'Тўланган',
    };

    const handlePaymentClick = (record) => {
        setSelectedVisit(record);
        setIsModalVisible(true);
    };

    const payForServices = async (orderId, amount, paymentType) => {
        try {
            const response = await axiosInstance.post(`/visit/pay/${orderId}`, {
                amount: parseInt(amount),
                type: paymentType,
                mass: 1
            });
            return response.data;
        } catch (error) {
            console.error("Ошибка при оплате сервисов:", error);
            throw error;
        }
    };



    const handlePayment = () => {
        if (selectedVisit) {
            const orderId = selectedVisit.orders?.id;
            if (!orderId) {
                console.error('Нет доступного ID ордера для оплаты');
                return;
            }

            const amount = paymentAmount;

            payForServices(orderId, amount, paymentType)
                .then(response => {
                    console.log('Оплата выполнена успешно:', response);
                    fetchAdmissions();
                    setIsModalVisible(false);
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
            title: 'Қолган сумма',
            dataIndex: 'total_debit',
            key: 'total_debit',
            sorter: (a, b) => a.total_debit - b.total_debit,
            sortOrder: sorter.field === 'total_debit' && sorter.order,
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
                    disabled={typeof record.total_debit === 'number' && record.total_debit === 0 ? 'disabled-row' : ''}
                >
                    Оплатить
                </Button>
            ),
        },
    ];

    return (
        <div>
            <h1>Қайта навбатлар</h1>
            <Spin spinning={loading}>
                <Table
                    columns={columns}
                    dataSource={admissions}
                    pagination={pagination}
                    onChange={handleTableChange}
                    rowKey="key"
                    rowClassName={(record) => (typeof record.total_debit === 'number' && record.total_debit === 0 ? 'disabled-row' : '')}
                />
            </Spin>
            <Modal
                title="Тўлов малумоти"
                visible={isModalVisible}
                onCancel={handleModalClose}
                footer={[
                    <Button key="back" onClick={handleModalClose}>
                        Орқага
                    </Button>,
                    <Button key="submit" type="primary" onClick={handlePayment}>
                        Тўлаш
                    </Button>,
                ]}
            >
                {selectedVisit && (
                    <div>
                        <p><strong>Тўлов холати:</strong> {paymentBillNames[selectedVisit.bill]}</p>
                        <p><strong>Сана:</strong> {selectedVisit.date_at}</p>
                        <p><strong>Миқдори:</strong> {selectedVisit.total_amount} сўм</p>
                        <p><strong>Тўланган:</strong> {selectedVisit.total_payed} сўм</p>
                        <p><strong>Қолган:</strong> {selectedVisit.total_debit} сўм</p>

                        <p><strong>Хизматлар:</strong> 
                            {Object.entries(
                                selectedVisit.chilrens
                                    .map(child => child.orders?.service?.name)
                                    .filter(name => name)
                                    .reduce((acc, serviceName) => {
                                        acc[serviceName] = (acc[serviceName] || 0) + 1;
                                        return acc;
                                    }, {})
                            )
                            .map(([serviceName, count]) => `${serviceName} x${count}`)
                            .join(', ')}
                        </p>

                        <Input
                            className='mb-5'
                            type="number"
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(e.target.value)}
                            placeholder="Тўлов миқдори"
                            style={{ marginTop: 10 }}
                        />
                        <Radio.Group onChange={(e) => setPaymentType(e.target.value)} value={paymentType}>
                            <Radio value="cash">Нақд</Radio>
                            <Radio value="credit">Қарз</Radio>
                            <Radio value="card">Кредит карта</Radio>
                        </Radio.Group>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default NewAdmissions;
