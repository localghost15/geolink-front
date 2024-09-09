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
import {FaBell, FaUserFriends} from "react-icons/fa";
import {LuLogOut, LuPanelLeftClose, LuPanelLeftOpen} from "react-icons/lu";
import {IoPeopleCircle} from "react-icons/io5";
import {VscLayoutActivitybarLeft, VscLayoutSidebarLeft} from "react-icons/vsc";

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
        <div className="max-h-[90vh] relative flex flex-row bg-white">
        {/*<Sidebar/>*/}
        {/*  <ExpandedSidebar*/}
        {/*      className={`app flex ${toggled ? 'toggled' : ''}`}*/}
        {/*      collapsed={collapsed}*/}
        {/*                    toggled={toggled}*/}
        {/*                    handleToggleSidebar={handleToggleSidebar}*/}
        {/*                    handleCollapsedChange={handleCollapsedChange} />*/}
          <Sidebar collapsed={collapsed}/>

            <div className="content w-full relative">

                <div className="border-b bg-white border-border px-4">
                    <nav class="uk-navbar" uk-navbar="">
                        <div class="uk-navbar-left gap-x-4 lg:gap-x-6">
                            <div class="uk-navbar-item w-[200px]">
                                <button className="uk-button uk-button-default w-full" type="button"
                                        aria-haspopup="true">
                                    <div class="flex flex-1 items-center gap-2"><span
                                        class="relative flex h-5 w-5 shrink-0 overflow-hidden rounded-full"> <img
                                        className="aspect-square h-full w-full grayscale" alt="Alicia Koch"
                                        src="/anonym.jpg"/> </span> <span
                                        class="">Geolink Clinics</span></div>
                                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none"
                                         xmlns="http://www.w3.org/2000/svg"
                                         className="h-4 w-4 flex-none opacity-50" aria-hidden="true">
                                        <path
                                            d="M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.35753 11.9939 7.64245 11.9939 7.81819 11.8182L10.0682 9.56819Z"
                                            fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
                                    </svg>
                                </button>
                                <div class="uk-dropdown uk-drop w-[200px]"
                                     uk-dropdown="mode: click; pos: bottom-center">
                                    <ul class="uk-dropdown-nav uk-nav">
                                        <li className="uk-nav-header">Шахсий аккаунт</li>
                                        <li className="uk-active"><a className="uk-drop-close justify-between"
                                                                     href="#demo"
                                                                     uk-toggle=""
                                                                     role="button">
                                            <div class="flex flex-1 items-center gap-2"><span
                                                class="relative flex h-5 w-5 shrink-0 overflow-hidden rounded-full"> <img
                                                className="aspect-square h-full w-full grayscale" alt="Alicia Koch"
                                                src="/anonym.jpg"/> </span> <span class="">Geolink Clinics</span>
                                            </div>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                 viewBox="0 0 24 24" fill="none"
                                                 stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                                 stroke-linejoin="round"
                                                 className="lucide lucide-check">
                                                <path d="M20 6 9 17l-5-5"></path>
                                            </svg>
                                        </a></li>
                                        <li className="mt-3"></li>

                                    </ul>
                                </div>
                            </div>


                            <button onClick={toggleCollapsed} className="uk-button uk-button-default">
                                {
                                    collapsed
                                        ? <VscLayoutSidebarLeft   size='23'/>
                                        : <VscLayoutActivitybarLeft   size='23'/>
                                }
                            </button>

                        </div>
                        <div class="uk-navbar-right gap-x-4 lg:gap-x-6">
                            <div class="uk-navbar-item justify-end w-[150px] lg:w-[300px]">
                                <div
                                    className="border flex justify-between items-center bg-gray-100/60 hover:bg-gray-100 transition-colors rounded hover:border-gray-300 w-[70%] p-2 px-3">
                                    <div>
                                        Излаш
                                    </div>

                                    <div class="uk-text-small uk-text-muted uk-text-center">
                                         <kbd class="uk-kbd">⌘ J</kbd>
                                    </div>

                                    <uk-command key="j" uk-cloak>
                                        <a href="#" data-group="Suggestions">
    <span
        class="uk-margin-small-right"
        uk-icon="ratio: 0.8; icon: calendar"
    ></span>
                                            <span>Calendar</span>
                                        </a>
                                        <a href="#" data-group="Suggestions">
    <span
        class="uk-margin-small-right"
        uk-icon="ratio: 0.8; icon: happy"
    ></span>
                                            <span>Search Emoji</span>
                                        </a>
                                        <a data-group="Suggestions">
    <span
        class="uk-margin-small-right"
        uk-icon="ratio: 0.8; icon: git-branch"
    ></span>
                                            <span>Commits</span>
                                        </a>
                                        <a href="#" data-group="Settings">
                                            <span class="uk-margin-small-right" uk-icon="ratio: 0.8; icon: user"></span>
                                            <span>Profile</span>
                                        </a>
                                        <a href="#" data-group="Settings">
    <span
        class="uk-margin-small-right"
        uk-icon="ratio: 0.8; icon: credit-card"
    ></span>
                                            <span>Billing</span>
                                        </a>
                                        <a href="#" data-group="Settings">
                                            <span class="uk-margin-small-right" uk-icon="ratio: 0.8; icon: cog"></span>
                                            <span>Settings</span>
                                        </a>
                                    </uk-command>
                                </div>

                            </div>
                            <div class="uk-navbar-item"><a
                                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent ring-ring focus:outline-none focus-visible:ring-1"
                                href="#" role="button" aria-haspopup="true"> <span
                                class="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full"> <img
                                className="aspect-square h-full w-full" alt="@shadcn"
                                src="/anonym.jpg"/> </span> </a>
                                <div class="uk-dropdown uk-drop" uk-dropdown="mode: click; pos: bottom-right">
                                    <ul class="uk-dropdown-nav uk-nav">
                                        <li className="px-2 py-1.5 text-sm">
                                            <div class="flex flex-col space-y-1"><p
                                                class="text-sm font-medium leading-none">sveltecult</p> <p
                                                class="text-xs leading-none text-muted-foreground">
                                                leader@sveltecult.com
                                            </p></div>
                                        </li>
                                        <li className="uk-nav-divider"></li>
                                        <li><a className="uk-drop-close justify-between" href="#demo" uk-toggle=""
                                               role="button">
                                            Profile
                                            <span class="ml-auto text-xs tracking-widest opacity-60">
⇧⌘P
</span> </a></li>

                                        <li><a className="uk-drop-close justify-between" href="#demo" uk-toggle=""
                                               role="button">
                                            Settings
                                            <span class="ml-auto text-xs tracking-widest opacity-60">
⌘S
</span> </a></li>
                                        <li className="uk-nav-divider"></li>
                                        <li><a className="uk-drop-close justify-between" onClick={handleLogout}
                                               role="button">
                                            Logout
                                        </a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </nav>
                </div>

                <div className="bg-white w-full h-full pt-5 md:transition-all">
                    <Outlet/>
                </div>

            </div>
        </div>

        </>
    )
}

export {Layout}
