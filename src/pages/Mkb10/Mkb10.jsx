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
    CardBody,
    CardFooter,
    IconButton,
    Tooltip,
    Input
} from "@material-tailwind/react";
import {Button} from "antd";
import Mkb10List from './components/Mkb10List';

const TABLE_HEAD = ["Код", "Номланиши", "Кушимча малумот"];

export default function Mkb10() {
    const [searchQuery, setSearchQuery] = useState('');

    const [records, setRecords] = useState([]);
    const [editingRecordId, setEditingRecordId] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1); // Track current page
    const [totalPages, setTotalPages] = useState(1);

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

    const fetchRecords = async (page = 1) => { 
      try {
          const response = await axiosInstance.get(`/mkb10?page=${page}`); 
          setRecords(response.data.data);
          setCurrentPage(response.data.meta.current_page); 
          setTotalPages(response.data.meta.last_page);
      } catch (error) {
          console.error("Ошибка при получении списка МКБ10:", error);
      }
  };

    const handleSearch = async () => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.get(`/mkb10?search=${searchQuery}`);
            setRecords(response.data.data);
        } catch (error) {
            console.error("МКБ10 номларини қидиришда хатолик:", error);
        } finally {
            setIsLoading(false);
        }
    };

  const handlePrevPage = () => {
    if (currentPage > 1) {
        fetchRecords(currentPage - 1);
    }
};

const handleNextPage = () => {
    if (currentPage < totalPages) {
        fetchRecords(currentPage + 1);
    }
};



    return (
        <Card className="h-full w-full rounded-none pt-5">
            <Typography className="mx-8 mb-2" variant="h5" color="black">МКБ10</Typography>
            <div className="flex mx-8 justify-between gap-8">
                <label
                    className="relative  bg-white min-w-sm flex flex-col md:flex-row items-center justify-center border py-2 px-2 rounded-md gap-2  focus-within:border-gray-300"
                    htmlFor="search-bar"
                >
                    <Mkb10List/>
                    <input
                        id="search-bar"
                        placeholder="Қидириш"
                        className="px-8 py-1 w-full rounded-md flex-1 outline-none bg-white"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button type="primary" onClick={handleSearch} size="md"><MagnifyingGlassIcon className="h-5 w-5"/></Button>
                </label>

            </div>
            <CardHeader floated={false} shadow={false} className="rounded-none"/>
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
                                <td className="p-4 text-sm">{record.code}</td>
                                <td className="p-4 text-sm">{record.name}</td>
                                <td className="p-4 text-sm">{record.additional_info ? `${record.additional_info.split(' ').slice(0, 7).join(' ')} ...` : ''}</td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </CardBody>
            <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                <Typography variant="small" color="blue-gray" className="font-normal">
                    Сахифа {currentPage}/{totalPages}
                </Typography>
                <div className="flex gap-2">
                    <Button onClick={handlePrevPage} variant="outlined" size="sm" disabled={currentPage === 1}>
                        Олдинги
                    </Button>
                    <Button onClick={handleNextPage} variant="outlined" size="sm" disabled={currentPage === totalPages}>
                        Кейингиси
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}
