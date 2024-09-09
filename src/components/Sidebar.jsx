import React, { useState } from 'react';
import {Badge, Button, Menu} from 'antd';
import {BsCalendar2WeekFill, BsFillCalendar2CheckFill} from "react-icons/bs";
import { Link } from 'react-router-dom';
import {HiUserGroup} from "react-icons/hi";
import {BanknotesIcon, ClipboardDocumentCheckIcon, RectangleStackIcon, UserGroupIcon} from "@heroicons/react/24/solid";
import {BiSolidReport} from "react-icons/bi";
import {FiLogOut} from "react-icons/fi";
import {IoIosBed} from "react-icons/io";
import {FaClinicMedical} from "react-icons/fa";

const items = [
  {
    key: '1',
    icon: <div className="sidebar-icon-bg p-2 rounded-lg"><BsCalendar2WeekFill  className="h-5 w-5 sidebar-icon"/>
    </div>,
    label: <Link to="/">Календарь</Link>,
  },
  {
    key: '2',
    icon: <div className="sidebar-icon-bg p-2 rounded-lg"><IoIosBed  className="h-5 w-5 sidebar-icon"/>
    </div>,
    label: <Link to="/apartaments">Койкалар</Link>,
  }, {
    key: '3',
    icon: <div className="sidebar-icon-bg p-2 rounded-lg"><FaClinicMedical   className="h-5 w-5 sidebar-icon"/>
    </div>,
    label: <Link to="/stationary">Стационар</Link>,
  },
  {
    key: 'sub1',
    label: 'Беморлар',
    icon: <div className="sidebar-icon-bg p-2 rounded-lg"><UserGroupIcon
        className="h-6 w-6 sidebar-icon"/></div>,
    children: [
      {
        key: '5',
        label: <Link to="/patients">Барча Беморлар</Link>,
      },
    ],
  },
  {
    key: 'sub2',
    label: 'Каталог',
    icon: <div className="sidebar-icon-bg p-2 rounded-lg"><RectangleStackIcon
        className="h-6 w-6 sidebar-icon"/></div>,
    children: [
      {
        key: '9',
        label: <Link to="/catalog/doctors">Докторлар</Link>,
      },
      {
        key: '22',
        label: <Link to="/catalog/partners">Хамкорлар</Link>,
      },
      {
        key: '10',
        label: <Link to="/catalog/services">Хизматлар</Link>,
      },
      {
        key: '11',
        label: <Link to="/catalog/epidemiological_history">Эпидемиологик тарих</Link>,
      },
      {
        key: '12',
        label: <Link to="/catalog/international-classification-of-diseases">МКБ-10</Link>,
      },
    ],
  },
  {
    key: 'sub3',
    label: 'Тўловлар',
    icon: <div className="sidebar-icon-bg p-2 rounded-lg"><BanknotesIcon
        className="h-6 w-6 sidebar-icon"/></div>,
    children: [
      {
        key: '13',
        label: <Link to="/payments/debtors">Қарздорлар рўйхати</Link>,
      },
      {
        key: '14',
        label: <Link to="/payments/history">Тўловлар тарихи</Link>,
      },
    ],
  },
  {
    key: 'sub4',
    label: 'Қабуллар',
    icon: <div className="sidebar-icon-bg p-2 rounded-lg"><ClipboardDocumentCheckIcon
        className="h-6 w-6 sidebar-icon"/></div>,
    children: [
      {
        key: '15',
        label: <Link to="/appointments/queue">Навбатда</Link>,
      },
      {
        key: '16',
        label: <Link to="/appointments/reappointments">Қайта Навбатлар</Link>,
      },
      {
        key: '17',
        label: <Link to="/appointments/followups">Қайта Қабуллар</Link>,
      },
      {
        key: '18',
        label: <Link to="/appointments/dispensary">Диспансер Хисоби</Link>,
      },
    ],
  },
  {
    key: 'sub5',
    label: 'Хисоботлар',
    icon: <div className="sidebar-icon-bg p-2 rounded-lg"><BiSolidReport
        className="h-6 w-6 sidebar-icon"/></div>,
    children: [
      {
        key: '19',
        label: <Link to="/reports/patients">Беморлар Бўйича</Link>,
      },
      {
        key: '20',
        label: <Link to="/reports/doctors">Врачлар Бўйича</Link>,
      },
      {
        key: '21',
        label: <Link to="/reports/finance">Маблағлар бўйича хисобот</Link>,
      },
    ],
  },
];

export const Sidebar = ({collapsed}) => {
  const [isCollapsed, setIsCollapsed] = useState(collapsed);
  const [selectedKey, setSelectedKey] = useState('1');

  const toggleCollapsed = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
      <div className={`sidebar  h-screen border-r  ${collapsed ? 'collapsed' : ''}`}>
        <div className="py-10 logo-container">
          <img
              className={`logo transition-opacity duration-500 ease-in-out ${collapsed ? 'opacity-0 hidden' : 'opacity-100'}`}
              src="/logomain.svg"
              alt="Logo"
          />
          {/* Logo for collapsed state */}
          <img
              className={`logo transition-opacity duration-500 ease-in-out ${collapsed ? 'opacity-100' : 'hidden  opacity-0'}`}
              src="/logo1.svg"
              alt="Logo Collapsed"
          />
        </div>
        <Menu
            style={{
              overflow: 'auto',
              position: 'sticky',
              top: 0,
            }}
            className="h-[100vh]"
            defaultSelectedKeys={['1']}
            mode="inline"
            inlineCollapsed={collapsed}
            items={items}
        />

<div className="p-3 w-full">
  <Button className="flex justify-between  flex-row-reverse items-center" icon={<FiLogOut size="20"/>} type="default" block ><span  className={`transition-opacity duration-500 ease-in-out ${collapsed ? 'opacity-0' : 'opacity-100'}`}>{collapsed ? '' : 'Тизимдан чиқиш'}</span></Button>
</div>
      </div>
  );
};

export default Sidebar;
