import React from 'react';
import axios from "axios";
import {
    Button, Card,
    Dialog,
} from "@material-tailwind/react";
import {DocumentArrowDownIcon} from "@heroicons/react/24/outline";
import {PrinterIcon} from "@heroicons/react/24/solid";
import toast, {Toaster} from "react-hot-toast";
const POSReceipt = ({ selectedServices, visitId }) => {
    const [open, setOpen] = React.useState(false);

    const axiosInstance = axios.create({
        baseURL: 'https://back.geolink.uz/api/v1',
    });

    axiosInstance.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    const handleOpen = () => setOpen(!open);

    const calculateTotal = () => {
        return selectedServices.reduce((total, service) => {
            return total + (service.price * quantities[service.id]);
        }, 0);
    };



    const countQuantities = () => {
        const counts = {};
        selectedServices.forEach((service) => {
            counts[service.id] = (counts[service.id] || 0) + 1;
        });
        return counts;
    };

    const quantities = countQuantities();

    // Создаем новый массив, содержащий только уникальные объекты
    const uniqueServices = selectedServices.filter((service, index) => {
        return selectedServices.findIndex((s) => s.id === service.id) === index;
    });


    const handleSubmit = () => {
        // Отправляем POST-запрос на сервер
        axiosInstance.post(`visit/service_mass/${visitId}`, {
            service: selectedServices.map(service => service.id), // Отправляем только id сервисов
            type: "cash",
            cash: 1
        })
            .then(response => {
                console.log(response.data);
                handleOpen(open);
            })
            .catch(error => {
                toast.error('Хизмат ни танланг!')
                console.error('There was an error!', error); // Обрабатываем ошибку
            });
    };


    return (
        <>
            <Button onClick={handleSubmit} size="sm" className="flex py-3 items-center gap-x-1">
                <DocumentArrowDownIcon className="w-4 h-4" /> Чекни чикариш
            </Button>
            <Dialog   animate={{
                mount: { scale: 1, y: 0 },
                unmount: { scale: 0.9, y: -100 },
            }} open={open} className="bg-transparent max-w-min shadow-none" handler={handleOpen}>
                <Card  id="invoice-POS">
                    <center id="top">
                        <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M1 17H0H1ZM7 17H6H7ZM17 27V28V27ZM27 17H28H27ZM17 0C12.4913 0 8.1673 1.79107 4.97918 4.97918L6.3934 6.3934C9.20644 3.58035 13.0218 2 17 2V0ZM4.97918 4.97918C1.79107 8.1673 0 12.4913 0 17H2C2 13.0218 3.58035 9.20644 6.3934 6.3934L4.97918 4.97918ZM0 17C0 21.5087 1.79107 25.8327 4.97918 29.0208L6.3934 27.6066C3.58035 24.7936 2 20.9782 2 17H0ZM4.97918 29.0208C8.1673 32.2089 12.4913 34 17 34V32C13.0218 32 9.20644 30.4196 6.3934 27.6066L4.97918 29.0208ZM17 34C21.5087 34 25.8327 32.2089 29.0208 29.0208L27.6066 27.6066C24.7936 30.4196 20.9782 32 17 32V34ZM29.0208 29.0208C32.2089 25.8327 34 21.5087 34 17H32C32 20.9782 30.4196 24.7936 27.6066 27.6066L29.0208 29.0208ZM34 17C34 12.4913 32.2089 8.1673 29.0208 4.97918L27.6066 6.3934C30.4196 9.20644 32 13.0218 32 17H34ZM29.0208 4.97918C25.8327 1.79107 21.5087 0 17 0V2C20.9782 2 24.7936 3.58035 27.6066 6.3934L29.0208 4.97918ZM17 6C14.0826 6 11.2847 7.15893 9.22183 9.22183L10.636 10.636C12.3239 8.94821 14.6131 8 17 8V6ZM9.22183 9.22183C7.15893 11.2847 6 14.0826 6 17H8C8 14.6131 8.94821 12.3239 10.636 10.636L9.22183 9.22183ZM6 17C6 19.9174 7.15893 22.7153 9.22183 24.7782L10.636 23.364C8.94821 21.6761 8 19.3869 8 17H6ZM9.22183 24.7782C11.2847 26.8411 14.0826 28 17 28V26C14.6131 26 12.3239 25.0518 10.636 23.364L9.22183 24.7782ZM17 28C19.9174 28 22.7153 26.8411 24.7782 24.7782L23.364 23.364C21.6761 25.0518 19.3869 26 17 26V28ZM24.7782 24.7782C26.8411 22.7153 28 19.9174 28 17H26C26 19.3869 25.0518 21.6761 23.364 23.364L24.7782 24.7782ZM28 17C28 14.0826 26.8411 11.2847 24.7782 9.22183L23.364 10.636C25.0518 12.3239 26 14.6131 26 17H28ZM24.7782 9.22183C22.7153 7.15893 19.9174 6 17 6V8C19.3869 8 21.6761 8.94821 23.364 10.636L24.7782 9.22183ZM10.3753 8.21913C6.86634 11.0263 4.86605 14.4281 4.50411 18.4095C4.14549 22.3543 5.40799 26.7295 8.13176 31.4961L9.86824 30.5039C7.25868 25.9371 6.18785 21.9791 6.49589 18.5905C6.80061 15.2386 8.46699 12.307 11.6247 9.78087L10.3753 8.21913ZM23.6247 25.7809C27.1294 22.9771 29.1332 19.6127 29.4958 15.6632C29.8549 11.7516 28.5904 7.41119 25.8682 2.64741L24.1318 3.63969C26.7429 8.20923 27.8117 12.1304 27.5042 15.4803C27.2001 18.7924 25.5372 21.6896 22.3753 24.2191L23.6247 25.7809Z"
                                fill="black"/>
                        </svg>
                        <div className="info-logo">
                            <h2 className="font-bold">Geolink Clinic</h2>
                        </div>
                        {/*End Info*/}
                    </center>
                    {/*End InvoiceTop*/}
                    <div id="mid">
                        <div className="info text-center">
                            <h2>Богланиш малумот</h2>
                            <p>
                                Манзил : Бухоро, Мустакиллик 31 кучаси
                                <br/>
                                Phone : 555-555-5555
                                <br/>
                            </p>
                        </div>
                    </div>
                    {/*End Invoice Mid*/}
                    <div id="bot">
                        <div id="table">
                            <table>
                                <tbody>
                                <tr className="tabletitle">
                                    <td className="item">
                                        <h2>Хизмат</h2>
                                    </td>
                                    <td className="Hours">
                                        <h2>Сони</h2>
                                    </td>
                                    <td className="Rate">
                                        <h2>Нархи</h2>
                                    </td>
                                </tr>
                                {uniqueServices.map((service, index) => (
                                    <tr className="service" key={index}>
                                        <td className="tableitem">
                                            <p className="itemtext">{service.name}</p>
                                        </td>
                                        <td className="tableitem">
                                            <p className="itemtext">{quantities[service.id]}</p>
                                        </td>
                                        <td className="tableitem">
                                            <p className="itemtext">{(service.price * quantities[service.id]).toFixed(2)} сўм</p>
                                        </td>
                                    </tr>
                                ))}
                                <tr className="tabletitle">
                                    <td/>
                                    <td className="Rate">
                                        <h2>Жами</h2>
                                    </td>
                                    <td className="payment">
                                        <h2>{calculateTotal().toFixed(2)} сўм</h2>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        {/*End Table*/}
                        <div id="legalcopy">
                            <p className="legal">
                                <strong>Biznesingiz uchun rahmat!</strong>&nbsp;To'lov 31 kun ichida kutilmoqda; shu
                                vaqt ichida ushbu hisob-fakturani qayta ishlang. Kechiktirilgan hisobvaraq-fakturalar
                                uchun oyiga 5% foiz undiriladi.
                            </p>
                        </div>
                        <img src="/qr.svg" className="mx-auto mt-2" width="150" height="150"/>
                    </div>
                    <Button  onClick={() => window.print()} className="flex items-center gap-x-1 justify-center"><PrinterIcon className="w-4 h-4" />Чекни чикариш</Button>

                    {/*End InvoiceBot*/}
                </Card>

            </Dialog>

            {/*End Invoice*/}
        </>

    );
};

export default POSReceipt;