import React, { useState, useEffect } from 'react';
import { Table, Button, Input } from 'antd';
import axiosInstance from "../../axios/axiosInstance";
import toast from 'react-hot-toast';

const { Search } = Input;

const Admissions = () => {
    const [admissions, setAdmissions] = useState([]);
    const [filteredAdmissions, setFilteredAdmissions] = useState([]);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
    const [filters, setFilters] = useState({});
    const [sorter, setSorter] = useState({ field: 'id_visit', order: 'descend' });
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');

    const fetchAdmissions = async (page = 1, pageSize = 10, sortField = 'id_visit', sortOrder = 'descend') => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/visit?page=${page}&size=${pageSize}&status[0]=revisit`);
            console.log(response.data.data);

            const admissionsData = response.data.data.map((item, index) => {
                const serviceId = item.orders.find(order => order.service_type)?.service.id || 'Service ID Not Found';
                console.log(item); // Log each item to inspect its structure
                return {
                    key: index + 1,
                    id_visit: item.id,
                    patient_name: item.patient_id.name,
                    patient_id: item.patient_id.id,
                    doctor_name: item.doctor.name,
                    total_amount: item.total_amount,
                    total_payed: item.total_payed,
                    total_debit: item.total_debit,
                    date_at: item.date_at,
                    status: item.status,
                    service_id: serviceId

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

    const createVisit = async (record) => {
        console.log(record); // Ensure the record structure in the console

        try {
            const visitId = record.id_visit; // Access patient_id directly

            const response = await axiosInstance.put(`/visit/revisit/update/${visitId}`);

            toast.success(`Визит создан успешно для пациента ${record.patient_name}`);

            // Refresh the admissions list after creating the visit
            fetchAdmissions();
        } catch (error) {
            console.error('Ошибка при создании визита:', error);
            toast.error('Ошибка при создании визита');
        }
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
        },{
            title: 'Қайта қабул санаси',
            dataIndex: 'date_at',
            key: 'date_at',
            sorter: (a, b) => a.date_at.localeCompare(b.date_at),
            sortOrder: sorter.field === 'date_at' && sorter.order,
            width: '20%'
        },
        {
            title: 'Действия',
            key: 'actions',
            render: (_, record) => (
                <div>
                    <Button
                        type="primary"
                        onClick={() => createVisit(record)}
                    >
                        Создать визит
                    </Button>
                </div>
            ),
        },
    ];

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
                    style={{ width: 300, marginBottom: 16 }}
                />
            </div>
            <Table
                columns={columns}
                dataSource={filteredAdmissions}
                pagination={pagination}
                loading={loading}
                onChange={handleTableChange}
            />
        </div>
    );
};

export default Admissions;
