import React,{ Fragment, useEffect, useState } from 'react'
import { useCountries } from "use-react-countries";
import {MagnifyingGlassIcon,ChevronUpDownIcon} from "@heroicons/react/24/outline";
  import { Dialog, Transition } from '@headlessui/react'
  import { TrashIcon, UserPlusIcon } from "@heroicons/react/24/solid";
  import {
    Card,
    CardHeader,
    Typography,
    Button,
    CardBody,
    CardFooter,
    Avatar,
    IconButton,
    Tooltip,
    Input,
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
    Textarea 
  } from "@material-tailwind/react";
import DoctorsList from './components/DoctorsList';
import RolesList from './components/RolesList';
import axios from 'axios';
 
   
  const TABLE_HEAD = ["ФИО", "Логин", "Телефон","Роль", "Харакат"];
   
  const TABLE_ROWS = [
    {
      name: "John Michael",
      login: "doctor",
      role: 'Doctor',
      phone: "901234567",
    },
    {
      name: "Alexa Liras",
      login: "nurse",
      role: 'Nurse',
      phone: "901234567",
    },
  ];
   
  export default function Doctors() {
    const { countries } = useCountries();
    const [country, setCountry] = React.useState(177);
    const { name, flags, countryCallingCode } = countries[country];
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
      fetchUsers();
    }, []);
  
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

    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get("/admin/users");
        // Фильтрация пользователей с ролью "doctor"
        const doctorUsers = response.data.data.filter(user => user.roles.includes('doctor'));
        setUsers(doctorUsers);
      } catch (error) {
        console.error("Ошибка при получении списка врачей:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    function closeModal() {
      setIsOpen(false)
    }
  
    function openModal() {
      setIsOpen(true)
    }
    return (
      <Card className="h-full w-full rounded-none pt-5">
           

        <Typography className="mx-8 mb-2" variant="h3" color="black">Докторлар</Typography>

        <div className="flex mx-8 justify-between gap-8">
        <label
    className="relative  bg-white min-w-sm flex flex-col md:flex-row items-center justify-center border py-2 px-2 rounded-md gap-2  focus-within:border-gray-300"
    htmlFor="search-bar"
  >
    <DoctorsList/>
  
    <input
      id="search-bar"
      placeholder="Қидириш"
      className="px-8 py-1 w-full rounded-md flex-1 outline-none bg-white"
    />
    <Button size="md" ><MagnifyingGlassIcon className="h-5 w-5" /></Button>
  </label>
  
  <div className="flex items-center shrink-0 flex-col gap-2 sm:flex-row">
           
  <Button onClick={openModal}  className="flex h-12 items-center gap-3 normal-case font-normal" size="sm">
                <UserPlusIcon strokeWidth={2} className="h-5 w-5 " /> Янги  қўшиш
              </Button>

              <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10 " onClose={closeModal}>
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
                <Dialog.Panel className="w-full max-w-4xl transform  rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Янги доктор киритиш
                  </Dialog.Title>
                  <div className="mt-2">
                  <div className="grid grid-cols-2 gap-4">
            <Input label="ФИО: *" size="lg" />
            <Input label="Логин" size="lg" />
            </div>
                  <div className="grid mt-4 grid-cols-2 gap-4">
            <Input label="Пароль: *" size="lg" />
            <Input label="Паролни такрорланг" size="lg" />

            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
            <RolesList/>
           <div className="flex">
           <Menu  placement="bottom-start ">
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
                  
                  <Button onClick={closeModal} variant="gradient" fullWidth>
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
             
  
        <CardHeader floated={false} shadow={false} className="rounded-none">
  
         
        </CardHeader>
        <CardBody className="overflow-scroll px-0">
        <table className="mt-4 w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                <Typography variant="small" color="blue-gray" className="flex items-center justify-between gap-2 font-normal leading-none opacity-70">
                  ФИО <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
                </Typography>
              </th>
              <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                <Typography variant="small" color="blue-gray" className="flex items-center justify-between gap-2 font-normal leading-none opacity-70">
                  Логин <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
                </Typography>
              </th>
              <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                <Typography variant="small" color="blue-gray" className="flex items-center justify-between gap-2 font-normal leading-none opacity-70">
                  Телефон <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
                </Typography>
              </th>
              <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                <Typography variant="small" color="blue-gray" className="flex items-center justify-between gap-2 font-normal leading-none opacity-70">
                  Роль <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
                </Typography>
              </th>
              <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                <Typography variant="small" color="blue-gray" className="font-normal">Харакат</Typography>
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="5" className="p-4 text-center">Loading...</td>
              </tr>
            ) : (
              users.map(({ name, login, roles, phone, email }, index) => (
                <tr key={index} className={`${index % 2 === 0 ? "bg-blue-gray-50" : "bg-white"}`}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <Typography variant="small" color="blue-gray" className="font-normal">{name}</Typography>
                        <Typography variant="small" color="blue-gray" className="font-normal opacity-70">{email}</Typography>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <Typography variant="small" color="blue-gray" className="font-normal">{login}</Typography>
                    </div>
                  </td>
                  <td className="p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal">{phone}</Typography>
                  </td>
                  <td className="p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                    {roles.map((role, index) => (
                      <Typography key={index} variant="small" color="blue-gray" className="font-normal">{role}</Typography>
                    ))}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Tooltip content="Ўчириш">
                      <IconButton variant="text">
                        <TrashIcon className="h-4 w-4" />
                      </IconButton>
                    </Tooltip>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </CardBody>
        <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
          <Typography variant="small" color="blue-gray" className="font-normal">
          Сахифа 1/10
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