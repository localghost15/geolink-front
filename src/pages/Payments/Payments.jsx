import React, { useEffect, useState } from 'react';
import {Table, Typography, Button, Input} from 'antd';
import axiosInstance from "../../axios/axiosInstance";
import {Card, CardBody, CardFooter} from "@material-tailwind/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const columns = [
    {
        title: 'Рақам',
        dataIndex: 'id',
        sorter: true,
        width: '10%',
    },
    {
        title: 'Хизмат Рақами',
        dataIndex: 'serviceId', // Новое поле, которое мы будем добавлять в dataSource
        width: '20%',
    },
    {
        title: 'Бемор',
        dataIndex: 'patientName', // Новое поле, которое мы будем добавлять в dataSource
        width: '20%',
    },
    {
        title: 'Тўлов Санаси',
        dataIndex: 'date_at',
        sorter: true,
        width: '10%',
    },
    {
        title: 'Умумий Миқдори',
        dataIndex: 'total_amount',
        render: (text) => `${text} сўм`,
        sorter: true,
        width: '20%',
    },
    {
        title: 'Тўлов холати',
        dataIndex: 'bill',
        filters: [
            {
                text: 'Тўлов амалга ошмаган',
                value: 'pending',
            },
            {
                text: 'Тўлов амалга оширилган',
                value: 'payed',
            },
        ],
        render: (text) => {
            switch (text) {
                case 'pending':
                    return 'Тўлов амалга ошмаган';
                case 'payed':
                    return 'Тўлов амалга оширилган';
                default:
                    return text;
            }
        },
        width: '20%',
    },
];

const billNames = {
    pending: "Тўлов кутилмоқда...",
    payed: "Тўланган",
}

const Payments = ({ patientId }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });

    useEffect(() => {
        fetchData();
    }, [tableParams.pagination.current, tableParams.pagination.pageSize, patientId]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/visit?page=${tableParams.pagination.current}`);
            const visits = response.data.data;
            // Фильтруем визиты, чтобы оставить только те, где есть услуги с service_type: true
            const filteredVisits = visits.filter(visit =>
                visit.orders.some(order => order.service_type === true)
            ).map(visit => ({
                ...visit,
                serviceId:   visit.orders.find(order => order.service_type === true)?.id.slice(-12),
                patientName: visit.patient_id.name,
            }));
            setData(filteredVisits.reverse());
            setTableParams({
                ...tableParams,
                pagination: {
                    ...tableParams.pagination,
                    total: response.data.meta.total,
                },
            });
        } catch (error) {
            console.error('Error fetching visits:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });
    };

    const transactionTypeLabels = {
        cash: 'Нақд пул',
        card: 'Пластик карта',
        bank: 'Банк ўтказмаси',
        online: 'Онлайн тўлов'
        // Добавьте другие типы транзакций, если они есть
    };

    return (
        <Card className="h-full w-full rounded-none pt-5">
            <div className="px-10">
                <h1 className="text-xl font-semibold text-black mb-3">Тўловлар Тарихи</h1>
                <Input.Search
                    placeholder="Излаш..."
                    allowClear
                    enterButton="Излаш"
                    style={{width: 300, marginBottom: 16}}
                />
            </div>

            <CardBody className="overflow-scroll px-0">
                <Table
                    columns={columns}
                    dataSource={data}
                    pagination={tableParams.pagination}
                    loading={loading}
                    onChange={handleTableChange}
                    expandable={{
                        expandedRowRender: (record) => (
                            <Table
                                columns={[
                                    {
                                        title: '№',
                                        dataIndex: 'index',
                                        key: 'index',
                                        render: (text, record, index) => index + 1
                                    },
                                    {title: 'Сервис номи', dataIndex: 'serviceName', key: 'serviceName'},
                                    {title: 'Сервис сони', dataIndex: 'serviceCount', key: 'serviceCount'},
                                    {title: 'Транзакция Миқдори', dataIndex: 'amount', key: 'amount'},
                                    {
                                        title: 'Транзакция Тури',
                                        dataIndex: 'type',
                                        key: 'type',
                                        render: (text) => transactionTypeLabels[text] || text
                                    },
                                    {
                                        title: 'Транзакция Санаси',
                                        dataIndex: 'created_at',
                                        key: 'created_at',
                                        render: (text) => new Date(text).toLocaleString()
                                    },
                                ]}
                                dataSource={record.orders.map(order => ({
                                    ...order,
                                    serviceName: order.service.name, // Добавляем поле для имени сервиса
                                    transactions: order.transactions.map(transaction => ({
                                        ...transaction,
                                        serviceName: order.service.name,
                                        serviceCount: order.count,
                                        amount: `${transaction.amount} сўм`,
                                    }))
                                })).flatMap(order => order.transactions)}
                                pagination={false}
                                rowKey="created_at"
                            />
                        ),
                        rowExpandable: (record) => {
                            return record.orders && record.orders.some(order => order.transactions && order.transactions.length > 0);
                        }

                    }}
                    rowKey={(record) => record.id}
                />
            </CardBody>

            <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                <Typography variant="small" color="blue-gray" className="font-normal">
                    Сахифа {tableParams.pagination.current}/{Math.ceil((tableParams.pagination.total || 0) / tableParams.pagination.pageSize)}
                </Typography>
                <div className="flex gap-2">
                    <Button variant="outlined" size="sm" onClick={() => setTableParams({
                        ...tableParams,
                        pagination: {...tableParams.pagination, current: tableParams.pagination.current - 1}
                    })}>
                        Олдинги
                    </Button>
                    <Button variant="outlined" size="sm" onClick={() => setTableParams({
                        ...tableParams,
                        pagination: {...tableParams.pagination, current: tableParams.pagination.current + 1}
                    })}>
                        Кейингиси
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
};

export default Payments;
