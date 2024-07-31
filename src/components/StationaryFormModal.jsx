// StationaryFormModal.js
import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Select, DatePicker, Spin, message, Cascader } from 'antd';
import axiosInstance from "./axios/axiosInstance";

const { Option } = Select;

const StationaryFormModal = ({ visible, onCancel, onSubmit, initialData }) => {
    const [form] = Form.useForm();
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [apartments, setApartments] = useState([]);
    const [beds, setBeds] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedApartmentId, setSelectedApartmentId] = useState(null);

    useEffect(() => {
        const fetchDoctors = async () => {
            setIsLoading(true);
            try {
                const response = await axiosInstance.get('/admin/users');
                const doctorUsers = response.data.data.filter(user => user.roles.includes('doctor'));
                setDoctors(doctorUsers);
            } catch (error) {
                console.error("Докторларни юклашда хатолик:", error);
                message.error('Докторларни юклашда хатолик');
            } finally {
                setIsLoading(false);
            }
        };

        const fetchPatients = async () => {
            setIsLoading(true);
            try {
                const response = await axiosInstance.get('/patients');
                setPatients(response.data.data);
            } catch (error) {
                console.error("Пациентларни юклашда хатолик:", error);
                message.error('Пациентларни юклашда хатолик');
            } finally {
                setIsLoading(false);
            }
        };

        const fetchApartments = async () => {
            setIsLoading(true);
            try {
                const response = await axiosInstance.get('/admin/apartment');
                setApartments(response.data.data);
            } catch (error) {
                console.error("Апартаментларни юклашда хатолик:", error);
                message.error('Апартаментларни юклашда хатолик');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDoctors();
        fetchPatients();
        fetchApartments();
    }, []);

    useEffect(() => {
        if (initialData) {
            form.setFieldsValue({
                patient_id: initialData.patient_id,
                doctor_id: initialData.doctor_id,
                bed_id: initialData.bed_id,
                start_at: initialData.start_at ? new Date(initialData.start_at * 1000) : null,
            });
            // Загрузка кроватей при инициализации
            if (initialData.bed_id) {
                const selectedBed = apartments.flatMap(apartment => apartment.beds).find(bed => bed.id === initialData.bed_id);
                setSelectedApartmentId(selectedBed ? selectedBed.apartment_id : null);
                setBeds(apartments.flatMap(apartment => apartment.beds));
            }
        }
    }, [initialData, apartments, form]);

    const onApartmentChange = (value) => {
        const [apartmentId] = value;
        setSelectedApartmentId(apartmentId);
        const selectedApartment = apartments.find(apartment => apartment.id === apartmentId);
        setBeds(selectedApartment ? selectedApartment.beds : []);
    };

    const onFormSubmit = async (values) => {
        const data = new FormData();
        data.append('patient_id', values.patient_id);
        data.append('doctor_id', values.doctor_id);

        const bedId = values.bed_id[1];
        data.append('bed_id', bedId);

        data.append('start_at', values.start_at.format('YYYY-MM-DD HH:mm:ss'));

        try {
            if (initialData) {
                await axiosInstance.put(`/stationary/${initialData.id}`, data);
            } else {
                await axiosInstance.post('/stationary', data);
            }
            message.success('Маълумот муваффақиятли сақланди');
            form.resetFields();
            onSubmit();
        } catch (error) {
            console.error("Маълумотни сақлашда хатолик:", error);
            message.error('Маълумотни сақлашда хатолик');
        }
    };

    const apartmentTypeMap = {
        standard: 'Стандарт',
        semi: 'Яримлюкс',
        lux: 'Люкс'
    };

    const bedStatusMap = {
        available: 'Мавжуд',
        busy: 'Банд'
    };

    const apartmentOptions = apartments.map(apartment => ({
        value: apartment.id,
        label: `${apartment.floor} Хона - ${apartmentTypeMap[apartment.type] || apartment.type}`,
        children: apartment.beds.map(bed => ({
            value: bed.id,
            label: `Ётоқ ${bed.number} (${bedStatusMap[bed.status] || bed.status}) - ${bed.price} сум`,
            disabled: bed.status === 'busy', // Disable the option if the bed is busy
        })),
    }));

    const filter = (inputValue, path) =>
        path.some((option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);


    return (
        <Modal
            visible={visible}
            title={initialData ? 'Маълумотни таҳрирлаш' : 'Янги маълумот қўшиш'}
            onCancel={() => {
                form.resetFields(); // Resetting the form fields when the modal is closed
                onCancel();
            }}
            footer={null}
        >
            {isLoading ? (
                <Spin />
            ) : (
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFormSubmit}
                >
                    <Form.Item label="Бемор" name="patient_id" rules={[{ required: true, message: 'Илтимос, пациентни танланг' }]}>
                        <Select placeholder="Пациент танланг">
                            {patients.map(patient => (
                                <Option key={patient.id} value={patient.id}>
                                    {patient.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Доктор" name="doctor_id" rules={[{ required: true, message: 'Илтимос, докторни танланг' }]}>
                        <Select placeholder="Доктор танланг">
                            {doctors.map(doctor => (
                                <Option key={doctor.id} value={doctor.id}>
                                    {doctor.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Апартамент ва кровать" name="bed_id" rules={[{ required: true, message: 'Илтимос, кроватьни танланг' }]}>
                        <Cascader
                            options={apartmentOptions}
                            onChange={onApartmentChange}
                            placeholder="Апартамент ва кровать танланг"
                            showSearch={{ filter }}
                            onSearch={(value) => console.log(value)}
                        />
                    </Form.Item>
                    <Form.Item label="Бошланиш санаси ва вақти" name="start_at" rules={[{ required: true, message: 'Илтимос, сана ва вақтни танланг' }]}>
                        <DatePicker
                            showTime
                            format="YYYY-MM-DD HH:mm:ss"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Сақлаш
                        </Button>
                    </Form.Item>
                </Form>
            )}
        </Modal>
    );
};

export default StationaryFormModal;
