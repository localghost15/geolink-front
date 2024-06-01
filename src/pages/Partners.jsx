import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import { useCountries } from 'use-react-countries';
import { ChevronUpDownIcon } from '@heroicons/react/24/outline';
import { Dialog, Transition } from '@headlessui/react';
import { PencilIcon, TrashIcon, UserPlusIcon } from '@heroicons/react/24/solid';
import { Card, Typography, Button, CardBody, CardFooter, IconButton, Tooltip, Input, Menu, MenuHandler, MenuList, MenuItem } from '@material-tailwind/react';

const TABLE_HEAD = ['ID','ФИО', 'Телефон рақами', 'Харакат'];

export default function Partners() {
  const { countries } = useCountries();
  const [country, setCountry] = useState(177);
  const { name, flags, countryCallingCode } = countries[country];
  const [partners, setPartners] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [newPartnerName, setNewPartnerName] = useState('');
  const [newPartnerPhone, setNewPartnerPhone] = useState('');

  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);

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
      // Update partners list after successful deletion
      setPartners(partners.filter(partner => partner.id !== partnerId));
    } catch (error) {
      console.error('Error deleting partner:', error);
    }
  };

  const addPartner = async () => {
    try {
      const token = localStorage.getItem('token');
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
      // Update partners list with the new partner
      setPartners([...partners, response.data]);
      closeModal(); // Close the dialog after successful addition
      // Reset input values for new partner
      setNewPartnerName('');
      setNewPartnerPhone('');
      // Fetch partners again to update the list
      fetchPartners();
    } catch (error) {
      console.error('Error adding partner:', error);
    }
  };

  return (
    <Card className="h-full w-full rounded-none pt-5">
      <div className="flex mx-8 items-center justify-between gap-8">
        <Typography className="mx-8 mb-2" variant="h3" color="black">
          Барча ҳамкорлар
        </Typography>
        <div className="flex items-center shrink-0 flex-col gap-2 sm:flex-row">
          <Button onClick={openModal} className="flex h-12 items-center gap-3 normal-case font-normal" size="sm">
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
                        Хизмат кўшиш
                      </Dialog.Title>
                      <div className="mt-2">
                        <div className="grid grid-cols-1 gap-4">
                          <Input label="ФИО *" size="lg" value={newPartnerName} onChange={(e) => setNewPartnerName(e.target.value)} />
                        </div>
                        <div className="flex mt-4">
                          <Menu placement="bottom-start">
                            <MenuHandler>
                              <Button ripple={false} variant="text" color="blue-gray" className="flex h-11 items-center gap-2 rounded-md rounded-r-none border border-r-0 border-blue-gray-200 bg-blue-gray-500/10 pl-3">
                                <img src={flags.svg} alt={name} className="h-4 w-4 rounded-full object-cover" />
                                {countryCallingCode}
                              </Button>
                            </MenuHandler>
                            <MenuList className="max-h-[20rem] max-w-[18rem]">
                              {countries.map(({ name, flags, countryCallingCode }, index) => (
                                <MenuItem key={name} value={name} className="flex items-center gap-2" onClick={() => setCountry(index)}>
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
                            labelProps={{ className: "before:content-none after:content-none" }}
                            containerProps={{ className: "min-w-0" }}
                            value={newPartnerPhone}
                            onChange={(e) => setNewPartnerPhone(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <Button onClick={addPartner} variant="gradient" fullWidth>Сақлаш</Button>
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
                    {head}{' '}
                    {index !== TABLE_HEAD.length - 1 && (
                      <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
                    )}
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
                        <Typography variant="small" color="blue-gray" className="font-normal">{index+1}</Typography>
                      </div>
                    </div>
                  </td>
                  <td className={classes}>
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <Typography variant="small" color="blue-gray" className="font-normal">{name}</Typography>
                      </div>
                    </div>
                  </td>
                  <td className={classes}>
                    <div className="flex flex-col">
                      <Typography variant="small" color="blue-gray" className="font-normal">{phone}</Typography>
                    </div>
                  </td>
                  <td className={classes}>
                    <Tooltip content="Ўзгартириш">
                      <IconButton variant="text"><PencilIcon className="h-4 w-4" /></IconButton>
                    </Tooltip>
                    <Tooltip content="Ўчириш">
                      <IconButton onClick={() => deletePartner(id)} variant="text"><TrashIcon className="h-4 w-4" /></IconButton>
                    </Tooltip>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </CardBody>
      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        <Typography variant="small" color="blue-gray" className="font-normal">Саҳифа 1/10</Typography>
        <div className="flex gap-2">
          <Button variant="outlined" size="sm">Олдинги</Button>
          <Button variant="outlined" size="sm">Кейингиси</Button>
        </div>
      </CardFooter>
    </Card>
  );
}
