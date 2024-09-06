import React, { useState, useEffect } from 'react';
import { Modal, Tooltip, Switch, Input, Button, Table, Pagination, Typography, Card, Radio } from "antd";
import {DeleteOutlined, UserAddOutlined } from "@ant-design/icons";
import axiosInstance from "../axios/axiosInstance";
import {IoPencilOutline} from "react-icons/io5";
import {BiDialpadAlt} from "react-icons/bi";
import {PencilIcon, TrashIcon} from "@heroicons/react/24/solid";

const { Title } = Typography;
const { Search } = Input;

const Services = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [services, setServices] = useState([]);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);
  const [editServiceId, setEditServiceId] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [serviceType, setServiceType] = useState('all');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axiosInstance.get("/admin/service");
      setServices(response.data.data);
    } catch (error) {
      console.error("Ошибка при получении списка сервисов:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditServiceId(null);
    setNewServiceName('');
    setNewServicePrice('');
    setIsPrimary(false);
    setServiceType('all');
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const serviceData = {
        name: newServiceName,
        price: newServicePrice,
        primary: isPrimary ? 1 : 0,
        type: serviceType
      };

      if (editServiceId) {
        await axiosInstance.put(`/admin/service/${editServiceId}`, serviceData);
      } else {
        await axiosInstance.post("/admin/service", serviceData);
      }
      fetchServices();
      closeModal();
    } catch (error) {
      console.error("Ошибка при сохранении сервиса:", error);
    }
  };

  const handleEdit = (service) => {
    setEditServiceId(service.id);
    setNewServiceName(service.name);
    setNewServicePrice(service.price);
    setIsPrimary(service.primary);
    setServiceType(service.type || 'all');
    openModal();
  };

  const handleDelete = async (serviceId) => {
    try {
      await axiosInstance.delete(`/admin/service/${serviceId}`);
      fetchServices();
    } catch (error) {
      console.error("Ошибка при удалении сервиса:", error);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const filteredServices = services.filter(service =>
      service.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const getTypeName = (type) => {
    switch (type) {
      case 'all':
        return 'Все';
      case 'ambulatory':
        return 'Амбулаторный';
      case 'stationary':
        return 'Стационарный';
      default:
        return '';
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Номланиши', dataIndex: 'name', key: 'name' },
    { title: 'Нархи', dataIndex: 'price', key: 'price' },
    { title: 'Хил', dataIndex: 'type', key: 'type', render: getTypeName },
    { title: 'Хизмат тури', dataIndex: 'primary', key: 'primary', render: text => text ? 'Основной' : 'Дополнительный' },
    {
      title: 'Харакат',
      key: 'action',
      render: (text, record) => (
          <div className="flex items-center gap-4">
            <Tooltip title="Ўзгартириш">
              <Button type="primary" icon={ <PencilIcon className="h-4 w-4" />} onClick={() => handleEdit(record)}>
              </Button>
            </Tooltip>
            <Tooltip title="Ўчириш">
              <Button icon={<TrashIcon className="h-4 w-4"/>} onClick={() => handleDelete(record.id)}>
              </Button>
            </Tooltip>
          </div>
      )
    }
  ];

  return (
      <Card className="h-full w-full rounded-none border-none">
        <div className="px-10">
          <Title level={3}>Асосий хизматлар</Title>

          <div className="w-full flex items-center justify-between" style={{ marginBottom: 16 }}>
            <Input
                prefix={<BiDialpadAlt size="20"/>}
                size="large"
                placeholder="Беморни Қидириш"
                value={searchText}
                onChange={e => handleSearch(e.target.value)}
                className="ant-input rounded-md"
                style={{width: 300}}
            />
            <Button type="primary" onClick={openModal} className="flex h-10 items-center gap-3 normal-case font-normal" size="sm">
              <UserAddOutlined />
              Янги қўшиш
            </Button>
          </div>
        </div>

        <Modal
            centered
            title={editServiceId ? "Хизматни таҳрирлаш" : "Хизмат кўшиш"}
            visible={isModalOpen}
            onCancel={closeModal}
            footer={[
              <Button key="cancel" onClick={closeModal}>
                Бекор қилиш
              </Button>,
              <Button key="save" type="primary" onClick={handleSave}>
                Сақлаш
              </Button>
            ]}
        >
          <div className="grid grid-cols-1 gap-4">
            <Input
                placeholder="Хизмат номи: *"
                size="large"
                value={newServiceName}
                onChange={(e) => setNewServiceName(e.target.value)}
            />
            <Input
                placeholder="Нархи: *"
                size="large"
                value={newServicePrice}
                onChange={(e) => setNewServicePrice(e.target.value)}
            />
          </div>
          <div className="mt-4">
            <Radio.Group buttonStyle="solid" onChange={e => setServiceType(e.target.value)} value={serviceType}>
              <Radio.Button value="all">Хаммаси</Radio.Button>
              <Radio.Button value="ambulatory">Амбулаторный</Radio.Button>
              <Radio.Button value="stationary">Стационарный</Radio.Button>
            </Radio.Group>
          </div>
          <div className="flex items-center mt-4 gap-4">
            <Switch checked={isPrimary} onChange={(checked) => setIsPrimary(checked)}/>
            <span>{isPrimary ? 'Основной' : 'Дополнительный'}</span>
          </div>

        </Modal>

        <Table
            columns={columns}
            dataSource={filteredServices.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
            pagination={false}
            rowKey="id"
        />

        <Pagination
            current={currentPage}
            pageSize={pageSize}
            onChange={page => setCurrentPage(page)}
            total={filteredServices.length}
            showSizeChanger
            onShowSizeChange={(current, size) => setPageSize(size)}
        />
      </Card>
  );
};

export default Services;
