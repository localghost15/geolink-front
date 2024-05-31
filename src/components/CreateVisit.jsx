import React, {useEffect, useState} from 'react';
import {Button, Dialog, Drawer, IconButton, Typography} from "@material-tailwind/react";
import {ClipboardDocumentCheckIcon} from "@heroicons/react/24/solid";
import Select from "react-select";
import axiosInstance from "../axios/axiosInstance";
import toast from "react-hot-toast";

const CreateVisit = ({patientId, mostRecentVisit, setMostRecentVisit }) => {
    const [openVisit, setOpenVisit] = React.useState(false);
    const [primaryServices, setPrimaryServices] = useState([]);
    const [doctorId, setDoctorId] = useState('');
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const openDrawer = () => setOpenVisit((cur) => !cur);
    const closeDrawer = () => setOpenVisit(false);
    const [selectedService, setSelectedService] = useState(null);

    useEffect(() => {
        fetchDoctors();
    }, []);

    useEffect(() => {
        fetchServices();
    }, []);

    // Функция для получения всех услуг
    const fetchServices = async () => {
        try {
            const response = await axiosInstance.get("/admin/service?primary=1");
            // Фильтруем услуги, где primary === 1
            const primaryServices = response.data.data.filter(service => service.primary === 1);
            // Сохраняем отфильтрованные услуги
            setPrimaryServices(response.data.data);
        } catch (error) {
            console.error("Ошибка при получении списка услуг:", error);
        }
    };

    const handleNewVisitSubmit = async () => {
        try {
            const response = await axiosInstance.post(`/visit?patient_id=${patientId}&doctor_id=${selectedDoctor.value}&service_id=${selectedService.value}`);
            console.log("New visit created:", response.data);
            setOpenVisit(false);
            toast.success('Visit created successfully');
            // Update mostRecentVisit here
            setMostRecentVisit(response.data); // Обновляем mostRecentVisit с новыми данными
        } catch (error) {
            console.error("Error creating new visit:", error);
        }
    };


    const handleServiceSelect = (selectedOption) => {
        setSelectedService(selectedOption);
    };

    const handleDoctorIdChange = (event) => {
        setDoctorId(event.target.value);
    };

    const fetchDoctors = async () => {
        try {
            const response = await axiosInstance.get("/admin/users");
            const doctorUsers = response.data.data.filter(user => user.roles.includes('doctor'));
            setDoctors(doctorUsers);
        } catch (error) {
            console.error("Ошибка при получении списка врачей:", error);
        }
    };


    return (
        <div>
            <Button fullWidth onClick={openDrawer} className='flex  gap-x-1 my-2'><ClipboardDocumentCheckIcon
                className='w-4 h-4'/> қабулга қўшиш</Button>
            <Dialog open={openVisit} handler={openDrawer} className="p-4 z-[999999]">
                <div className="mb-6 flex items-center justify-between">
                    <Typography variant="h5" color="blue-gray" className="capitalize">
                        қабулга қўшиш
                    </Typography>
                    <IconButton variant="text" color="blue-gray" onClick={closeDrawer}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="h-5 w-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </IconButton>
                </div>
                <Select
                    options={primaryServices.map(service => ({value: service.id, label: service.name}))}
                    value={selectedService}
                    onChange={handleServiceSelect}
                    placeholder="Выберите услугу..."
                    className="mb-3"
                />
                {doctors.length > 0 ? (
                    <Select
                        options={doctors.map(doctor => ({value: doctor.id, label: doctor.name}))}
                        value={selectedDoctor}
                        onChange={(selectedOption) => setSelectedDoctor(selectedOption)}
                        placeholder="Доктор"
                    />
                ) : (
                    <p>Нет доступных докторов</p>
                )}
                <div className="px-4 py-3 sm:grid sm:grid-cols-1 sm:gap-4 sm:px-0">
                    <Button onClick={handleNewVisitSubmit}>Янги қабул қушиш</Button>
                </div>
            </Dialog>
        </div>
    );
};

export default CreateVisit;
