import React from 'react'
import { Table } from 'antd';
import {
    MagnifyingGlassIcon,
    ChevronUpDownIcon,
  } from "@heroicons/react/24/outline";
  import {
    Card,CardHeader,Typography,Button,CardBody,CardFooter } from "@material-tailwind/react";

import EpidemiologicalList from '../../components/Lists/EpidemiologicalList';
import PaymentsList from './components/PaymentsList';

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
    },
    {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
    },
    {
        title: 'Action',
        dataIndex: '',
        key: 'x',
        render: () => <a>Delete</a>,
    },
];
const data = [
    {
        key: 1,
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
        description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',
    },
    {
        key: 2,
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
        description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.',
    },
    {
        key: 3,
        name: 'Not Expandable',
        age: 29,
        address: 'Jiangsu No. 1 Lake Park',
        description: 'This not expandable',
    },
    {
        key: 4,
        name: 'Joe Black',
        age: 32,
        address: 'Sydney No. 1 Lake Park',
        description: 'My name is Joe Black, I am 32 years old, living in Sydney No. 1 Lake Park.',
    },
];
   
 
   
  const TABLE_HEAD = ["ФИО","ID","Телефон номер","Услуга","Нархи","Тўланган сумма","Tўлов"];
   
  const TABLE_ROWS = [
    {
      name: "Bekzod Negmatillayev",
      id: "1231",
      phone: "+998901234567",
      service: "Капельница",
      price: "80 000",
      sum: "140 000",
      payment: "Туланган",

    },
  ];
   
  export default function Payments() {

    return (
      <Card className="h-full w-full rounded-none pt-5">
           

        <Typography className="mx-8 mb-2" variant="h3" color="black">Туловлар тарихи</Typography>

        <div className="flex mx-8 justify-between gap-8">
        <label
    className="relative  bg-white min-w-sm flex flex-col md:flex-row items-center justify-center border py-2 px-2 rounded-md gap-2  focus-within:border-gray-300"
    htmlFor="search-bar"
  >
    <PaymentsList/>
  
    <input
      id="search-bar"
      placeholder="Қидириш"
      className="px-8 py-1 w-full rounded-md flex-1 outline-none bg-white"
    />
    <Button size="md" ><MagnifyingGlassIcon className="h-5 w-5" /></Button>
  </label>
  
        </div>
             
  
        <CardHeader floated={false} shadow={false} className="rounded-none">
  
         
        </CardHeader>
        <CardBody className="overflow-scroll px-0">
            <Table
                columns={columns}
                expandable={{
                    expandedRowRender: (record) => (
                        <p
                            style={{
                                margin: 0,
                            }}
                        >
                            {record.description}
                        </p>
                    ),
                    rowExpandable: (record) => record.name !== 'Not Expandable',
                }}
                dataSource={data}
            />
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