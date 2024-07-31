// StationaryTable.js
import React, { useEffect, useState } from 'react';
import {Table, Tag, Space, Button, Input} from 'antd';
import { getStationary} from "../services/stationaryService";
import StationaryFormModal from "../components/StationaryFormModal";
import {IoIosBed} from "react-icons/io";
import {FaClinicMedical} from "react-icons/fa";
import {BiDialpadAlt} from "react-icons/bi";

const StationaryTable = () => {
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentRecord, setCurrentRecord] = useState(null);

    const fetchStationary = async () => {
        try {
            const data = await getStationary();
            setDataSource(data.data); // предполагается, что data.data содержит массив stationary
        } catch (error) {
            setError('Ошибка при загрузке данных.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {


        fetchStationary();
    }, []);

    const handleEdit = (record) => {
        setCurrentRecord(record);
        setIsModalVisible(true);
    };

    const handleAdd = () => {
        setCurrentRecord(null);
        setIsModalVisible(true);
    };

    const handleModalSubmit = () => {
        setIsModalVisible(false);
        // Перезагрузите данные таблицы после сохранения
        fetchStationary();
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Бемор',
            dataIndex: ['user', 'name'],
            key: 'patient',
        },
        {
            title: 'Доктор',
            dataIndex: ['doctor', 'name'],
            key: 'doctor',
        },
        {
            title: 'Креват рақами',
            dataIndex: ['bed_id', 'number'],
            key: 'bedNumber',
        },
        {
            title: 'Нархи',
            dataIndex: ['bed_id', 'price'],
            key: 'price',
            render: (price) => `${price} сум`,
        },
        {
            title: 'Ҳолат',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'active' ? '#87d068' : 'red'}>
                    {status === 'active' ? 'Актив' : 'Нақил'}
                </Tag>
            ),
        },
        {
            title: 'Бошланиш санаси',
            dataIndex: 'start_at',
            key: 'startAt',
            render: (timestamp) => new Date(timestamp * 1000).toLocaleDateString('ru-RU'),
        },
        {
            title: 'Ҳаракатлар',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => handleEdit(record)}>Таҳрирлаш</Button>
                </Space>
            ),
        },
    ];

    if (loading) return <p>Юкланмоқда...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <div className="flex px-10  items-center justify-between">
                <div>
                    <div className="gap-5 flex  items-center">
                        <div className="p-3 bg-gray-100 rounded-md">
                            <FaClinicMedical color="#00AA81" size="30"/>
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold mb-2">Стационар</h1>
                            <div className="w-full flex items-center justify-between" style={{marginBottom: 16}}>
                                <Input
                                    prefix={<BiDialpadAlt size="20"/>}
                                    size="large"
                                    placeholder="Беморни Қидириш"
                                    className="ant-input rounded-md"
                                    style={{width: 300}}
                                />

                            </div>
                        </div>

                    </div>
                </div>

                <Button size="large" className="text-sm" type="primary" onClick={handleAdd} style={{marginBottom: 16}}>
                    Янгидан қўшиш
                </Button>
            </div>

            <Table
                dataSource={dataSource}
                columns={columns}
                rowKey="id"
                pagination={{pageSize: 10}}
            />
            <StationaryFormModal
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onSubmit={handleModalSubmit}
                initialData={currentRecord}
            />
        </div>
    );
};

export default StationaryTable;
