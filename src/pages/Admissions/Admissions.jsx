import { useState, useEffect } from 'react';
import { Table, Button, Modal, Typography, Input, Radio, Spin } from 'antd';

import axiosInstance from "../../axios/axiosInstance";
import toast from 'react-hot-toast';

const Admissions = () => {
    const [admissions, setAdmissions] = useState([]);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
    const [filters, setFilters] = useState({});
    const [sorter, setSorter] = useState({ field: 'id_visit', order: 'descend' });
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentType, setPaymentType] = useState('cash');
    const [loading, setLoading] = useState(false); // Добавляем состояние загрузки
    const [totalDebit, setTotalDebit] = useState(0);

    const fetchAdmissions = async (page = 1, pageSize = 10, sortField = 'id_visit', sortOrder = 'descend') => {
        setLoading(true); // Устанавливаем загрузку в true перед запросом
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
            setPagination({ ...pagination, current: page, pageSize, total });
        } catch (error) {
            console.error("Error fetching admissions:", error);
        } finally {
            setLoading(false); // После завершения запроса устанавливаем загрузку в false
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
        pending: 'В Ожидании оплаты',
        payed: 'Оплачено',
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
                fetchAdmissions();
                setIsModalVisible(false);
                setPaymentAmount(''); // Очищаем значение инпута суммы оплаты
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
        // {
        //     title: 'ID визита',
        //     dataIndex: 'id_visit',
        //     key: 'id_visit',
        //     sorter: (a, b) => a.id_visit - b.id_visit,
        //     sortOrder: sorter.field === 'id_visit' && sorter.order,
        //     defaultSortOrder: sorter.field === 'id_visit' ? sorter.order : 'descend',
        // },
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
            render: (text) => `${text} сўм` // Добавляем символ доллара к сумме
        },
        {
            title: 'Тўланган',
            dataIndex: 'total_payed',
            key: 'total_payed',
            sorter: (a, b) => a.total_payed - b.total_payed,
            sortOrder: sorter.field === 'total_payed' && sorter.order,
            render: (text) => `${text} сўм` // Добавляем символ доллара к сумме
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

    return (
        <div>
            <h1>Навбатда</h1>
            <Spin spinning={loading}>
            <Table
                columns={columns}
                dataSource={admissions}
                pagination={pagination}
                onChange={handleTableChange}
                rowKey="key"
                rowClassName={(record) => (record.status === 'queue' ? 'disabled-row' : '')}
            />
            </Spin>
             <Modal
                title="Тўлов малумоти"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={[
                    <Button key="back" onClick={() => setIsModalVisible(false)}>
                        Орқага
                    </Button>,
                    <Button key="submit" type="primary" onClick={handlePayment}>
                        Тўлаш
                    </Button>,
                ]}
            >
                {selectedOrder ? (
                    <div>
                        <Typography.Title level={4}>Тўлов квитанцияси</Typography.Title>
                        <p><strong>Хизмат:</strong> {selectedOrder.service.name}</p>
                        <p><strong>Миқдори:</strong> {selectedOrder.amount}</p>
                        <p><strong>Тўлов усули:</strong> {paymentTypeNames[selectedOrder.type]}</p>
                        <p><strong>Тўлов холати:</strong> {paymentBillNames[selectedOrder.bill]}</p>
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
                            <Radio value="credit">Қарз</Radio>
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

