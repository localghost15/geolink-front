import React, { Fragment, useState } from 'react';
import { Card, Typography, Input, Button } from "@material-tailwind/react";
import { Dialog, Transition } from '@headlessui/react';
import { PlusCircleIcon, PencilIcon } from "@heroicons/react/24/solid";

const TABLE_HEAD = ["Номланиши", "Харакат"];

const TABLE_ROWS = [
  {
    name: "Doktor",
  },
  {
    name: "Hamshira",
  },
  {
    name: "Bosh shifokor",
  },
  {
    name: "Tish shifokori",
  },
];

export default function Roles() {
  const [isOpen, setIsOpen] = useState(false);
  const [newRole, setNewRole] = useState('');

  const closeModal = () => {
    setIsOpen(false);
    setNewRole('');
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const handleSave = () => {
    if (newRole.trim() !== '') {
      TABLE_ROWS.push({ name: newRole });
    }
    closeModal();
  };

  return (
    <>
      <Card className="h-full w-full overflow-scroll rounded-none">
        <div className="flex mx-8 items-center justify-between gap-8 my-5">
          <Typography variant="h3" color="black">Роллар</Typography>
          <div className="flex items-center shrink-0 flex-col gap-2 sm:flex-row">
            <Button onClick={openModal} className="flex h-12 items-center gap-3 normal-case font-normal" size="sm">
              <PlusCircleIcon strokeWidth={2} className="h-5 w-5 " /> Янги қўшиш
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
                      <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                        <Dialog.Title
                          as="h3"
                          className="text-lg font-medium leading-6 text-gray-900"
                        >
                          Роль кўшиш
                        </Dialog.Title>
                        <div className="mt-2">
                          <Input label="Номланиши: *" size="lg" value={newRole} onChange={(e) => setNewRole(e.target.value)} />
                        </div>

                        <div className="mt-4">
                          <Button onClick={handleSave} variant="gradient" fullWidth>
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

        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TABLE_ROWS.map(({ name }, index) => {
              const isLast = index === TABLE_ROWS.length - 1;
              const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

              return (
                <tr key={name}>
                  <td className={classes}>
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {name}
                    </Typography>
                  </td>

                  <td className={`${classes} bg-blue-gray-50/50`}>
                    <Typography as="a" href="#" variant="small" color="blue-gray" className="font-medium flex items-center gap-x-3">
                      <PencilIcon className="h-4 w-4" /> Ўзгартириш
                    </Typography>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </>
  );
}
