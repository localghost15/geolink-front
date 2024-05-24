// VisitPatientStartEnd.jsx

import React from 'react';

const VisitPatientStartEnd = ({ patientId, visits }) => {
    const patientVisits = visits[patientId] || [];

    return (
        <>
            <div className="overflow-x-auto bg-white dark:bg-neutral-700">
                <table className="min-w-full text-left text-sm whitespace-nowrap">
                    <thead className="uppercase tracking-wider border-b-2 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800">
                    <tr>
                        <th scope="col" className="px-6 py-4">Название визита</th>
                        <th scope="col" className="px-6 py-4">Дата и время</th>
                        <th scope="col" className="px-6 py-4">Дополнительная информация</th>
                    </tr>
                    </thead>
                    <tbody>
                    {patientVisits.map((visit, index) => (
                        <tr key={index} className="border-b dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-600">
                            <td className="px-6 py-4">{visit.id}</td>
                            <td className="px-6 py-4">{visit.visit_at}</td>
                            <td className="px-6 py-4">{visit.remark}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default VisitPatientStartEnd;



// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
//
// const VisitPatientStartEnd = ({ patientId }) => {
//     const [visits, setVisits] = useState([]);
//
//     const axiosInstance = axios.create({
//         baseURL: 'https://back.geolink.uz/api/v1'
//     });
//
//     axiosInstance.interceptors.request.use(
//         config => {
//             const token = localStorage.getItem('token');
//             if (token) {
//                 config.headers.Authorization = `Bearer ${token}`;
//             }
//             return config;
//         },
//         error => {
//             return Promise.reject(error);
//         }
//     );
//
//     useEffect(() => {
//         const fetchVisits = async () => {
//             try {
//                 const response = await axiosInstance.get(`https://back.geolink.uz/api/v1/visit`);
//                 const filteredVisits = response.data.data.filter(visit => visit.patient_id.id === patientId);
//                 setVisits(filteredVisits);
//             } catch (error) {
//                 console.error('Ошибка при получении данных о визитах:', error);
//             }
//         };
//
//         fetchVisits();
//     }, [patientId]);
//
//     return (
//         <>
//             <div className="overflow-x-auto bg-white dark:bg-neutral-700">
//                 <table className="min-w-full text-left text-sm whitespace-nowrap">
//                     <thead className="uppercase tracking-wider border-b-2 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800">
//                     <tr>
//                         <th scope="col" className="px-6 py-4">Название визита</th>
//                         <th scope="col" className="px-6 py-4">Дата и время</th>
//                         <th scope="col" className="px-6 py-4">Дополнительная информация</th>
//                     </tr>
//                     </thead>
//                     <tbody>
//                     {visits.map((visit, index) => (
//                         <tr key={index} className="border-b dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-600">
//                             <td className="px-6 py-4">{visit.id}</td>
//                             <td className="px-6 py-4">{visit.visit_at}</td>
//                             <td className="px-6 py-4">{visit.remark}</td>
//                         </tr>
//                     ))}
//                     </tbody>
//                 </table>
//             </div>
//         </>
//     );
// };
//
// export default VisitPatientStartEnd;




