import React, { Fragment, useEffect, useState } from 'react';
import {
    Card,
    CardHeader,
    Typography,
    CardBody,
    CardFooter,
} from "@material-tailwind/react";
import ListOfDisponserList from './components/ListOfDisponserList';
import { getDispensaryData } from "../../services/dispansery";
import {ChevronUpDownIcon, MagnifyingGlassIcon} from "@heroicons/react/24/solid";
import {Button} from "antd";
import ListsMenu from "../Patients/components/ListsMenu";

const TABLE_HEAD = ["ФИО", "Туғилган санаси", "Телефон номер", "Идентификатор", "Қабул куни"];

const ListOfDisponser = () => {
    const [dispensaryData, setDispensaryData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Number of items per page

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getDispensaryData();
                setDispensaryData(data.data);
            } catch (error) {
                console.error('Ошибка при получении данных о диспансере:', error);
            }
        };

        fetchData();
    }, []);

    // Calculate current items to display based on currentPage and itemsPerPage
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = dispensaryData.slice(startIndex, startIndex + itemsPerPage);

    // Handle page change
    const handlePreviousPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, Math.ceil(dispensaryData.length / itemsPerPage)));
    };

    return (
        <Card className="h-full w-full rounded-none pt-5">
            <Typography className="mx-8 mb-4" variant="h5" color="black">
                Диспансер ҳисоби
            </Typography>
            <div className="flex mx-8 justify-between gap-8">
                <label
                    className="relative bg-white min-w-sm flex flex-col md:flex-row items-center justify-center border py-2 px-2 rounded-md gap-2 focus-within:border-gray-300"
                    htmlFor="search-bar"
                >
                    <ListOfDisponserList/>
                    <input
                        id="search-bar"
                        placeholder="Қидириш"
                        className="px-8 py-1 w-full rounded-md flex-1 outline-none bg-white"
                    />
                    <Button type="primary" size="md">
                        <MagnifyingGlassIcon className="h-5 w-5"/>
                    </Button>
                </label>
            </div>

            <CardBody className="overflow-scroll px-0">
                <table className="mt-4 w-full min-w-max table-auto text-left">
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
                    {currentItems.map(({ patient, visit, service, user_id }, index) => {
                        const isLast = index === currentItems.length - 1;
                        const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                        return (
                            <tr key={patient.id}>
                                <td className={classes}>
                                    <div className="flex items-center gap-3">
                                        <div className="flex flex-col">
                                            <Typography variant="small" color="blue-gray" className="font-normal">
                                                {patient.name}
                                            </Typography>
                                        </div>
                                    </div>
                                </td>
                                <td className={classes}>
                                    <div className="flex items-center gap-3">
                                        <div className="flex flex-col">
                                            <Typography variant="small" color="blue-gray" className="font-normal">
                                                {visit.date}
                                            </Typography>
                                        </div>
                                    </div>
                                </td>
                                <td className={classes}>
                                    <div className="flex items-center gap-3">
                                        <div className="flex flex-col">
                                            <Typography variant="small" color="blue-gray" className="font-normal">
                                                {patient.phone}
                                            </Typography>
                                        </div>
                                    </div>
                                </td>
                                <td className={classes}>
                                    <div className="flex items-center gap-3">
                                        <div className="flex flex-col">
                                            <Typography variant="small" color="blue-gray" className="font-normal">
                                                {user_id.name}
                                            </Typography>
                                        </div>
                                    </div>
                                </td>
                                <td className={classes}>
                                    <div className="flex items-center gap-3">
                                        <div className="flex flex-col">
                                            <Typography variant="small" color="blue-gray" className="font-normal">
                                                {service.id}
                                            </Typography>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </CardBody>

            <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                <Typography variant="small" color="blue-gray" className="font-normal">
                    Сахифа {currentPage}/{Math.ceil(dispensaryData.length / itemsPerPage)}
                </Typography>
                <div className="flex gap-2">
                    <Button variant="outlined" size="sm" disabled={currentPage === 1} onClick={handlePreviousPage}>
                        Олдинги
                    </Button>
                    <Button variant="outlined" size="sm" disabled={currentPage === Math.ceil(dispensaryData.length / itemsPerPage)} onClick={handleNextPage}>
                        Кейингиси
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
};

export default ListOfDisponser;
