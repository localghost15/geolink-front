import React,{ Fragment, useEffect, useState } from 'react'
import { useCountries } from "use-react-countries";
import {MagnifyingGlassIcon,ChevronUpDownIcon} from "@heroicons/react/24/outline";
  import { Dialog, Transition } from '@headlessui/react'
  import {PencilIcon, TrashIcon, UserPlusIcon} from "@heroicons/react/24/solid";
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
import UserList from "../Users/components/UserList";


  const TABLE_HEAD = ["ФИО", "Логин", "Телефон","Роль", "Харакат"];


export default function Doctors() {
  const { countries } = useCountries();
  const [country, setCountry] = useState(177);
  const { name, flags, countryCallingCode } = countries[country];
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    login: "",
    password: "",
    confirmPassword: "",
    roles: [],
    phone: ""
  });

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
      const doctorUsers = response.data.data.filter(user => user.roles.includes('doctor'));
      setUsers(doctorUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createUser = async (userData) => {
    setIsLoading(true);
    try {
      const newUser = { ...userData, roles: "doctor" };

      const response = await axiosInstance.post('/admin/users', newUser);
      console.log('User created:', response.data);
      setUsers([...users, response.data.data]);
      closeModal();
    } catch (error) {
      console.error('Error creating user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (userId, updatedUserData) => {
    setIsLoading(true);
    try {
      const updatedUser = { ...updatedUserData, roles: "doctor" };

      const response = await axiosInstance.put(`/admin/users/${userId}`, updatedUser);
      console.log('User updated:', response.data);

      setUsers(users.map(user => (user.id === userId ? response.data.data : user)));
      closeModal();
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    setIsLoading(true);
    try {
      await axiosInstance.delete(`/admin/users/${userId}`);
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setEditUser(null);
    setUserData({
      name: "",
      email: "",
      login: "",
      password: "",
      confirmPassword: "",
      roles: [],
      phone: ""
    });
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const openEditDialog = (user) => {
    setEditUser(user);
    setUserData({
      name: user.name,
      email: user.email,
      login: user.login,
      password: "",
      confirmPassword: "",
      roles: user.roles.map(role => ({ label: role, value: role })),
      phone: user.phone
    });
    setIsOpen(true);
  };

  return (
      <Card className="h-full w-full rounded-none pt-5">
        <Typography className="mx-8 mb-2" variant="h3" color="black">Фойдаланувчилар</Typography>
        <div className="flex mx-8 justify-between gap-8">
          <label
              className="relative  bg-white min-w-sm flex flex-col md:flex-row items-center justify-center border py-2 px-2 rounded-md gap-2  focus-within:border-gray-300"
              htmlFor="search-bar"
          >
            <DoctorsList />
            <input
                id="search-bar"
                placeholder="Қидириш"
                className="px-8 py-1 w-full rounded-md flex-1 outline-none bg-white"
            />
            <Button size="md"><MagnifyingGlassIcon className="h-5 w-5" /></Button>
          </label>
          <div className="flex items-center shrink-0 flex-col gap-2 sm:flex-row">
            <Button onClick={openModal} className="flex h-12 items-center gap-3 normal-case font-normal" size="sm">
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
                          {editUser ? "Редактирование пользователя" : "Новый пользователь"}
                        </Dialog.Title>
                        <div className="mt-2">
                          <div className="grid grid-cols-3 gap-4">
                            <Input label="ФИО: *" size="lg" value={userData.name}
                                   onChange={(e) => setUserData({ ...userData, name: e.target.value })} />
                            <Input label="Логин" size="lg" value={userData.login}
                                   onChange={(e) => setUserData({ ...userData, login: e.target.value })} />
                            <Input label="Email" size="lg" value={userData.email}
                                   onChange={(e) => setUserData({ ...userData, email: e.target.value })} />
                          </div>
                          <div className="grid mt-4 grid-cols-2 gap-4">
                            <Input label="Пароль: *" size="lg" type="password" value={userData.password}
                                   onChange={(e) => setUserData({ ...userData, password: e.target.value })} />
                            <Input label="Паролни такрорланг" size="lg" type="password" value={userData.confirmPassword}
                                   onChange={(e) => setUserData({ ...userData, confirmPassword: e.target.value })} />
                          </div>
                          <div className="mt-4 grid grid-cols-2 gap-4">
                            <div className="flex">
                              <Menu placement="bottom-start ">
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
                                        className="h-5 w-5 rounded-full object-cover"
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
                                     value={userData.phone}
                                     onChange={(e) => setUserData({ ...userData, phone: e.target.value })} />
                            </div>
                          </div>
                        </div>
                        <div className="mt-4">
                          <Button onClick={closeModal} variant="text" fullWidth>
                            Отмена
                          </Button>
                          <Button onClick={editUser ? () => updateUser(editUser.id, userData) : () => createUser(userData)} variant="gradient" fullWidth>
                            {editUser ? "Обновить" : "Сохранить"}
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
        <CardHeader floated={false} shadow={false} className="rounded-none"></CardHeader>
        <CardBody className="overflow-scroll px-0">
          <table className="mt-4 w-full min-w-max table-auto text-left">
            <thead>
            <tr>
              {TABLE_HEAD.map((header, index) => (
                  <th key={index} className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                    <Typography variant="small" color="blue-gray" className="flex items-center justify-between gap-2 font-normal leading-none opacity-70">
                      {header} <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
                    </Typography>
                  </th>
              ))}
            </tr>
            </thead>
            <tbody>
            {isLoading ? (
                <tr>
                  <td colSpan="5" className="p-4 text-center">Loading...</td>
                </tr>
            ) : (
                users.map((user, index) => (
                    <tr key={index} className={`${index % 2 === 0 ? "bg-blue-gray-50" : "bg-white"}`}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col">
                            <Typography variant="small" color="blue-gray" className="font-normal">{user.name}</Typography>
                            <Typography variant="small" color="blue-gray" className="font-normal opacity-70">{user.email}</Typography>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <Typography variant="small" color="blue-gray" className="font-normal">{user.login}</Typography>
                        </div>
                      </td>
                      <td className="p-4">
                        <Typography variant="small" color="blue-gray" className="font-normal">{user.phone}</Typography>
                      </td>
                      <td className="p-4">
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {user.roles.map((role, index) => (
                              <Typography key={index} variant="small" color="blue-gray" className="font-normal">{role}</Typography>
                          ))}
                        </Typography>
                      </td>
                      <td className="p-4">
                        <Tooltip content="Редактировать">
                          <IconButton variant="text" onClick={() => openEditDialog(user)}>
                            <PencilIcon className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip content="Удалить">
                          <IconButton variant="text" onClick={() => deleteUser(user.id)}>
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
            Страница 1/10
          </Typography>
          <div className="flex gap-2">
            <Button variant="outlined" size="sm">
              Предыдущая
            </Button>
            <Button variant="outlined" size="sm">
              Следующая
            </Button>
          </div>
        </CardFooter>
      </Card>
  );
}