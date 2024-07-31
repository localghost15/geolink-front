import React, { useState, useEffect, useCallback } from "react";
import {Button, Popconfirm, Spin, Table, Tag, Tooltip, Typography, message, Input} from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import axiosInstance from "../../axios/axiosInstance";
import PatientFormModal from "./components/PatientFormModal";
import {FaAddressBook, FaClinicMedical, FaEye, FaStreetView, FaUserEdit} from "react-icons/fa";
import {MdDelete} from "react-icons/md";
import {RiUserSearchLine} from "react-icons/ri";
import {LuSearch} from "react-icons/lu";
import {BiDialpadAlt} from "react-icons/bi";
import {Link} from "react-router-dom";
import {UserGroupIcon} from "@heroicons/react/24/solid";

const { Column } = Table;

const statusLabels = {
  queue: 'Навбатда...',
  examined: 'Қабулда...',
  new: 'Янги кабул',
  pending: 'Тўлов кутилмоқда',
  payed: 'Тўланган',
  revisit: 'Навбатда...',
  default: 'Навбатда...'  // Дефолтная метка для null
};

const statusColors = {
  queue: 'gold',
  examined: '#87d068',
  new: 'blue',
  pending: 'orange',
  payed: 'purple',
  revisit: 'gold',
  default: 'gold'  // Дефолтный цвет для null
};

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPatient, setCurrentPatient] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10, // Ваше предпочтительное количество на странице
    total: 0
  });



  const fetchPatients = useCallback(async (page = 1) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.get(`/patients`, {
        params: {
          page,
          per_page: pagination.pageSize,
          [searchCategory]: searchQuery
        },
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json; charset=utf-8'
        }
      });
      setPatients(response.data.data);
      setPagination({
        ...pagination,
        current: response.data.meta.current_page,
        total: response.data.meta.total
      });
    } catch (error) {
      console.error("Ошибка при получении пациентов:", error);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, searchCategory, pagination.pageSize]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const handleTableChange = (pagination, filters, sorter) => {
    const { current } = pagination;
    fetchPatients(current);
  };

  const handleRemovePatient = async (patientId) => {
    try {
      const token = localStorage.getItem('token');
      await axiosInstance.delete(`/patients/${patientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const updatedPatients = patients.filter(patient => patient.id !== patientId);
      setPatients(updatedPatients);
      message.success('Бемор учрилди!');
    } catch (error) {
      console.error("Ошибка при удалении пациента:", error);
    }
  };

  const handleOpenUpdateDialog = (patient) => {
    setCurrentPatient(patient);
    setIsModalVisible(true);
  };

  const handleClose = () => {
    setIsModalVisible(false);
    setCurrentPatient(null);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = async (values) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('district_id', values.location.district_id);
    formData.append('partner_id', values.partner_id);
    if (values.pinfl) {
      formData.append('pinfl', values.pinfl);
    }
    formData.append('phone', values.phone);
    formData.append('profession', values.profession);
    formData.append('gender', values.gender);
    formData.append('home_address', values.home_address);
    formData.append('work_address', values.work_address);
    formData.append('remark', values.remark);
    if (values.file) {
      formData.append('file', values.file.file);
    }
    formData.append('birth_at', values.birth_at.format('YYYY-MM-DD'));

    try {
      if (currentPatient) {
        await axiosInstance.put(`/patients/${currentPatient.id}`, formData,{
          headers: {
            'Content-Type': 'application/json; charset=utf-8', // Добавляем сюда
          }
        });
        fetchPatients();
        message.success('Patient updated successfully!');
      } else {
        await axiosInstance.post('/patients', formData);
        fetchPatients();
        message.success('Patient created successfully!');
      }
      handleClose();
    } catch (error) {
      message.error('Error saving patient');
      console.error('Error saving patient:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    {
      title: "Код",
      dataIndex: "code",
      key: "code",
      sorter: (a, b) => a.code.localeCompare(b.code),
    },
    {
      title: "ФИО",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Туғилган санаси",
      dataIndex: "birth_at",
      key: "birth_at",
      sorter: (a, b) => new Date(a.birth_at) - new Date(b.birth_at),
    },
    {
      title: "Холати",
      dataIndex: "visit_status",
      key: "visit_status",
      render: (visitStatus) => (
          <Tag className="px-5 py-1" color={visitStatus ? statusColors[visitStatus.status] : 'default'}>
            {visitStatus ? statusLabels[visitStatus.status] : 'Статус неизвестен'}
          </Tag>
      ),
      filters: Object.keys(statusLabels).map(key => ({ text: statusLabels[key], value: key })),
      onFilter: (value, record) => record.visit_status.status === value,
    },
    {
      title: "Манзил",
      dataIndex: "home_address",
      key: "home_address",
    },
    {
      title: "Телефон",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Харакат",
      key: "action",
      render: (text, record) => (
          <span className="flex items-center gap-1">
          <Tooltip title="Ўзгартириш">
            <Button
                size="large"
                type="primary"
                icon={<FaUserEdit size="25"  />}
                onClick={() => handleOpenUpdateDialog(record)}
            />
          </Tooltip>
          <Tooltip title="Бемор картаси">
            <Link to={`/patient/${record.id}`}>
            <Button
                size="large"
                type="primary"
                icon={<FaStreetView  size="25" />}
                onClick={() => console.log(record.id)}
            />
              </Link>
          </Tooltip>
          <Popconfirm
              title="Ёзувни ўчириш"
              onConfirm={() => handleRemovePatient(record.id)}
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
              okText="Ўчириш"
              cancelText="Бекор қилиш"
          >
            <Button size="large" type="primary" icon={<MdDelete size="25"  />} />
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
      <>
        <div className="px-10">
          {/*<Typography.Title level={3}>Барча беморлар</Typography.Title>*/}
          <div className="gap-5 flex items-center justify-between">
            <div  className="gap-5 flex items-center ">
              <div className="p-3 bg-gray-100 rounded-md">
                <UserGroupIcon color="#00AA81" className="w-7 h-7"/>
              </div>
              <div>
                <h1 className="text-xl font-semibold mb-2">Барча беморлар</h1>
                <div className="w-full flex items-center justify-between" style={{marginBottom: 16}}>
                  <Input
                      prefix={<BiDialpadAlt size="20"/>}
                      size="large"
                      placeholder="Беморни Қидириш"
                      onChange={handleSearchChange}
                      className="ant-input rounded-md"
                      style={{width: 300}}
                  />

                </div>
              </div>
            </div>
            <Button icon={<FaAddressBook size="20"/>} className="text-sm flex items-center gap-1" size="large"
                    type="primary" onClick={() => setIsModalVisible(true)}>
              Янги Бемор Қўшиш
            </Button>
          </div>
        </div>


        <Spin spinning={isLoading}>
          <Table
              dataSource={patients}
              columns={columns}
              rowKey="id"
              pagination={{
                ...pagination,
                onChange: handleTableChange
              }}
              onChange={handleTableChange}
          />
        </Spin>

        <PatientFormModal
            visible={isModalVisible}
            onClose={handleClose}
            onSubmit={handleSubmit}
            loading={isLoading}
            initialValues={currentPatient}
        />
      </>
  );
};

export default Patients;
