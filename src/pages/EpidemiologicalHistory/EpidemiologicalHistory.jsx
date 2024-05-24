import React, { Fragment, useState, useEffect } from 'react'
import axios from 'axios';

import {
    MagnifyingGlassIcon,
    ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import { Dialog, Transition } from '@headlessui/react'
import { PencilIcon, EyeIcon, TrashIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import {
    Card,
    CardHeader,
    Typography,
    Button,
    CardBody,
    CardFooter,
    IconButton,
    Tooltip,
    Input
} from "@material-tailwind/react";
import EpidemiologicalList from './components/EpidemiologicalList';

const TABLE_HEAD = ["Номланиши", "Харакат"];

export default function EpidemiologicalHistory() {
    const [newName, setNewName] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [records, setRecords] = useState([]);
    const [editingRecordId, setEditingRecordId] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const axiosInstance = axios.create({
        baseURL: 'https://back.geolink.uz/api/v1'
    });

    axiosInstance.interceptors.request.use(
        config => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        error => {
            return Promise.reject(error);
        }
    );

    useEffect(() => {
        fetchRecords();
    }, []);

    const fetchRecords = async () => {
        try {
            const response = await axiosInstance.get("/epidemiological");
            setRecords(response.data.data);
        } catch (error) {
            console.error("Ошибка при получении списка эпидемии:", error);
        }
    };

    const createEpidemiologicalRecord = async () => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.post('/epidemiological', {
                name: newName
            });
            console.log(response.data);
            fetchRecords();
            closeModal();
        } catch (error) {
            console.error('Ошибка при создании записи эпидемиологической истории:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateEpidemiologicalRecord = async (recordId) => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.put(`/epidemiological/${recordId}`, {
                name: newName
            });
            console.log(response.data);
            fetchRecords();
            closeModal();
        } catch (error) {
            console.error('Ошибка при обновлении записи эпидемиологической истории:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteEpidemiologicalRecord = async (recordId) => {
        setIsLoading(true);
        try {
            await axiosInstance.delete(`/epidemiological/${recordId}`);
            fetchRecords();
        } catch (error) {
            console.error('Ошибка при удалении записи эпидемиологической истории:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const closeModal = () => {
        setIsOpen(false);
        setNewName('');
        setEditingRecordId(null);
    };

    const openModal = (record) => {
        setIsOpen(true);
        setNewName(record.name);
        setEditingRecordId(record.id);
    };

    return (
        <Card className="h-full w-full rounded-none pt-5">
            <Typography className="mx-8 mb-2" variant="h3" color="black">Эпидемиологик тарих</Typography>
            <div className="flex mx-8 justify-between gap-8">
                <label
                    className="relative  bg-white min-w-sm flex flex-col md:flex-row items-center justify-center border py-2 px-2 rounded-md gap-2  focus-within:border-gray-300"
                    htmlFor="search-bar"
                >
                    <EpidemiologicalList />
                    <input
                        id="search-bar"
                        placeholder="Қидириш"
                        className="px-8 py-1 w-full rounded-md flex-1 outline-none bg-white"
                    />
                    <Button size="md" ><MagnifyingGlassIcon className="h-5 w-5" /></Button>
                </label>
                <div className="flex items-center shrink-0 flex-col gap-2 sm:flex-row">
                    <Button onClick={openModal} className="flex h-12 items-center gap-3 normal-case font-normal" size="sm">
                        <UserPlusIcon strokeWidth={2} className="h-5 w-5 " /> Янги  қўшиш
                    </Button>
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
                                        <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                            <Dialog.Title
                                                as="h3"
                                                className="text-lg font-medium leading-6 text-gray-900"
                                            >
                                                {editingRecordId ? 'Эпидемиологик маълумотни ўзгартириш' : 'Эпидемиологик маълумот кўшиш'}
                                            </Dialog.Title>
                                            <div className="mt-2">
                                                <div className="grid grid-cols-1 gap-4">
                                                    <Input label="Хизмат номи: *" size="lg" value={newName} onChange={(e) => setNewName(e.target.value)} />
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <Button onClick={editingRecordId ? () => updateEpidemiologicalRecord(editingRecordId) : createEpidemiologicalRecord} variant="gradient" fullWidth disabled={isLoading}>
                                                    {isLoading ? 'Сақлаш...' : 'Сақлаш'}
                                                </Button>
                                            </div>
                                        </Dialog.Panel>
                                    </Transition.Child>
                                </div>
                            </div>
                        </Dialog>
                    </Transition>
                </div>
            </div>
            <CardHeader floated={false} shadow={false} className="rounded-none" />
            <CardBody className="overflow-scroll px-0">
                <table className="mt-4  w-full min-w-max table-auto text-left">
                    <thead>
                        <tr>
                            {TABLE_HEAD.map((head, index) => (
                                <th
                                    key={head}
                                    className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                                >
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                                    >
                                        {head}{" "}
                                        {index !== TABLE_HEAD.length - 1 && (
                                            <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
                                        )}
                                    </Typography>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {records.map(record => (
                            <tr key={record.id}>
                                <td className="p-4">{record.name}</td>
                                <td className="p-4">
                                    <Tooltip content="Ўзгартириш">
                                        <IconButton onClick={() => openModal(record)} variant="text">
                                            <PencilIcon className="h-4 w-4" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip content="Ўчириш">
                                        <IconButton onClick={() => deleteEpidemiologicalRecord(record.id)} variant="text">
                                            <TrashIcon className="h-4 w-4" />
                                        </IconButton>
                                    </Tooltip>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </CardBody>
            <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                <Typography variant="small" color="blue-gray" className="font-normal">
                    Сахифа 1/10
                </Typography>
                <div className="flex gap-2">
                    <Button variant="outlined" size="sm">
                        Олдинги
                    </Button>
                    <Button variant="outlined" size="sm">
                        Кейингиси
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}
