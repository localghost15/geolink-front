import React, { useEffect } from 'react';
import {Modal, Form, Input, Button, Select, DatePicker, Upload, Radio} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import LocationSelect from "../../../components/LocationSelect";
import DoctorsSelect from "./DoctorsList";
import moment from 'moment';
import {BiInfoCircle} from "react-icons/bi";

const { Option } = Select;

const PatientFormModal = ({ visible, onClose, onSubmit, loading, initialValues }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue({
                ...initialValues,
                location: {
                    province_id: initialValues.province_id,
                    district_id: initialValues.district_id,
                },
                birth_at: initialValues.birth_at ? moment(initialValues.birth_at) : null,
            });
        } else {
            form.resetFields();
        }
    }, [initialValues, form]);

    useEffect(() => {
        if (!visible) {
            form.resetFields();
        }
    }, [visible, form]);

    const handleFinish = (values) => {
        onSubmit(values);
    };

    return (
        <Modal
            centered
            width={1000}
            visible={visible}
            title={initialValues ? `Ўзгартириш ⟶ ${initialValues.name}` : "Янги бемор қушиш"}
            onCancel={onClose}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
            >
                <div className="grid grid-cols-3 gap-2">
                    <Form.Item
                        name="name"
                        label="Бемор ФИО"
                        rules={[{required: true, message: 'Илтимос бемор номини киритинг!'}]}
                    >
                        <Input placeholder="Бемор ФИО" className="h-10" />
                    </Form.Item>
                    <Form.Item
                        className="col-span-2"
                        label="Яшаш Манзили"
                        name="location"
                    >
                        <LocationSelect/>
                    </Form.Item>
                    <Form.Item
                        name="partner_id"
                        label="Хамкор"
                        rules={[{required: true, message: 'Илтимос хамкорни танланг'}]}
                    >
                        <DoctorsSelect/>
                    </Form.Item>
                    <Form.Item
                        tooltip={{
                            title: 'Тугри телефон рақамни киритинг код билан',
                            icon: <BiInfoCircle />,
                        }}
                        name="phone"
                        label="Телефон раками"
                        rules={[{required: true, message: 'Илтимос телефон ракамини киритинг'}]}
                    >
                        <Input placeholder="Телефон раками" className="h-10" />
                    </Form.Item>
                    <Form.Item
                        name="profession"
                        label="Касби"
                        rules={[{required: true, message: 'Илтимос касбини киритинг'}]}
                    >
                        <Input placeholder="Касби" className="h-10" />
                    </Form.Item>

                    <Form.Item
                        name="birth_at"
                        label="Тугилан куни"
                        rules={[{required: true, message: 'Илтимос Тугилган кунини танланг'}]}
                        initialValue={initialValues?.birth_at ? moment(initialValues.birth_at) : undefined}
                    >
                        <DatePicker format="DD-MM-YYYY" className="w-full h-10" />
                    </Form.Item>
                    <Form.Item
                        name="home_address"
                        label="Уй Манзили"
                        rules={[{required: true, message: 'Илтимос уй манзилни киритинг'}]}
                    >
                        <Input placeholder="Уй Манзили" className="h-10" />
                    </Form.Item>
                    <Form.Item
                        name="work_address"
                        label="Иш Манзили"
                    >
                        <Input placeholder="Иш Манзили" className="h-10" />
                    </Form.Item>
                    <Form.Item
                        name="remark"
                        label="Изох"
                    >
                        <Input placeholder="Изох" className="h-10" />
                    </Form.Item>
                    <Form.Item
                        label="Жинси"
                        name="gender"
                        rules={[{ required: true, message: 'Илтимос жинсини танланг!' }]}
                        initialValue={initialValues?.gender}
                    >
                        <Radio.Group size="large" optionType="button">
                            <Radio value="men">Еркак</Radio>
                            <Radio value="women">Аёл</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item
                        name="file"
                        label="Расм"
                    >
                        <Upload beforeUpload={() => false}>
                            <Button icon={<UploadOutlined/>}>Расмни юкланг</Button>
                        </Upload>
                    </Form.Item>


                </div>
                    <Form.Item>
                        <Button className="w-full" type="primary" htmlType="submit" loading={loading}>
                            Бемор қўшиш
                        </Button>
                    </Form.Item>
            </Form>
        </Modal>
);
};

export default PatientFormModal;
