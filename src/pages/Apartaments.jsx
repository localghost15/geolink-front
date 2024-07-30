import React, { useEffect, useState } from 'react';
import { Button, Input, Popconfirm, Table, Tag, Tooltip, Modal, Form, Select } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, QuestionCircleOutlined, PlusOutlined, DeleteOutlined, InfoCircleOutlined  } from '@ant-design/icons';
import { getApartments, createApartment, deleteApartment  } from '../services/apartmentService';
import { FaStreetView, FaUserEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { IoIosBed } from "react-icons/io";
import {PencilIcon} from "@heroicons/react/24/solid";

const { Option } = Select;

const Apartaments = () => {
    const [apartments, setApartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchApartments = async () => {
            try {
                const data = await getApartments();
                setApartments(data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchApartments();
    }, []);

    const typeMapping = {
        standard: 'Стандарт',
        semi: 'Семий',
        lux: 'Люкс',
    };

    const handleDelete = async (id) => {
        try {
            await deleteApartment(id);
            const data = await getApartments();
            setApartments(data);
        } catch (error) {
            console.error('Error deleting apartment:', error);
        }
    };


    const handleCreate = async (values) => {
        try {
            const formData = new FormData();
            formData.append('number', values.number);
            formData.append('floor', values.floor);
            formData.append('beds', values.beds);
            formData.append('type', values.type);
            formData.append('active', values.active);
            values.bedsList.forEach((bed, index) => {
                formData.append(`list_beds[${index}][number]`, bed.number);
                formData.append(`list_beds[${index}][active]`, bed.active);
                formData.append(`list_beds[${index}][price]`, bed.price);
                formData.append(`list_beds[${index}][remark]`, bed.remark);
            });
            await createApartment(formData);
            setIsModalVisible(false);
            form.resetFields();
            // Refresh apartment list after creating
            const data = await getApartments();
            setApartments(data);
        } catch (error) {
            console.error('Error creating apartment:', error);
        }
    };

    const columns = [
        {
            title: 'Квартира рақами',
            dataIndex: 'number',
            key: 'number',
        },
        {
            title: 'Қават',
            dataIndex: 'floor',
            key: 'floor',
        },
        {
            title: 'Тури',
            dataIndex: 'type',
            key: 'type',
            render: (type) => typeMapping[type] || type,
        },
        {
            title: 'Фаол',
            dataIndex: 'active',
            key: 'active',
            render: (text) => (text ? 'Ҳа' : 'Йўқ'),
        },
        {
            title: 'Ётоқ сони',
            dataIndex: 'beds_count',
            key: 'beds_count',
        },
        {
            title: "Харакат",
            key: "action",
            render: (text, record) => (
                <span className="flex items-center gap-1">
                    <Tooltip title="Ўзгартириш">
                        <Button size="large" type="primary" icon={<PencilIcon className="h-5 w-5" />} />
                    </Tooltip>
                     <Popconfirm
                         title="Ёзувни ўчириш"
                         icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                         okText="Ўчириш"
                         cancelText="Бекор қилиш"
                         onConfirm={() => handleDelete(record.id)}
                     >
                        <Button size="large" type="primary" icon={<MdDelete size="25" />} />
                    </Popconfirm>
                </span>
            ),
        },
    ];

    const expandedRowRender = (record) => {
        const bedColumns = [
            {
                title: 'Ётоқ рақами',
                dataIndex: 'number',
                key: 'number',
            },
            {
                title: 'Нарх',
                dataIndex: 'price',
                key: 'price',
                render: (price) => (<span>{price} сўм</span>)
            },
            {
                title: 'Ҳолат',
                dataIndex: 'status',
                key: 'status',
                render: (status) => (
                    <Tag className={`border-none max-w-min px-4 ${status === 'free' ? 'tag-free' : 'tag-busy'}`}>
                        <span className="tag-icon">
                            {status === 'free' ? (
                                <CheckCircleOutlined />
                            ) : (
                                <CloseCircleOutlined />
                            )}
                        </span>
                        {status === 'free' ? 'Бўш' : 'Банд'}
                    </Tag>
                ),
            }, {
                title: 'Изох',
                dataIndex: 'remark',
                key: 'remark',
                render: (text) => (text ? text : 'Изох ёқ'),

            },
        ];

        const expandedData = record.beds.map(bed => ({
            ...bed,
            key: bed.id
        }));

        return (
            <Table
                columns={bedColumns}
                dataSource={expandedData}
                pagination={false}
                showHeader={false}
                size="small"
            />
        );
    };

    const formattedData = apartments.data?.map(apartment => ({
        ...apartment,
        key: apartment.id
    }));

    return (
        <div >
            <div className="flex px-10  items-center justify-between">
                <div>
                    <div className="gap-5 flex  items-center">
                        <div className="p-3 bg-gray-100 rounded-md">
                            <IoIosBed color="#00AA81" size="30"/>
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold mb-2">Койкалар</h1>
                            <Input.Search
                                placeholder="Койкани киритинг"
                                allowClear
                                enterButton="Излаш"
                                style={{width: 300, marginBottom: 16}}
                            />
                        </div>

                    </div>
                </div>

                <Button type="primary" onClick={() => setIsModalVisible(true)}>
                    Яратиш
                </Button>
            </div>
            {loading ? (
                <p>Юкланмоқда...</p>
            ) : error ? (
                <p>Хатолик: {error.message}</p>
            ) : (
                <Table
                    rowSelection
                    columns={columns}
                    dataSource={formattedData}
                    pagination={false}
                    expandable={{
                        expandedRowRender,
                        rowExpandable: (record) => record.beds && record.beds.length > 0,
                    }}
                    expandIcon={({expanded, onExpand, record}) => (
                        <Button
                            type="primary"
                            className="border h-10 w-10 text-xl"
                            style={{
                                cursor: 'pointer',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            onClick={(e) => onExpand(record, e)}
                        >
                            {expanded ? '−' : '+'}
                        </Button>
                    )}
                />
            )}

            <Modal
                title="Янги квартира яратиш"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsModalVisible(false)}>
                        Бекор қилиш
                    </Button>,
                    <Button key="submit" type="primary" onClick={() => form.submit()}>
                        Яратиш
                    </Button>,
                ]}
            >
                <Form form={form} layout="vertical" onFinish={handleCreate}>
                    <Form.Item
                        name="number"
                        label={
                            <span>
                            Квартира рақами&nbsp;
                                <Tooltip title="Квартира рақамини киритинг">
                                <InfoCircleOutlined />
                            </Tooltip>
                        </span>
                        }
                        rules={[{ required: true, message: 'Илтимос, квартира рақамини киритинг' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="floor"
                        label={
                            <span>
                            Қават&nbsp;
                                <Tooltip title="Қаватни киритинг">
                                <InfoCircleOutlined />
                            </Tooltip>
                        </span>
                        }
                        rules={[{ required: true, message: 'Илтимос, қаватни киритинг' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="beds"
                        label={
                            <span>
                            Ётоқ сони&nbsp;
                                <Tooltip title="Ётоқ сонини киритинг">
                                <InfoCircleOutlined />
                            </Tooltip>
                        </span>
                        }
                        rules={[{ required: true, message: 'Илтимос, ётоқ сонини киритинг' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="type"
                        label={
                            <span>
                            Тури&nbsp;
                                <Tooltip title="Квартира турини танланг">
                                <InfoCircleOutlined />
                            </Tooltip>
                        </span>
                        }
                        rules={[{ required: true, message: 'Илтимос, турини танланг' }]}
                    >
                        <Select>
                            <Option value="standard">Стандарт</Option>
                            <Option value="semi">Семий</Option>
                            <Option value="lux">Люкс</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="active"
                        label={
                            <span>
                            Фаол&nbsp;
                                <Tooltip title="Фаоллигини танланг">
                                <InfoCircleOutlined />
                            </Tooltip>
                        </span>
                        }
                        rules={[{ required: true, message: 'Илтимос, фаоллигини танланг' }]}
                    >
                        <Select>
                            <Option value="1">Ҳа</Option>
                            <Option value="0">Йўқ</Option>
                        </Select>
                    </Form.Item>
                    <Form.List name="bedsList">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, fieldKey, ...restField }) => (
                                    <div key={key} className="items-center" style={{ display: 'flex' }}>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'number']}
                                            fieldKey={[fieldKey, 'number']}
                                            rules={[{ required: true, message: 'Ётоқ рақамини киритинг' }]}
                                            style={{ flex: 1, marginRight: 8 }}
                                        >
                                            <Input placeholder="Ётоқ рақами" />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'price']}
                                            fieldKey={[fieldKey, 'price']}
                                            rules={[{ required: true, message: 'Нархини киритинг' }]}
                                            style={{ flex: 1, marginRight: 8 }}
                                        >
                                            <Input placeholder="Нархи" />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'active']}
                                            fieldKey={[fieldKey, 'active']}
                                            rules={[{ required: true, message: 'Фаоллигини киритинг' }]}
                                            style={{ flex: 1, marginRight: 8 }}
                                        >
                                            <Select placeholder="Фаол">
                                                <Option value="1">Ҳа</Option>
                                                <Option value="0">Йўқ</Option>
                                            </Select>
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'remark']}
                                            fieldKey={[fieldKey, 'remark']}
                                            style={{ flex: 2, marginRight: 8 }}
                                        >
                                            <Input placeholder="Изох" />
                                        </Form.Item>
                                        <Button
                                            danger
                                            type="danger"
                                            onClick={() => remove(name)}
                                            icon={<DeleteOutlined />}
                                            style={{ alignSelf: 'self-start' }}
                                        />
                                    </div>
                                ))}
                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                        Ётоқ қўшиш
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                </Form>
            </Modal>
        </div>
    );
};

export default Apartaments;
