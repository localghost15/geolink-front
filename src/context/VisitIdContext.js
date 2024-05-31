import React, { createContext, useContext, useState, useEffect } from 'react';
import {fetchVisits} from "../services/visitService";

const VisitIdContext = createContext();

export const useVisitId = () => useContext(VisitIdContext);

export const VisitIdProvider = ({ children }) => {
    const [visitId, setVisitId] = useState(null);
    const [dataCache, setDataCache] = useState({});

    const fetchPatientVisits = async (patientId) => {
        try {
            let visitData = [];
            if (!dataCache[patientId]) {
                const fetchAllPages = async (patientId) => {
                    let allData = [];
                    let page = 1;
                    let lastPage = 1;

                    while (page <= lastPage) {
                        try {
                            const response = await fetchVisits(patientId, page);
                            const pageData = response.data.data;
                            const meta = response.data.meta;

                            allData = [...allData, ...pageData];

                            lastPage = meta.last_page; // обновляем количество страниц
                            page += 1; // переходим к следующей странице
                        } catch (error) {
                            console.error(`Ошибка при получении данных со страницы ${page}:`, error);
                            break;
                        }
                    }

                    return allData;
                };

                visitData = await fetchAllPages(patientId);

                setDataCache(prevCache => ({
                    ...prevCache,
                    [patientId]: visitData,
                }));
            } else {
                visitData = dataCache[patientId];
            }

            const recentVisit = visitData.find(visit =>
                visit.parent_id === null &&
                visit.bill === "payed" && (visit.status === "examined" || visit.status === "queue")
            );

            if (recentVisit) {
                setVisitId(recentVisit.id);
            } else {
                setVisitId(null);
            }

            return visitData;
        } catch (error) {
            console.error('Ошибка при получении данных о визитах:', error);
            return [];
        }
    };

    return (
        <VisitIdContext.Provider value={{ visitId, setVisitId, fetchPatientVisits }}>
            {children}
        </VisitIdContext.Provider>
    );
};
