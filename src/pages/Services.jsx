import React,{ Fragment, useState } from 'react'
import {ChevronUpDownIcon,} from "@heroicons/react/24/outline";
  import { Dialog, Transition } from '@headlessui/react'
  import { PencilIcon, TrashIcon, UserPlusIcon } from "@heroicons/react/24/solid";
  import {Card, Typography, Button, CardBody, CardFooter, IconButton, Tooltip, Input, Checkbox,} from "@material-tailwind/react";

  const TABLE_HEAD = ["Номланиши", "Нархи", "Харакат"];

const TABLE_ROWS = [
  { name: "Капельница", price: "80 000" },
  { name: "Прием", price: "50 000" },
];

export default function Services() {
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);

  return (
    <Card className="h-full w-full rounded-none pt-5">
      <div className="flex items-center mx-8 justify-between gap-8">
        <Typography className="mx-2 mb-2" variant="h3" color="black">Асосий хизматлар</Typography>
        <div className="flex items-center shrink-0 flex-col gap-2 sm:flex-row">
          <Button onClick={openModal} className="flex h-12 items-center gap-3 normal-case font-normal" size="sm">
            <UserPlusIcon strokeWidth={2} className="h-5 w-5 " /> Янги  қўшиш
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
                          <Input label="Хизмат номи: *" size="lg" />
                          <Input label="Нархи: *" size="lg" />
                        </div>
                        <div className="-ml-2.5 mt-3">
                          <Checkbox label="Дастлабки қабулда кўринсин" />
                        </div>
                      </div>
                      <div className="mt-4">
                        <Button onClick={closeModal} variant="gradient" fullWidth>Сақлаш</Button>
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
                <th key={head} className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                  <Typography variant="small" color="blue-gray" className="flex items-center justify-between gap-2 font-normal leading-none opacity-70">
                    {head} {index !== TABLE_HEAD.length - 1 && (<ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />)}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TABLE_ROWS.map(({ name, price }, index) => {
              const isLast = index === TABLE_ROWS.length - 1;
              const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
              return (
                <tr key={name}>
                  <td className={classes}>
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <Typography variant="small" color="blue-gray" className="font-normal">{name}</Typography>
                      </div>
                    </div>
                  </td>
                  <td className={classes}>
                    <div className="flex flex-col">
                      <Typography variant="small" color="blue-gray" className="font-normal">{price} сум</Typography>
                    </div>
                  </td>
                  <td className={classes}>
                    <Tooltip content="Ўзгартириш">
                      <IconButton variant="text"><PencilIcon className="h-4 w-4" /></IconButton>
                    </Tooltip>
                    <Tooltip content="Ўчириш">
                      <IconButton variant="text"><TrashIcon className="h-4 w-4" /></IconButton>
                    </Tooltip>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </CardBody>
      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        <Typography variant="small" color="blue-gray" className="font-normal">Сахифа 1/10</Typography>
        <div className="flex gap-2">
          <Button variant="outlined" size="sm">Олдинги</Button>
          <Button variant="outlined" size="sm">Кейингиси</Button>
        </div>
      </CardFooter>
    </Card>
  );
}