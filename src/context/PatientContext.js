// PatientContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { fetchVisits } from '../services/visitService';

const PatientContext = createContext();

export const usePatientContext = () => useContext(PatientContext);

export const PatientProvider = ({ children }) => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Загрузка данных о пациентах
        // Здесь может быть ваш запрос к API
        // Пример:
        fetchPatients().then((data) => {
            setPatients(data);
            setLoading(false);
        });
    }, []);

    const addVisit = (patientId, visit) => {
        // Добавление нового визита к пациенту
        // Здесь может быть ваш запрос к API для создания нового визита
        // Пример:
        const updatedPatients = patients.map((patient) => {
            if (patient.id === patientId) {
                return {
                    ...patient,
                    visits: [...patient.visits, visit],
                };
            }
            return patient;
        });
        setPatients(updatedPatients);
    };

    return (
        <PatientContext.Provider value={{ patients, loading, addVisit }}>
            {children}
        </PatientContext.Provider>
    );
};

// fetchPatients и fetchVisits могут быть вашими функциями запросов к API
