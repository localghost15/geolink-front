// // PatientsPostDialog.js
import React, { Fragment, useState } from 'react';
import { Button, Input, Radio, Textarea, Typography } from "@material-tailwind/react";
import { Dialog, Transition } from '@headlessui/react';
import { UserPlusIcon } from "@heroicons/react/24/solid";
import DatePicker from '../../../components/DatePicker';
import { useFormik } from 'formik';
import * as yup from 'yup';
import LocationSelect from '../../../components/LocationSelect';
import Dropzone from '../../../components/Dropzone';
import DoctorsSelect from './DoctorsList';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import DateSelect from "../../../components/DateSelect";
import { PhoneNumberUtil } from 'google-libphonenumber';

// Инициализируем объект PhoneNumberUtil
const phoneUtil = PhoneNumberUtil.getInstance();


const validationSchema = yup.object({
    name: yup.string().required('ФИО обязателен'),
    pinfl: yup.string().optional(),
    home_address: yup.string().required('Яшаш манзили обязателен'),
    work_address: yup.string().optional(),
    remark: yup.string().optional(),
    phone: yup.string()
        .matches(/^\d{12}$/, 'Номер телефона должен содержать 12 цифр')
        .required('Телефон обязателен'),
    profession: yup.string().optional(),
    district_id: yup.string().required('Район обязателен'),
    partner_id: yup.string().required('Партнер обязателен'),
    gender: yup.string().required('Пол обязателен'),
    birth_at: yup.date().required('Дата рождения обязательна'),
});

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
                <Button onClick={openModal} className="flex h-12 items-center gap-3 normal-case font-normal" size="sm">
                    <UserPlusIcon strokeWidth={2} className="h-5 w-5 " /> Янги бемор кушиш
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
                                        Add New Patient
                                    </Dialog.Title>
                                    <form onSubmit={formik.handleSubmit}>
                                        <div className="mt-2">
                                            <div className="grid grid-cols-3 gap-4">
                                              <div>
                                                  <Input
                                                      label="ФИО: *"
                                                      size="lg"
                                                      name="name"
                                                      value={formik.values.name}
                                                      onChange={formik.handleChange}
                                                      error={formik.touched.name && formik.errors.name}
                                                      helperText={formik.touched.name && formik.errors.name ? formik.errors.name : ''}
                                                  />
                                                  {formik.touched.name && formik.errors.name && (
                                                      <Typography className="text-xs" color="red" size="xs">
                                                          {formik.errors.name}
                                                      </Typography>
                                                  )}
                                              </div>
                                                <Input
                                                    label="Иш Манзили"
                                                    size="lg"
                                                    name="work_address"
                                                    value={formik.values.work_address}
                                                    onChange={formik.handleChange}
                                                />
                                                <div>
                                                    <DateSelect
                                                        value={formik.values.birth_at}
                                                        error={formik.touched.birth_at && formik.errors.birth_at}
                                                        onChange={(date) => formik.setFieldValue('birth_at', date)}
                                                    />
                                                    {formik.touched.birth_at && formik.errors.birth_at && (
                                                        <Typography className="text-xs" color="red" size="xs">
                                                            {formik.errors.birth_at}
                                                        </Typography>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="mt-4 grid grid-cols-3 gap-4">
                                                <LocationSelect
                                                    label="District"
                                                    onChange={(selectedValues) => formik.setFieldValue('district_id', selectedValues.district_id)}
                                                />
                                                <DoctorsSelect
                                                    label="Ким йуборилди"
                                                    onChange={(partnerId) => formik.setFieldValue('partner_id', partnerId)}
                                                />
                                            </div>
                                            <div className="mt-4 grid grid-cols-3 gap-4">
                                                <Input
                                                    label="Касби:"
                                                    size="lg"
                                                    name="profession"
                                                    value={formik.values.profession}
                                                    onChange={formik.handleChange}
                                                />
                                               <div>
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
                                               </div>
                                                <Input
                                                    label="Яшаш манзили"
                                                    size="lg"
                                                    name="home_address"
                                                    value={formik.values.home_address}
                                                    onChange={formik.handleChange}
                                                    error={formik.touched.home_address && formik.errors.home_address}
                                                    helperText={formik.touched.home_address && formik.errors.home_address ? formik.errors.home_address : ''}
                                                />
                                            </div>
                                            <div className="mt-4 grid grid-cols-3 gap-4">
                                                <Radio
                                                    name="gender"
                                                    value="men"
                                                    checked={formik.values.gender === 'men'}
                                                    onChange={() => formik.setFieldValue('gender', 'men')}
                                                    label="Еркак"
                                                />
                                                <Radio
                                                    name="gender"
                                                    value="women"
                                                    checked={formik.values.gender === 'women'}
                                                    onChange={() => formik.setFieldValue('gender', 'women')}
                                                    label="Айол"
                                                />
                                                <Input
                                                    label="ПИНФЛ:"
                                                    size="lg"
                                                    name="pinfl"
                                                    value={formik.values.pinfl}
                                                    onChange={formik.handleChange}
                                                    error={formik.touched.pinfl && formik.errors.pinfl}
                                                    helperText={formik.touched.pinfl && formik.errors.pinfl ? formik.errors.pinfl : ''}
                                                />
                                            </div>
                                            <div className="mt-4 flex gap-4">
                                                <Textarea
                                                    label="Исох:"
                                                    fullWidth
                                                    name="remark"
                                                    value={formik.values.remark}
                                                    onChange={formik.handleChange}
                                                />
                                                <Dropzone onFilesChange={(file) => formik.setFieldValue('file', file)} />
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <Button type="submit" variant="gradient" fullWidth>
                                                Save
                                            </Button>
                                        </div>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}


