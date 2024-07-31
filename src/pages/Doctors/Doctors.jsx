import React, { Fragment, useEffect, useState } from 'react';
import { useCountries } from "use-react-countries";
import { MagnifyingGlassIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { Dialog, Transition } from '@headlessui/react';
import {PencilIcon, RectangleStackIcon, TrashIcon, UserGroupIcon, UserPlusIcon} from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,

  CardBody,
  CardFooter,
  Tooltip,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Textarea
} from "@material-tailwind/react";
import {  Typography,Button, Input} from 'antd'
import { useFormik } from 'formik';
import * as yup from 'yup';
import DoctorsList from './components/DoctorsList';
import axios from 'axios';
import RolesList from "./components/RolesList";
import axiosInstance from "../../axios/axiosInstance";
import {BiDialpadAlt} from "react-icons/bi";

const TABLE_HEAD = [ "#","ФИО", "Логин", "Телефон", "Роль", "Харакат"];

const createValidationSchema = yup.object({
  name: yup.string().required('ФИО майдони тулдириши шарт'),
  login: yup.string().required('Логин майдони тулдириши шарт'),
  password: yup.string().required('Пароль майдони тулдириши шарт'),
  confirmPassword: yup.string()
      .oneOf([yup.ref('password'), null], 'Пароллар бир хил булиши шарт')
      .required('Паролни саклаш шарт'),
  phone: yup.string().required('Телефон раками тулдириши шарт'),
});

const editValidationSchema = yup.object({
  name: yup.string().required('ФИО майдони тулдириши шарт'),
  phone: yup.string().required('Телефон раками тулдириши шарт'),
});

export default function Doctors() {
  const { countries } = useCountries();
  const [country, setCountry] = useState(177);
  const { name, flags, countryCallingCode } = countries[country];
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const formik = useFormik({
    initialValues: {
      name: "",
      login: "",
      password: "",
      confirmPassword: "",
      roles: [],
      phone: ""
    },
    validationSchema: editUser ? editValidationSchema : createValidationSchema,
    onSubmit: (values) => {
      if (editUser) {
        updateUser(editUser.id, values);
      } else {
        createUser(values);
      }
    },
  });

  useEffect(() => {
    fetchUsers();
  }, []);


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
      const newUser = { ...userData, roles: userData.roles.length > 0 ? userData.roles[0].label : '' };

      const response = await axiosInstance.post('/admin/users', newUser);
      console.log('User created:', response.data);
      setUsers([...users, response.data.data]);
      closeModal();
    } catch (error) {
      console.error('Error creating user:', error);
      if (error.response && error.response.data && error.response.data.message) {
        // Если есть сообщение об ошибке от сервера, отобразите его
        formik.setFieldError('phone', 'Телефон ракам руйхатдан утказган');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getUpdatedFields = (original, updated) => {
    const fieldsToUpdate = {};
    for (const key in updated) {
      if (key === 'password' || key === 'confirmPassword') {
        if (updated[key]) {
          fieldsToUpdate[key] = updated[key];
        }
      } else if (original[key] !== updated[key]) {
        fieldsToUpdate[key] = updated[key];
      }
    }
    return fieldsToUpdate;
  };

  const updateUser = async (userId, updatedUserData) => {
    setIsLoading(true);
    try {
      const fieldsToUpdate = getUpdatedFields(editUser, updatedUserData);

      // Обновляем только те роли, которые были изменены
      if (updatedUserData.roles) {
        fieldsToUpdate.roles = updatedUserData.roles[0].label;
      }

      const response = await axiosInstance.put(`/admin/users/${userId}`, fieldsToUpdate);
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
    formik.resetForm();
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const openEditDialog = (user) => {
    setEditUser(user);
    formik.setValues({
      name: user.name,
      login: user.login,
      password: "",
      confirmPassword: "",
      roles: user.roles.map(role => ({ label: role, value: role })),
      phone: user.phone
    });
    setIsOpen(true);
  };

  return (
      <Card className="h-full w-full rounded-none">
        <div className=" px-10">
          <div className="flex  justify-between gap-8">
            <div className="gap-5 flex items-center ">
              <div className="p-3 bg-gray-100 rounded-md">
                <RectangleStackIcon color="#00AA81" className="w-7 h-7"/>
              </div>
              <div>
                <h1 className="text-xl font-semibold mb-2 text-black">Врачлар</h1>
                <div className="w-full flex items-center justify-between" style={{marginBottom: 16}}>
                  <Input
                      prefix={<BiDialpadAlt size="20"/>}
                      size="large"
                      placeholder="Беморни Қидириш"
                      className="ant-input rounded-md"
                      style={{width: 300}}
                  />

                </div>
              </div>
            </div>
            <div className="flex items-center shrink-0 flex-col gap-2 sm:flex-row">
              <Button type="primary" onClick={openModal}
                      className="flex items-center h-10 gap-3 normal-case font-normal">
                <UserPlusIcon strokeWidth={2} className="h-5 w-5 "/> Янги қўшиш
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
                    <div className="fixed inset-0 bg-black/25"/>
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
                        <Dialog.Panel
                            className="w-full max-w-4xl transform  rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                          <Dialog.Title
                              as="h3"
                              className="text-lg font-medium leading-6 text-gray-900"
                          >
                            {editUser ? "Доктор малумотларни Узгартириш" : "Янги доктор кушиш"}
                          </Dialog.Title>
                          <div className="mt-2">
                            <form onSubmit={formik.handleSubmit}>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Input
                                      placeholder="ФИО: *"
                                      size="lg"
                                      name="name"
                                      value={formik.values.name}
                                      onChange={formik.handleChange}
                                      error={formik.touched.name && Boolean(formik.errors.name)}
                                      helperText={formik.touched.name && formik.errors.name}
                                  />
                                  {formik.touched.name && Boolean(formik.errors.name) && (
                                      <Typography variant="small" color="red" className="mt-1">
                                        {formik.errors.name}
                                      </Typography>
                                  )}
                                </div>
                                <div>
                                  <Input
                                      placeholder="Логин"
                                      size="lg"
                                      name="login"
                                      value={formik.values.login}
                                      onChange={formik.handleChange}
                                      error={formik.touched.login && Boolean(formik.errors.login)}
                                      helperText={formik.touched.login && formik.errors.login}
                                  />
                                  {formik.touched.login && Boolean(formik.errors.name) && (
                                      <Typography variant="small" color="red" className="mt-1">
                                        {formik.errors.login}
                                      </Typography>
                                  )}
                                </div>

                              </div>
                              <div className="grid mt-4 grid-cols-2 gap-4">
                                <div>
                                  <Input
                                      placeholder="Пароль: *"
                                      size="lg"
                                      type="password"
                                      name="password"
                                      value={formik.values.password}
                                      onChange={formik.handleChange}
                                      error={formik.touched.password && Boolean(formik.errors.password)}
                                      helperText={formik.touched.password && formik.errors.password}
                                  />
                                  {formik.touched.password && Boolean(formik.errors.password) && (
                                      <Typography variant="small" color="red" className="mt-1">
                                        {formik.errors.password}
                                      </Typography>
                                  )}
                                </div>
                                <div>
                                  <Input
                                      placeholder="Паролни такрорланг"
                                      size="lg"
                                      type="password"
                                      name="confirmPassword"
                                      value={formik.values.confirmPassword}
                                      onChange={formik.handleChange}
                                      error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                                      helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                                  />
                                  {formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword) && (
                                      <Typography variant="small" color="red" className="mt-1">
                                        {formik.errors.confirmPassword}
                                      </Typography>
                                  )}
                                </div>


                              </div>
                              <div className="mt-4 grid grid-cols-2 gap-4">
                                <div>
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
                                        {countries.map(({name, flags, countryCallingCode}, index) => {
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
                                    <Input
                                        size="lg"
                                        type="tel"
                                        placeholder="Телефон раками:"
                                        className="rounded-md rounded-l-none !border-t-blue-gray-200 focus:!border-t-gray-900"
                                        labelProps={{
                                          className: "before:content-none after:content-none",
                                        }}
                                        containerProps={{
                                          className: "min-w-0",
                                        }}
                                        name="phone"
                                        value={formik.values.phone}
                                        onChange={formik.handleChange}
                                        error={formik.touched.phone && Boolean(formik.errors.phone)}
                                        helperText={formik.touched.phone && formik.errors.phone}
                                    />

                                  </div>
                                  {formik.touched.phone && Boolean(formik.errors.phone) && (
                                      <Typography variant="small" color="red" className="mt-1">
                                        {formik.errors.phone}
                                      </Typography>
                                  )}
                                </div>
                                <RolesList value={formik.values.roles}
                                           onChange={(value) => formik.setFieldValue('roles', value)}/>

                              </div>
                              <div className="mt-4 flex gap-4">
                                <Button onClick={closeModal} variant="text" fullWidth>
                                  Отмена
                                </Button>
                                <Button htmlType="submit" variant="gradient" fullWidth>
                                  {editUser ? "Узгартириш" : "Саклаш"}
                                </Button>
                              </div>
                            </form>
                          </div>
                        </Dialog.Panel>
                      </Transition.Child>
                    </div>
                  </div>
                </Dialog>
              </Transition>
            </div>
          </div>
        </div>
        <CardHeader floated={false} shadow={false} className="rounded-none"></CardHeader>
        <CardBody className="overflow-scroll px-0">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
            <tr>
              {TABLE_HEAD.map((header, index) => (
                  <th key={index}
                      className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                    <Typography variant="small" color="blue-gray"
                                className="flex items-center justify-between gap-2 font-normal leading-none opacity-70">
                      {header} <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4"/>
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
                    <tr key={index} className="bg-white">
                      <td className="p-2">
                        <div className="flex flex-col">
                          <Typography variant="small" color="blue-gray"
                                      className="font-normal">{index + 1}</Typography>
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col">
                            <Typography variant="small" color="blue-gray"
                                        className="font-normal">{user.name}</Typography>
                            <Typography variant="small" color="blue-gray"
                                        className="font-normal opacity-70">{user.email}</Typography>
                          </div>
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="flex flex-col">
                          <Typography variant="small" color="blue-gray"
                                      className="font-normal">{user.login}</Typography>
                        </div>
                      </td>
                      <td className="p-2">
                        <Typography variant="small" color="blue-gray" className="font-normal">{user.phone}</Typography>
                      </td>
                      <td className="p-2">
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {user.roles.map((role, index) => (
                              <Typography key={index} variant="small" color="blue-gray"
                                          className="font-normal">{role}</Typography>
                          ))}
                        </Typography>
                      </td>
                      <td className="p-2 space-x-1">
                        <Tooltip
                            className="border border-blue-gray-50 text-black bg-white px-4 py-3 shadow-xl shadow-black/10"
                            content="Редактировать">
                          <Button type="dashed" variant="text" onClick={() => openEditDialog(user)}>
                            <PencilIcon className="h-4 w-4"/>
                          </Button>
                        </Tooltip>
                        <Tooltip
                            className="border border-blue-gray-50 text-black bg-white px-4 py-3 shadow-xl shadow-black/10"
                            content="Удалить">
                          <Button type="dashed" variant="text" onClick={() => deleteUser(user.id)}>
                            <TrashIcon className="h-4 w-4"/>
                          </Button>
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
