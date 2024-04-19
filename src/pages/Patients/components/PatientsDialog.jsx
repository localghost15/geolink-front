import React, { Fragment, useState } from 'react';
import { Button, Input, Textarea } from "@material-tailwind/react";
import { Dialog, Transition } from '@headlessui/react';
import { UserPlusIcon } from "@heroicons/react/24/solid";
import DatePicker from '../../../components/DatePicker';
import LocationSelect from '../../../components/LocationSelect';
import Dropzone from '../../../components/Dropzone';

export default function PatientsDialog(props) {
    const [isOpen, setIsOpen] = useState(false);
    
    const [newPatient, setNewPatient] = useState({
        fullName: '',
        workPlace: '',
        birthDate: '',
        address: '',
        profession: '',
        country: '',
        phoneNumber: '',
        referredBy: '',
        comment: '',
        files: null,
    });

    

    const closeModal = () => {
        setIsOpen(false);
        setNewPatient({
            fullName: '',
            workPlace: '',
            birthDate: '',
            address: '',
            profession: '',
            country: '',
            phoneNumber: '',
            referredBy: '',
            comment: '',
            files: null,
        });
    };

    const openModal = () => {
        setIsOpen(true);
    };
    const handleSave = () => {
      // Проверка наличия имени пациента перед добавлением
      if (newPatient.fullName.trim() !== '') {
        console.log("New Patient:", newPatient);
          // Вызов обработчика onAddPatient с новым пациентом
          props.onAddPatient(newPatient);
      }
      closeModal();
  };
  

    return (
        <>
            <div className="inset-0 flex items-center justify-center">
                <Button onClick={openModal} className="flex h-12 items-center gap-3 normal-case font-normal" size="sm">
                    <UserPlusIcon strokeWidth={2} className="h-5 w-5 " /> Янги бемор қўшиш
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
                                        Беморни рўйхатдан ўтказиш
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <div className="grid grid-cols-3 gap-4">
                                            <Input label="ФИО: *" size="lg" value={newPatient.fullName} onChange={(e) => setNewPatient({ ...newPatient, fullName: e.target.value })} />
                                            <Input label="Иш жойи" size="lg" value={newPatient.workPlace} onChange={(e) => setNewPatient({ ...newPatient, workPlace: e.target.value })} />
                                            <DatePicker value={newPatient.birthDate} onChange={(date) => setNewPatient({ ...newPatient, birthDate: date })}  />
                                        </div>
                                        <div className="mt-4 grid grid-cols-3 gap-4">
                                            <LocationSelect value={newPatient.country} onChange={(country) => setNewPatient({ ...newPatient, country })} />
                                            <Input label="Яшаш манзили:" size="lg" value={newPatient.address} onChange={(e) => setNewPatient({ ...newPatient, address: e.target.value })} />
                                        </div>
                                        <div className="mt-4 grid grid-cols-3 gap-4">
                                            <Input label="Касби:" size="lg" value={newPatient.profession} onChange={(e) => setNewPatient({ ...newPatient, profession: e.target.value })} />
                                            <Input label="Телефон номер:" size="lg" value={newPatient.phoneNumber} onChange={(e) => setNewPatient({ ...newPatient, phoneNumber: e.target.value })} />
                                            <Input label="Ким юборди: *" size="lg" value={newPatient.referredBy} onChange={(e) => setNewPatient({ ...newPatient, referredBy: e.target.value })} />
                                        </div>
                                        <div className="mt-4 flex gap-4">
                                            <Textarea className='w-max-content' fullWidth label="Изоҳ:" value={newPatient.comment} onChange={(e) => setNewPatient({ ...newPatient, comment: e.target.value })} />
                                            <Dropzone onFilesChange={(file) => setNewPatient({ ...newPatient, files: file })} />
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <Button onClick={handleSave} variant="gradient" fullWidth>
                                            Сақлаш
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
