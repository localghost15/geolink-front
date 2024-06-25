// PatientsUpdateDialog.js
import React, { Fragment, useState, useEffect } from 'react';
import { Button, Input, Radio, Textarea, Typography } from "@material-tailwind/react";
import { Dialog, Transition } from '@headlessui/react';
import { UserPlusIcon } from "@heroicons/react/24/solid";
import DatePicker from '../../../components/DatePicker';
import LocationSelect from '../../../components/LocationSelect';
import Dropzone from '../../../components/Dropzone';
import DoctorsSelect from './DoctorsList';
import DateSelect from "../../../components/DateSelect";

export default function PatientsUpdateDialog({ selectedPatient, onUpdatePatient }) {
    const [isOpen, setIsOpen] = useState(false);
    const [patientData, setPatientData] = useState({
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
    });

    useEffect(() => {
        if (selectedPatient) {
            setPatientData(selectedPatient);
            setIsOpen(true);
        } else {
            setPatientData({
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
            });
            setIsOpen(false);
        }
    }, [selectedPatient]);

    const closeModal = () => {
        setIsOpen(false);
    };

    const handleChange = (e) => {
        if (e.target) {
            const { name, value } = e.target;
            setPatientData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        } else {
            setPatientData((prevData) => ({
                ...prevData,
                birth_at: e,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        onUpdatePatient(patientData);
    };

    const handleLocationChange = (selectedValues) => {
        setPatientData((prevData) => ({
            ...prevData,
            ...selectedValues,
        }));
    };

    const handleDoctorChange = (partnerId) => {
        setPatientData((prevData) => ({
            ...prevData,
            partner_id: partnerId,
        }));
    };

    return (
        <>

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
                                        Update Patient
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <div className="grid grid-cols-3 gap-4">
                                            <Input label="ФИО: *" size="lg" name="name" value={patientData.name} onChange={handleChange} />
                                            <Input label="Иш манзили" size="lg" name="work_address" value={patientData.work_address} onChange={handleChange} />
                                            <DateSelect value={patientData.birth_at} onChange={(date) => handleChange(date)} />
                                        </div>
                                        <div className="mt-4 grid grid-cols-3 gap-4">
                                            <LocationSelect
                                                label="District"
                                                value={{ province_id: patientData.province_id, district_id: patientData.district_id }}
                                                onChange={handleLocationChange}
                                            />
                                            <DoctorsSelect
                                                label="Ким йуборди"
                                                value={patientData.partner_id}
                                                onChange={handleDoctorChange}
                                            />
                                        </div>
                                        <div className="mt-4 grid grid-cols-3 gap-4">
                                            <Input label="Касби:" size="lg" name="profession" value={patientData.profession} onChange={handleChange} />
                                            <Input label="Телефон раками:" size="lg" name="phone" value={patientData.phone} onChange={handleChange} />
                                            <Input label="Яшаш манзили:" size="lg" name="home_address" value={patientData.home_address} onChange={handleChange} />
                                        </div>
                                        <div className="mt-4 grid grid-cols-3 gap-4">
                                            <Radio
                                                name="gender"
                                                value="men"
                                                checked={patientData.gender === 'men'}
                                                onChange={() => handleChange({ target: { name: 'gender', value: 'men' } })}
                                                label="Еркак"
                                            />
                                            <Radio
                                                name="gender"
                                                value="female"
                                                checked={patientData.gender === 'women'}
                                                onChange={() => handleChange({ target: { name: 'gender', value: 'women' } })}
                                                label="Айол"
                                            />
                                            <Input label="ПИНФЛ:" size="lg" name="pinfl" value={patientData.pinfl} onChange={handleChange} />
                                        </div>
                                        <div className="mt-4 flex gap-4">
                                            <Textarea label="Исох:" fullWidth name="remark" value={patientData.remark} onChange={handleChange} />
                                            <Dropzone onFilesChange={(file) => setPatientData({ ...patientData, file: file })} />
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <Button className="font-medium" onClick={handleSubmit} variant="gradient" fullWidth>
                                            Узгартиришни Саклаш
                                        </Button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}
