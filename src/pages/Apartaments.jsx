import React, { useEffect, useState } from 'react';
import { Button, Input, Popconfirm, Table, Tag, Tooltip, Modal, Form, Select } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, QuestionCircleOutlined, PlusOutlined, DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { getApartments, createApartment, deleteApartment, updateApartment } from '../services/apartmentService';
import { FaStreetView, FaUserEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import {MdBedroomChild, MdDelete} from "react-icons/md";
import { IoIosBed } from "react-icons/io";
import { PencilIcon } from "@heroicons/react/24/solid";
import { BiDialpadAlt } from "react-icons/bi";
import RoomProjection from "../components/RoomProjection";
import {updateBed, deleteBed, createBed} from "../services/bedService";
import {BsFillBookmarkCheckFill} from "react-icons/bs";
import {IoBookmark, IoBookmarks} from "react-icons/io5";

const { Option } = Select;

const Apartaments = () => {
    const [apartments, setApartments] = useState([]);

    const [isCreateBedModalVisible, setIsCreateBedModalVisible] = useState(false);
    const [isUpdateBedModalVisible, setIsUpdateBedModalVisible] = useState(false);
    const [currentBed, setCurrentBed] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
    const [currentApartment, setCurrentApartment] = useState(null);
    const [form] = Form.useForm();
    const [updateForm] = Form.useForm();

    const [bedForm] = Form.useForm();
    const [updateBedForm] = Form.useForm();

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

    const handleUpdate = async (values) => {
        try {
            await updateApartment(currentApartment.id, values);
            setIsUpdateModalVisible(false);
            updateForm.resetFields();
            // Refresh apartment list after updating
            const data = await getApartments();
            setApartments(data);
        } catch (error) {
            console.error('Error updating apartment:', error);
        }
    };

    const handleCreateBed = async (values) => {
        try {
            // Проверка обязательных полей
            if (!values.number || !values.price || !values.status) {
                // Можно использовать уведомления для предупреждения пользователя о заполнении обязательных полей
                alert('Ишлатиш учун барча зарурий майдонларни тўлдиринг!');
                return; // Прекратить выполнение функции
            }

            const formData = new FormData();
            formData.append('number', values.number);
            formData.append('active', values.active || false); // Предоставляем значение по умолчанию, если поле не заполнено
            formData.append('status', values.status);
            formData.append('remark', values.remark || ''); // Предоставляем значение по умолчанию, если поле не заполнено
            formData.append('price', values.price);

            await createBed(currentApartment.id, formData);
            setIsCreateBedModalVisible(false);
            bedForm.resetFields();
            const data = await getApartments();
            setApartments(data);
        } catch (error) {
            console.error('Error creating bed:', error);
        }
    };


    const handleUpdateBed = async (values) => {
        try {
            const formData = new FormData();
            formData.append('number', values.number);
            formData.append('active', values.active);
            formData.append('status', values.status);
            formData.append('remark', values.remark);
            await updateBed(currentBed.id, formData);
            setIsUpdateBedModalVisible(false);
            updateBedForm.resetFields();
            const data = await getApartments();
            setApartments(data);
        } catch (error) {
            console.error('Error updating bed:', error);
        }
    };

    const handleDeleteBed = async (bedId) => {
        try {
            await deleteBed(bedId);
            const data = await getApartments();
            setApartments(data);
        } catch (error) {
            console.error('Error deleting bed:', error);
        }
    };


    const columns = [
        {
            title: 'Квартира рақами',
            dataIndex: 'number',
            key: 'number',
            sorter: (a, b) => a.number.localeCompare(b.number),
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: 'Қават',
            dataIndex: 'floor',
            key: 'floor',
            sorter: (a, b) => a.floor - b.floor,
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: 'Тури',
            dataIndex: 'type',
            key: 'type',
            render: (type) => typeMapping[type] || type,
            // You can add filters for type
            filters: [
                { text: 'Стандарт', value: 'standard' },
                { text: 'Семий', value: 'semi' },
                { text: 'Люкс', value: 'lux' },
            ],
            onFilter: (value, record) => record.type.includes(value),
        },
        {
            title: 'Фаол',
            dataIndex: 'active',
            key: 'active',
            render: (text) => (text ? 'Ҳа' : 'Йўқ'),
            // Add filter functionality if needed
            filters: [
                { text: 'Ҳа', value: 1 },
                { text: 'Йўқ', value: 0 },
            ],
            onFilter: (value, record) => record.active === value,
        },
        {
            title: 'Ётоқ сони',
            dataIndex: 'beds_count',
            key: 'beds_count',
            sorter: (a, b) => a.beds_count - b.beds_count,
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: "Харакат",
            key: "action",
            render: (text, record) => (
                <span className="flex items-center gap-1">
                     <Button onClick={() => {
                         setCurrentApartment(record);
                         setIsUpdateModalVisible(true);
                         updateForm.setFieldsValue(record);
                     }}
                         type="primary"
                         className={`minimal-button bg-teal-500 text-white hover:bg-teal-600`}
                     >
    Ўзгартириш
  </Button>
                    {/*<Tooltip title="Ўзгартириш">*/}
                    {/*    <Button size="large" type="default" icon={<PencilIcon className="h-5 w-5"/>} onClick={() => {*/}
                    {/*        setCurrentApartment(record);*/}
                    {/*        setIsUpdateModalVisible(true);*/}
                    {/*        updateForm.setFieldsValue(record);*/}
                    {/*    }}/>*/}
                    {/*</Tooltip>*/}
                     <Tooltip title="Койка қўшиш">
                        <Button
                            size="large"
                            type="default"
                            icon={<IoIosBed size="25"/>}
                            onClick={() => {
                                setCurrentApartment(record);
                                setIsCreateBedModalVisible(true);
                            }}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Ёзувни ўчириш"
                        icon={<QuestionCircleOutlined style={{color: 'red'}}/>}
                        okText="Ўчириш"
                        cancelText="Бекор қилиш"
                        onConfirm={() => handleDelete(record.id)}
                    >
                        <Button size="large" type="default" icon={<MdDelete size="25"/>}/>
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
                    <Tag className={`border-none  max-w-min px-4 ${status === 'free' ? 'tag-free' : 'tag-busy'}`}>
                        <span className="tag-icon">
                            {status === 'free' ? (
                                <IoBookmarks   size="16"  />
                            ) : (
                                <BsFillBookmarkCheckFill size="16"  />
                            )}
                        </span>
                        {status === 'free' ? 'Бўш' : 'Банд'}
                    </Tag>
                ),
            },
            {
                title: 'Изох',
                dataIndex: 'remark',
                key: 'remark',
                render: (text) => (text ? text : 'Изох ёқ'),
            },
            {
                title: "Ҳаракат",
                key: "action",
                render: (text, bed) => (
                    <span className="flex items-center gap-1">
                        <Tooltip title="Ўзгартириш">
                            <Button size="large" type="primary" icon={<PencilIcon className="h-4 w-4" />} onClick={() => {
                                setCurrentBed(bed);
                                setIsUpdateBedModalVisible(true);
                                updateBedForm.setFieldsValue(bed);
                            }} />
                        </Tooltip>
                        <Popconfirm
                            title="Ётоқни ўчириш"
                            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                            okText="Ўчириш"
                            cancelText="Бекор қилиш"
                            onConfirm={() => handleDeleteBed(bed.id)}
                        >
                            <Button size="large" type="primary" icon={<MdDelete size="20" />} />
                        </Popconfirm>
                    </span>
                ),
            }
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
                size="middle"
            />
        );
    };

    const formattedData = apartments.data?.map(apartment => ({
        ...apartment,
        key: apartment.id
    }));

    const addNewBed = () => {
        const bedsList = form.getFieldValue('bedsList') || [];
        form.setFieldsValue({ bedsList: [...bedsList, { number: '', active: 1, status: 'free', price: '', remark: '' }] });
    };

    return (
        <div >
            <div className="flex px-10  items-center justify-between">
                <div>
                    <div className="gap-5 flex  items-center">
                        <div className="p-3 bg-gray-100 rounded-md">
                            <IoIosBed color="#00AA81" size="30" />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold mb-2">Койкалар</h1>
                            <div className="w-full flex items-center justify-between" style={{ marginBottom: 16 }}>
                                <Input
                                    prefix={<BiDialpadAlt size="20" />}
                                    size="large"
                                    placeholder="Койкани Қидириш"
                                    className="ant-input rounded-md"
                                    style={{ width: 300 }}
                                />

                            </div>

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
                    expandable={{
                        expandedRowRender,
                        rowExpandable: (record) => record.beds && record.beds.length > 0,
                    }}
                    expandIcon={({ expanded, onExpand, record }) => (
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

                centered
                title="Ётоқ яратиш"
                visible={isCreateBedModalVisible}
                onCancel={() => setIsCreateBedModalVisible(false)}
                footer={null}
            >
                <Form
                    form={bedForm}
                    onFinish={handleCreateBed}
                    layout="vertical"
                >
                    <Form.Item name="number" label="Ётоқ рақами" rules={[{ required: true, message: 'Ётоқ рақамини киритинг!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="price" label="Ётоқ нархи" rules={[{ required: true, message: 'Ётоқ нархини киритинг!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="active" label="Фаол" valuePropName="checked">
                        <Select>
                            <Option value={1}>Ҳа</Option>
                            <Option value={0}>Йўқ</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="status" label="Ҳолат" rules={[{ required: true, message: 'Ҳолатини танланг!' }]}>
                        <Select>
                            <Option value="free">Бўш</Option>
                            <Option value="busy">Банд</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="remark" label="Изох">
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Юбориш
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                width={1000}
                centered
                title="Янги квартира қўшиш"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={[
                    <Button key="back" onClick={() => setIsModalVisible(false)}>
                        Бекор қилиш
                    </Button>,
                    <Button key="submit" type="primary" onClick={() => form.submit()}>
                        Сақлаш
                    </Button>,
                ]}
            >
                <Form form={form} onFinish={handleCreate} layout="vertical">
                    <Form.Item name="number" label="Квартира рақами" rules={[{ required: true, message: 'Квартира рақамини киритинг' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="floor" label="Қават" rules={[{ required: true, message: 'Қаватни киритинг' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="beds" label="Ётоқ сони" rules={[{ required: true, message: 'Ётоқ сонини киритинг' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="type" label="Тури" rules={[{ required: true, message: 'Турини киритинг' }]}>
                        <Select>
                            <Option value="standard">Стандарт</Option>
                            <Option value="semi">Семий</Option>
                            <Option value="lux">Люкс</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="active" label="Фаол" rules={[{ required: true, message: 'Ҳолатни танланг' }]}>
                        <Select>
                            <Option value={1}>Ҳа</Option>
                            <Option value={0}>Йўқ</Option>
                        </Select>
                    </Form.Item>
                    <Form.List name="bedsList">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, fieldKey, ...restField }) => (
                                    <div className="gap-4" key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'number']}
                                            fieldKey={[fieldKey, 'number']}
                                            label="Ётоқ рақами"
                                            rules={[{ required: true, message: 'Ётоқ рақамини киритинг' }]}
                                            style={{ flex: 1 }}
                                        >
                                            <Input placeholder="Ётоқ рақами" />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'price']}
                                            fieldKey={[fieldKey, 'price']}
                                            label="Нарх"
                                            rules={[{ required: true, message: 'Нархини киритинг' }]}
                                            style={{ flex: 1 }}
                                        >
                                            <Input placeholder="Нарх" />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'active']}
                                            fieldKey={[fieldKey, 'active']}
                                            label="Фаол"
                                            rules={[{ required: true, message: 'Фаоллигини киритинг' }]}
                                            style={{ flex: 1 }}
                                        >
                                            <Select placeholder="Фаол">
                                                <Option value={1}>Ҳа</Option>
                                                <Option value={0}>Йўқ</Option>
                                            </Select>
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'remark']}
                                            fieldKey={[fieldKey, 'remark']}
                                            label="Изох"
                                            style={{ flex: 1 }}
                                        >
                                            <Input placeholder="Изох" />
                                        </Form.Item>
                                        <Button size="middle" className="self-center" type="default" onClick={() => remove(name)} icon={<DeleteOutlined size="25" />} />
                                    </div>
                                ))}
                                <Button block type="primary" onClick={() => add()} icon={<PlusOutlined />}>
                                    Ётоқ қўшиш
                                </Button>
                            </>
                        )}
                    </Form.List>
                </Form>
            </Modal>

            <Modal
                centered
                title="Квартирани янгилаш"
                visible={isUpdateModalVisible}
                onCancel={() => setIsUpdateModalVisible(false)}
                footer={[
                    <Button key="back" onClick={() => setIsUpdateModalVisible(false)}>
                        Бекор қилиш
                    </Button>,
                    <Button key="submit" type="primary" onClick={() => updateForm.submit()}>
                        Янгилаш
                    </Button>,
                ]}
            >
                <Form form={updateForm} onFinish={handleUpdate} layout="vertical">
                    <Form.Item name="number" label="Квартира рақами" rules={[{ required: true, message: 'Квартира рақамини киритинг' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="floor" label="Қават" rules={[{ required: true, message: 'Қаватни киритинг' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="type" label="Тури" rules={[{ required: true, message: 'Турини киритинг' }]}>
                        <Select>
                            <Option value="standard">Стандарт</Option>
                            <Option value="semi">Семий</Option>
                            <Option value="lux">Люкс</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="active" label="Фаол" rules={[{ required: true, message: 'Ҳолатни танланг' }]}>
                        <Select>
                            <Option value={true}>Ҳа</Option>
                            <Option value={false}>Йўқ</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>


            <Modal
                centered
                title="Ётоқни ўзгартириш"
                visible={isUpdateBedModalVisible}
                onCancel={() => setIsUpdateBedModalVisible(false)}
                footer={null}
            >
                <Form form={updateBedForm} layout="vertical" onFinish={handleUpdateBed}>
                    <Form.Item name="number" label="Ётоқ рақами">
                        <Input />
                    </Form.Item>
                    <Form.Item name="price" label="Нарх">
                        <Input />
                    </Form.Item>
                    <Form.Item name="remark" label="Изоҳ">
                        <Input />
                    </Form.Item>
                    <Form.Item name="active" label="Фаол">
                        <Select>
                            <Option value={true}>Ҳа</Option>
                            <Option value={false}>Йўқ</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="status" label="Ҳолат">
                        <Select>
                            <Option value="free">Бўш</Option>
                            <Option value="busy">Банд</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Янгилаш
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

        </div>
    );
};

export default Apartaments;
