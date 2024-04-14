import React, { Fragment, useState } from 'react';
import { useCountries } from "use-react-countries";
import { Input, Menu, MenuHandler, MenuList, MenuItem, Button } from "@material-tailwind/react";
import { Dialog, Transition } from '@headlessui/react';

export default function EventCalendarModal({ isOpen, onClose, onEventAdd }) {
    const { countries } = useCountries();
    const [country, setCountry] = useState(177);
    const [formData, setFormData] = useState({
        name: '',
    });
    const { name, flags, countryCallingCode } = countries[country];
    const [selectedTime, setSelectedTime] = useState('00:00');

    const handleTimeChange = (event) => {
      setSelectedTime(event.target.value);
    };
  
    const handleTimeSubmit = (event) => {
      event.preventDefault();
      console.log('Selected Time:', selectedTime);
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = () => {
        const newEvent = {
            title: formData.name,
            start: new Date(),
        };
        onEventAdd(newEvent);
        onClose && onClose();
    };

    const closeModal = () => {
        onClose && onClose();
    }

    return (
        <>
            <Transition show={isOpen} as={Fragment}>
                <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={closeModal}>
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
                                        Беморни рўйхатдан ўтказиш
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <div className="grid grid-cols-1 gap-4">
                                            <Input name="name" value={formData.name} onChange={handleChange} label="ФИО: *" size="lg" />
                                            <form className="w-full mx-auto" onSubmit={handleTimeSubmit}>

                                            <div className="relative">
                                              <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                                                <svg
                                                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                                  aria-hidden="true"
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  fill="currentColor"
                                                  viewBox="0 0 24 24"
                                                >
                                                  <path
                                                    fillRule="evenodd"
                                                    d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                                                    clipRule="evenodd"
                                                  />
                                                </svg>
                                              </div>
                                              <input
                                                type="time"
                                                id="time"
                                                className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                min="09:00"
                                                max="18:00"
                                                value={selectedTime}
                                                onChange={handleTimeChange}
                                                required
                                              />
                                            </div>
                                            </form>
                                        </div>
                                        <div className="mt-4 grid grid-cols-1 gap-4">
                                            <div className="flex">
                                                <Menu placement="bottom-start">
                                                    <MenuHandler>
                                                        <Button
                                                            ripple={false}
                                                            variant="text"
                                                            color="blue-gray"
                                                            className="flex h-11 items-center gap-2 rounded-md rounded-r-none border border-r-0 border-blue-gray-200 bg-blue-gray-500/10 pl-3"
                                                        >
                                                            <img
                                                                src={flags.svg}
                                                                alt={name}
                                                                className="h-4 w-4 rounded-full object-cover"
                                                            />
                                                            {countryCallingCode}
                                                        </Button>
                                                    </MenuHandler>
                                                    <MenuList className="max-h-[20rem] max-w-[18rem]">
                                                        {countries.map(({ name, flags, countryCallingCode }, index) => {
                                                            return (
                                                                <MenuItem
                                                                    key={name}
                                                                    value={name}
                                                                    className="flex items-center gap-2"
                                                                    onClick={() => setCountry(index)}
                                                                >
                                                                    <img
                                                                        src={flags.svg}
                                                                        alt={name}
                                                                        className="h-5 w-5 rounded object-cover"
                                                                    />
                                                                    {name} <span className="ml-auto">{countryCallingCode}</span>
                                                                </MenuItem>
                                                            );
                                                        })}
                                                    </MenuList>
                                                </Menu>
                                                <Input size="lg"
                                                    type="tel"
                                                    placeholder="Телефон номер:"
                                                    className="rounded-md rounded-l-none !border-t-blue-gray-200 focus:!border-t-gray-900"
                                                    labelProps={{
                                                        className: "before:content-none after:content-none",
                                                    }}
                                                    containerProps={{
                                                        className: "min-w-0",
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4">

                                        <Button onClick={handleSubmit} variant="gradient" fullWidth>
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
