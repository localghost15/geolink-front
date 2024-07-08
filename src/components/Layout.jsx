import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Pivot as Hamburger } from 'hamburger-react'
import {
  HomeIcon,
  BellIcon,
  PowerIcon, ArrowLeftIcon,
} from "@heroicons/react/24/solid";

  import {
    IconButton,
    Badge,
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
  } from "@material-tailwind/react";
  import { logout, isLoggedIn , getUserRole } from '../services/authServices';
import ExpandedSidebar from "./ExpandedSidebar";
import {RiMenu2Line} from "react-icons/ri";
import {Button} from "antd";
import {TbArrowRampLeft3, TbArrowRampRight3} from "react-icons/tb";

const Layout = () => {
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserRole = async () => {
      const role = await getUserRole();
      setUserRole(role);
    };

    fetchUserRole();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login')
  };

  const [collapsed, setCollapsed] = useState(true);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  const [openNav, setOpenNav] = React.useState(false);
  const [toggled, setToggled] = useState(false);

  const handleCollapsedChange = () => {
    setCollapsed(!collapsed);
  };


  const handleToggleSidebar = (value) => {
    setToggled(value);
  };
    return (
        <>
        <div className="min-h-screen relative flex flex-row bg-white">
        {/*<Sidebar/>*/}
        {/*  <ExpandedSidebar*/}
        {/*      className={`app flex ${toggled ? 'toggled' : ''}`}*/}
        {/*      collapsed={collapsed}*/}
        {/*                    toggled={toggled}*/}
        {/*                    handleToggleSidebar={handleToggleSidebar}*/}
        {/*                    handleCollapsedChange={handleCollapsedChange} />*/}
          <Sidebar collapsed={collapsed}/>

  <div className="content w-full relative">
  <nav className="bg-white  border-b-[1px] border-gray-300 absolute w-full top-0 z-10 h-max max-w-full rounded-none px-4 lg:px-8">
  <div className="mx-auto max-w-full px-2 sm:px-6 lg:px-8">
    <div className="relative flex h-16 items-center justify-between">
      <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
        {/* Mobile menu button*/}
        <button
          type="button"
          className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          aria-controls="mobile-menu"
          aria-expanded="false"
        >
          <span className="absolute -inset-0.5" />
          <span className="sr-only">Open main menu</span>
          {/*
      Icon when menu is closed.

      Menu open: "hidden", Menu closed: "block"
    */}
          <svg
            className="block h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
          {/*
      Icon when menu is open.

      Menu open: "block", Menu closed: "hidden"
    */}
          <svg
            className="hidden h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
        <Button
            onClick={toggleCollapsed}
            icon={
              collapsed
                  ? <TbArrowRampRight3 size='23' />
                  : <TbArrowRampLeft3 size='23' />
            }
        />

      </div>
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
      <Menu placement="bottom-end"
      animate={{
        mount: { y: 0 },
        unmount: { y: 25 },
      }}
    >
      <Badge content="5">
      <MenuHandler >

        <button className='inline-flex h-10 animate-background-shine items-center justify-center rounded-md border border-gray-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-3 font-medium text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-50'>
          <BellIcon className="h-5 w-5" />
        </button>
      </MenuHandler>

      </Badge>
      <MenuList >
        <MenuItem>Sizda hozircha hech qanday bildirishnoma yo‘q</MenuItem>
      </MenuList>
    </Menu>
        {/* Profile dropdown */}
        <div className="relative ml-3">
          <div>
          <button className='inline-flex h-10 animate-background-shine items-center justify-center rounded-md border border-gray-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-3 font-medium text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-50' onClick={handleLogout}>
          <PowerIcon className="h-5 w-5" />
        </button>
          </div>


        </div>
      </div>
    </div>
  </div>
  {/* Mobile menu, show/hide based on menu state. */}
  <div className="sm:hidden" id="mobile-menu">
    <div className="space-y-1 px-2 pb-3 pt-2">
      {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}
      <a
        href="#"
        className="bg-gray-900 text-white block rounded-md px-3 py-2 text-base font-medium"
        aria-current="page"
      >
        Dashboard
      </a>
      <a
        href="#"
        className="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"
      >
        Team
      </a>
      <a
        href="#"
        className="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"
      >
        Projects
      </a>
      <a
        href="#"
        className="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"
      >
        Calendar
      </a>
    </div>
  </div>
</nav>
<div className="bg-white w-full h-full pt-20 md:transition-all">
  <Outlet />

</div>

  </div>
  </div>
  
        </>
    )
}

export {Layout}
