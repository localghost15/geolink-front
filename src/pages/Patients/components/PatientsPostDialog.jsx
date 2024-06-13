// // PatientsPostDialog.js
import React, { Fragment, useState } from 'react';
import {Textarea, Typography} from "@material-tailwind/react";
import { Dialog, Transition } from '@headlessui/react';
import { UserPlusIcon } from "@heroicons/react/24/solid";
// import DatePicker from '../../../components/DatePicker';
import { useFormik } from 'formik';
import * as yup from 'yup';
import LocationSelect from '../../../components/LocationSelect';
import Dropzone from '../../../components/Dropzone';
import DoctorsSelect from './DoctorsList';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import DateSelect from "../../../components/DateSelect";
import { PhoneNumberUtil } from 'google-libphonenumber';
import toast from "react-hot-toast";
import { DownloadOutlined } from '@ant-design/icons';
import { Button, Input, Form,Radio, DatePicker } from 'antd';
import {BiInfoCircle} from "react-icons/bi";

import dayjs from 'dayjs';
import moment from 'moment';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import TextArea from "antd/es/input/TextArea";
dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
const weekFormat = 'MM/DD';
const monthFormat = 'YYYY/MM';

// Инициализируем объект PhoneNumberUtil
const phoneUtil = PhoneNumberUtil.getInstance();


const validationSchema = yup.object({
    name: yup.string().required('ФИО майдони шарт'),
    pinfl: yup.string().optional(),
    home_address: yup.string().required('Яшаш манзили майдони шарт'),
    work_address: yup.string().optional(),
    remark: yup.string().optional(),
    phone: yup.string()
        .matches(/^\d{12}$/, 'Телефон рақами 12 та рақамдан иборат бўлиши керак')
        .required('Телефон обязателен'),
    profession: yup.string().optional(),
    district_id: yup.string().required('Район обязателен'),
    partner_id: yup.string().required('Партнер обязателен'),
    gender: yup.string().required('Жинси танланг'),
    birth_at: yup.date().required('Дата рождения обязательна'),
});

const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY', 'DD-MM-YYYY', 'DD-MM-YY'];
const customFormat = (value) => `custom format: ${value.format(dateFormat)}`;
const customWeekStartEndFormat = (value) =>
    `${dayjs(value).startOf('week').format(weekFormat)} ~ ${dayjs(value)
        .endOf('week')
        .format(weekFormat)}`;

export default function PatientsPostDialog({ onAddPatient }) {
    const [isOpen, setIsOpen] = useState(false);

    const formik = useFormik({
        initialValues: {
            name: "",
            pinfl: "",
            home_address: "",
            work_address: "",
            remark: "",
            phone: "",
            profession: "",
            district_id: "",
            partner_id: "",
            gender: "",
            birth_at: "",
            file: null,
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            const token = localStorage.getItem("token");

            const formData = new FormData();
            Object.keys(values).forEach((key) => {
                if (values[key] !== undefined && values[key] !== null) {
                    formData.append(key, values[key]);
                }
            });

            try {
                const response = await fetch("https://back.geolink.uz/api/v1/patients", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                });

                const responseData = await response.json();
                if (response.status === 400 && responseData.message === "The phone has already been taken.") {
                    formik.setFieldError('phone', "Телефон ракам ишлатилмокда");
                } else {
                    onAddPatient(responseData.data);
                    formik.resetForm();
                    closeModal();
                    toast.success('Бемор кушилди!')
                }
            } catch (error) {
                console.error("Error:", error);
            }
        },

    });

    const closeModal = () => {
        setIsOpen(false);
    };

    const openModal = () => {
        setIsOpen(true);
    };

    return (
        <>
            <div className="inset-0 flex items-center justify-center">
                <Button icon={<UserPlusIcon  className="h-5 w-5 " />} onClick={openModal} className="flex h-10 items-center gap-3 normal-case font-normal" size="sm">
                    Янги бемор кушиш
                </Button>

            </div>

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                       Янги бемор қушиш -> Малумотларни киритиш
                                    </Dialog.Title>
                                    <Form  layout="vertical" onFinish={formik.handleSubmit}>
                                        <div className="mt-2">
                                            <div className="grid grid-cols-3 gap-4">
                                                <div>
                                                    <Form.Item
                                                        layout="vertical"
                                                        label="ФИО"
                                                        name="username"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: 'ФИО майдони шарт',
                                                            },
                                                        ]}
                                                    >
                                                        <Input
                                                            className="h-11 rounded-md"
                                                            placeholder="ФИО: *"
                                                            size="large"
                                                            name="name"
                                                            value={formik.values.name}
                                                            onChange={formik.handleChange}
                                                            error={formik.touched.name && formik.errors.name}
                                                            helperText={formik.touched.name && formik.errors.name ? formik.errors.name : ''}
                                                        />
                                                    </Form.Item>

                                                </div>
                                                <Form.Item
                                                    layout="vertical"
                                                    label="Иш Манзили"
                                                    name="address"
                                                    rules={[
                                                        {
                                                            required: false,
                                                            message: 'Please input your username!',
                                                        },
                                                    ]}
                                                >
                                                <Input
                                                    className="h-11 rounded-md"
                                                    placeholder="Иш Манзили"
                                                    size="large"
                                                    name="work_address"
                                                    value={formik.values.work_address}
                                                    onChange={formik.handleChange}
                                                />
                                                </Form.Item>
                                                <div>
                                                    <Form.Item
                                                        layout="vertical"
                                                        label="Тугилган куни"
                                                        name="birth_at"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: 'Тугилган куни майдони шарт',
                                                            },
                                                        ]}
                                                        >
                                                    {/*>*/}
                                                    {/*<DateSelect*/}
                                                    {/*    value={formik.values.birth_at}*/}
                                                    {/*    error={formik.touched.birth_at && formik.errors.birth_at}*/}
                                                    {/*    onChange={(date) => formik.setFieldValue('birth_at', date)}*/}
                                                    {/*/>*/}

                                                        <DatePicker
                                                            className="h-11 rounded-md w-full"
                                                            // Преобразуем значение из formik в объект moment, если оно существует
                                                            value={formik.values.birth_at ? moment(formik.values.birth_at, 'YYYY-MM-DD') : null}
                                                            onChange={(date) => {
                                                                if (date) {
                                                                    // Преобразуем выбранную дату в формат YYYY-MM-DD
                                                                    const formattedDate = date.format('YYYY-MM-DD');
                                                                    formik.setFieldValue('birth_at', formattedDate);
                                                                } else {
                                                                    // Если дата не выбрана, устанавливаем значение в null
                                                                    formik.setFieldValue('birth_at', null);
                                                                }
                                                            }}
                                                        />
                                                    </Form.Item>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <Form.Item
                                                    layout="vertical"
                                                    label="Яшаш Манзили"
                                                    name="location"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: 'Яшаш тумани майдони шарт',
                                                        },
                                                    ]}
                                                >
                                                <LocationSelect
                                                    label="District"
                                                    error={formik.touched.district_id && formik.errors.district_id}
                                                    onChange={(selectedValues) => formik.setFieldValue('district_id', selectedValues.district_id)}
                                                />
                                                </Form.Item>
                                                <Form.Item
                                                    layout="vertical"
                                                    label="Ким юборилди"
                                                    name="partner"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: 'Партнерни танланг!',
                                                        },
                                                    ]}
                                                >
                                                <DoctorsSelect
                                                    label="Ким йуборилди"
                                                    onChange={(partnerId) => formik.setFieldValue('partner_id', partnerId)}
                                                />
                                                </Form.Item>
                                            </div>
                                            <div className="grid grid-cols-3 gap-4">
                                                <Form.Item
                                                    layout="vertical"
                                                    label="Касби"
                                                    name="profession"
                                                    rules={[
                                                        {
                                                            required: false,
                                                            message: 'Please input your username!',
                                                        },
                                                    ]}
                                                >
                                                <Input
                                                    className="h-11 rounded-md"
                                                    placeholder="Касби:"
                                                    size="large"
                                                    name="profession"
                                                    value={formik.values.profession}
                                                    onChange={formik.handleChange}
                                                />
                                                </Form.Item>
                                                <Form.Item
                                                    layout="vertical"
                                                    label="Телефон рақами"
                                                    name="phone"
                                                    tooltip={{
                                                        title: 'Тугри телефон рақамни киритинг код билан',
                                                        icon: <BiInfoCircle />,
                                                    }}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: 'Please input your username!',
                                                        },
                                                    ]}
                                                >
                                                    <PhoneInput
                                                        hideDropdown={true}
                                                        international={false}
                                                        defaultCountry="uz"
                                                        prefix=""
                                                        value={formik.values.phone}
                                                        onChange={(phone) => formik.setFieldValue('phone', phone)}
                                                        inputClass="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                    />
                                                    {formik.touched.phone && formik.errors.phone && (
                                                        <Typography className="text-xs" color="red" size="xs">
                                                            {formik.errors.phone}
                                                        </Typography>
                                                    )}
                                                </Form.Item>
                                                <Form.Item
                                                    layout="vertical"
                                                    label="Яшаш манзили"
                                                    name="home_address"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: 'Яшаш манзили майдони шарт',
                                                        },
                                                    ]}
                                                >
                                                    <Input
                                                        className="h-11 rounded-md"
                                                        placeholder="Яшаш манзили"
                                                        size="large"
                                                        name="home_address"
                                                        value={formik.values.home_address}
                                                        onChange={formik.handleChange}
                                                        error={formik.touched.home_address && formik.errors.home_address}
                                                        helperText={formik.touched.home_address && formik.errors.home_address ? formik.errors.home_address : ''}
                                                    />

                                                </Form.Item>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <Form.Item
                                                    layout="vertical"
                                                    label="Жинси"
                                                    name="gender"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: 'Жинсни танланг',
                                                        },
                                                    ]}
                                                >
                                                    <Radio.Group size="large">
                                                        <Radio.Button
                                                            name="gender"
                                                            value="men"
                                                            checked={formik.values.gender === 'men'}
                                                            onChange={() => formik.setFieldValue('gender', 'men')}
                                                            label="Еркак"
                                                        >
                                                            Еркак
                                                        </Radio.Button>
                                                        <Radio.Button
                                                            className="z-0"
                                                            name="gender"
                                                            value="women"
                                                            checked={formik.values.gender === 'women'}
                                                            onChange={() => formik.setFieldValue('gender', 'women')}
                                                            label="Айол"
                                                        >Айол</Radio.Button>
                                                    </Radio.Group>
                                                </Form.Item>
                                                <Form.Item
                                                    layout="vertical"
                                                    label="ПИНФЛ"
                                                    name="pinfl"
                                                    rules={[
                                                        {
                                                            required: false,
                                                            message: 'Please input your username!',
                                                        },
                                                    ]}
                                                >
                                                <Input
                                                    className="h-11 rounded-md"
                                                    placeholder="ПИНФЛ:"
                                                    size="large"
                                                    name="pinfl"
                                                    value={formik.values.pinfl}
                                                    onChange={formik.handleChange}
                                                    error={formik.touched.pinfl && formik.errors.pinfl}
                                                    helperText={formik.touched.pinfl && formik.errors.pinfl ? formik.errors.pinfl : ''}
                                                />
                                                </Form.Item>
                                            </div>
                                            <div className="mt-4 flex gap-4">
                                                {/*<Textarea*/}
                                                {/*    label="Исох:"*/}
                                                {/*    fullWidth*/}
                                                {/*    name="remark"*/}
                                                {/*    value={formik.values.remark}*/}
                                                {/*    onChange={formik.handleChange}*/}
                                                {/*/>*/}
                                                <TextArea
                                                    showCount
                                                    name="remark"
                                                    value={formik.values.remark}
                                                    onChange={formik.handleChange}
                                                    maxLength={100}
                                                    placeholder="Исох:"
                                                    style={{
                                                        height: 170,
                                                        resize: 'none',
                                                    }}
                                                />
                                                <Dropzone onFilesChange={(file) => formik.setFieldValue('file', file)} />
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <Button type="primary" className="w-full" htmlType="submit" variant="gradient" fullWidth>
                                                Сақлаш
                                            </Button>
                                        </div>
                                    </Form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}


