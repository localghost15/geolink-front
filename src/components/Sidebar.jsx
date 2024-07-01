import React, { useState } from 'react';
import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import { Button, Menu } from 'antd';
import {BsCalendar2WeekFill, BsFillCalendar2CheckFill} from "react-icons/bs";
import { Link } from 'react-router-dom';
import {HiUserGroup} from "react-icons/hi";
import {BanknotesIcon, ClipboardDocumentCheckIcon, RectangleStackIcon, UserGroupIcon} from "@heroicons/react/24/solid";
import {BiSolidReport} from "react-icons/bi";

const items = [
  {
    key: '1',
    icon: <div className="sidebar-icon-bg p-2 rounded-lg"><BsFillCalendar2CheckFill className="h-5 w-5 sidebar-icon"/>
    </div>,
    label: <Link to="/">Календарь</Link>,
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

  return (
      <div className={`sidebar  ${collapsed ? 'collapsed' : ''}`}>
        <img height="60" width="60" src="/logo1.svg" />
        <Menu
            className="h-[97vh]"
            defaultSelectedKeys={['1']}
            mode="inline"
            inlineCollapsed={collapsed}
            items={items}
        />
      </div>
  );
};

export default Sidebar;
