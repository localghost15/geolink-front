import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import { useCountries } from 'use-react-countries';
import { ChevronUpDownIcon } from '@heroicons/react/24/outline';
import { Dialog, Transition } from '@headlessui/react';
import { PencilIcon, TrashIcon, UserPlusIcon } from '@heroicons/react/24/solid';
import { Card, Typography, CardBody, CardFooter, IconButton, Tooltip, Input, Menu, MenuHandler, MenuList, MenuItem } from '@material-tailwind/react';
import {Button} from "antd";

const TABLE_HEAD = ['ID', 'ФИО', 'Телефон рақами', 'Харакат'];

export default function Partners() {
  const { countries } = useCountries();
  const [country, setCountry] = useState(177);
  const { name, flags, countryCallingCode } = countries[country];
  const [partners, setPartners] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [newPartnerName, setNewPartnerName] = useState('');
  const [newPartnerPhone, setNewPartnerPhone] = useState('');

  const closeModal = () => {
    setIsOpen(false);
    setSelectedPartner(null);
  };

  const openModal = (mode, partner = null) => {
    setModalMode(mode);
    if (mode === 'edit' && partner) {
      setSelectedPartner(partner);
      setNewPartnerName(partner.name);
      setNewPartnerPhone(partner.phone);
    } else {
      setNewPartnerName('');
      setNewPartnerPhone('');
    }
    setIsOpen(true);
  };

  const fetchPartners = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://back.geolink.uz/api/v1/partners', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPartners(response.data.data);
    } catch (error) {
      console.error('Error fetching partners:', error);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const deletePartner = async (partnerId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://back.geolink.uz/api/v1/partners/${partnerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPartners(partners.filter((partner) => partner.id !== partnerId));
    } catch (error) {
      console.error('Error deleting partner:', error);
    }
  };

  const addOrUpdatePartner = async () => {
    const token = localStorage.getItem('token');
    try {
      if (modalMode === 'add') {
        const response = await axios.post(
            'https://back.geolink.uz/api/v1/partners',
            {
              name: newPartnerName,
              phone: newPartnerPhone,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
        );
        setPartners([...partners, response.data]);
      } else if (modalMode === 'edit' && selectedPartner) {
        await axios.put(
            `https://back.geolink.uz/api/v1/partners/${selectedPartner.id}`,
            {
              name: newPartnerName,
              phone: newPartnerPhone,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
        );
        setPartners(
            partners.map((partner) =>
                partner.id === selectedPartner.id ? { ...partner, name: newPartnerName, phone: newPartnerPhone } : partner
            )
        );
      }
      closeModal();
      fetchPartners();
    } catch (error) {
      console.error('Error adding/updating partner:', error);
    }
  };

  return (
      <Card className="h-full w-full rounded-none pt-5">
        <div className="flex mx-8 items-center justify-between gap-8">
          <Typography className="mx-8 mb-2" variant="h5" color="black">
            Барча ҳамкорлар
          </Typography>
          <div className="flex items-center shrink-0 flex-col gap-2 sm:flex-row">
            <Button type="primary" onClick={() => openModal('add')} className="flex h-10 items-center gap-3 normal-case font-normal" size="sm">
              <UserPlusIcon strokeWidth={2} className="h-5 w-5" /> Янги қўшиш
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
                      <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                        <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                          {modalMode === 'add' ? 'Хизмат кўшиш' : 'Ҳамкорни ўргатириш'}
                        </Dialog.Title>
                        <div className="mt-2">
                          <div className="grid grid-cols-1 gap-4">
                            <Input
                                label="ФИО *"
                                size="lg"
                                value={newPartnerName}
                                onChange={(e) => setNewPartnerName(e.target.value)}
                            />
                          </div>
                          <div className="flex mt-4">
                            <Menu placement="bottom-start">
                              <MenuHandler>
                                <Button
                                    ripple={false}
                                    variant="text"
                                    color="blue-gray"
                                    className="flex h-11 items-center gap-2 rounded-md rounded-r-none border border-r-0 border-blue-gray-200 bg-blue-gray-500/10 pl-3"
                                >
                                  <img src={flags.svg} alt={name} className="h-4 w-4 rounded-full object-cover" />
                                  {countryCallingCode}
                                </Button>
                              </MenuHandler>
                              <MenuList className="max-h-[20rem] max-w-[18rem]">
                                {countries.map(({ name, flags, countryCallingCode }, index) => (
                                    <MenuItem
                                        key={name}
                                        value={name}
                                        className="flex items-center gap-2"
                                        onClick={() => setCountry(index)}
                                    >
                                      <img src={flags.svg} alt={name} className="h-5 w-5 rounded object-cover" />
                                      {name} <span className="ml-auto">{countryCallingCode}</span>
                                    </MenuItem>
                                ))}
                              </MenuList>
                            </Menu>
                            <Input
                                size="lg"
                                type="tel"
                                placeholder="Телефон номер:"
                                className="rounded-md rounded-l-none !border-t-blue-gray-200 focus:!border-t-gray-900"
                                labelProps={{ className: 'before:content-none after:content-none' }}
                                containerProps={{ className: 'min-w-0' }}
                                value={newPartnerPhone}
                                onChange={(e) => setNewPartnerPhone(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          <Button onClick={addOrUpdatePartner} variant="gradient" fullWidth>
                            Сақлаш
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
                      {head}
                      {index !== TABLE_HEAD.length - 1 && <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />}
                    </Typography>
                  </th>
              ))}
            </tr>
            </thead>
            <tbody>
            {partners.map(({ id, name, phone }, index) => {
              const isLast = index === partners.length - 1;
              const classes = isLast ? 'p-2' : 'p-2 border-b border-blue-gray-50';
              return (
                  <tr key={id}>
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <Typography variant="small" color="blue-gray" className="font-normal">
                            {index + 1}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <Typography variant="small" color="blue-gray" className="font-normal">
                            {name}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="flex flex-col">
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {phone}
                        </Typography>
                      </div>
                    </td>
                    <td className={classes}>
                      <Tooltip className="border border-blue-gray-50 text-black bg-white px-4 py-3 shadow-xl shadow-black/10" content="Ўзгартириш">
                        <Button type="dashed"
                            variant="text"
                            onClick={() => openModal('edit', { id, name, phone })}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                      </Tooltip>
                      <Tooltip className="border border-blue-gray-50 text-black bg-white px-4 py-3 shadow-xl shadow-black/10" content="Ўчириш">
                        <Button type="dashed" onClick={() => deletePartner(id)} variant="text">
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </Tooltip>
                    </td>
                  </tr>
              );
            })}
            </tbody>
          </table>
        </CardBody>
        <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
          <Typography variant="small" color="blue-gray" className="font-normal">
            Саҳифа 1/10
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
