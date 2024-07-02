import React, { useState } from 'react';
import {Table, Button, DatePicker, Input, Space, message} from 'antd';
import { EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import {Tooltip} from "@material-tailwind/react";
import {EyeIcon, PencilIcon, TrashIcon} from "@heroicons/react/24/solid";
import {Link} from "react-router-dom";
import {getDatesReport, getPatientReport} from "../../services/reports/reportsService";
import moment from 'moment';
import * as XLSX from "xlsx";
import {RiFileExcel2Fill} from "react-icons/ri";

const { RangePicker } = DatePicker;

const FundsReport = () => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [dateRange, setDateRange] = useState([null, null]);

    const handleShowReport = async () => {
        setLoading(true);
        try {
            const start_at = dateRange[0] ? new Date(dateRange[0]).toISOString().split('T')[0] : '';
            const end_at = dateRange[1] ? new Date(dateRange[1]).toISOString().split('T')[0] : '';
            const apiResponse = await getDatesReport(start_at, end_at);
            if (apiResponse && apiResponse.data) {
                // Добавляем ключ "key" к данным для таблицы для уникальности строк
                const dataWithKey = apiResponse.data.map((item, index) => ({ ...item, key: index + 1 }));
                setReportData(dataWithKey);
            } else {
                setReportData([]);
            }
        } catch (error) {
            console.error('Ошибка при получении данных о пациентах:', error);
        } finally {
            setLoading(false);
        }
    };


    const handleRangePickerChange = (dates) => {
        setDateRange(dates);
        // При изменении диапазона дат в RangePicker, даты сохраняются в state
    };


    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    placeholder={`Поиск по ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Поиск
                    </Button>
                    <Button
                        onClick={() => handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Сброс
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '',
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                setTimeout(() => this.searchInput && this.searchInput.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#00AA81', padding: 0, color: '#fff' }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const columns = [
        {
            title: '№',
            dataIndex: 'key',
            key: 'key',
            render: (text) => (
                <span>{text}</span>
            ),
            sorter: (a, b) => a.key - b.key,
            ...getColumnSearchProps('key'),
        },
        {
            title: 'Келган беморлар сони',
            dataIndex: 'date_at',
            key: 'date_at',
            sorter: (a, b) => a.date_at.localeCompare(b.date_at),
            ...getColumnSearchProps('date_at'),
        },
        {
            title: 'Келган беморлар сони',
            dataIndex: 'count',
            key: 'count',
            sorter: (a, b) => a.count.localeCompare(b.count),
            ...getColumnSearchProps('count'),
        },
        {
            title: 'Жами сумма',
            dataIndex: 'amount',
            key: 'amount',
            sorter: (a, b) => new Date(a.amount) - new Date(b.amount),
            ...getColumnSearchProps('amount'),
            render: (text) => `${text} сўм`,
        },
        {
            title: 'Ҳаракатлар',
            key: 'actions',
            render: (text, record) => (
                <span>
                    <Tooltip content="Малумот">
                        <Link to={`/reports/finance/${record.date_at}`}>
                            <Button type="dashed" className="rounded-full" size="sm" variant="gradient">
                                <EyeIcon className="h-4 w-4" />
                            </Button>
                        </Link>
                    </Tooltip>
                </span>
            ),
        },
    ];

    const exportToExcel = () => {
        if (reportData.length === 0) {
            message.warning('Нет данных для экспорта');
            return;
        }

        const worksheet = XLSX.utils.json_to_sheet(reportData.map(({ key, ...rest }) => rest)); // Убираем поле key
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

        // Генерация файла Excel
        XLSX.writeFile(workbook, 'BemorReport.xlsx');
    };


    const handleEdit = (key) => {
        console.log(`Редактировать запись с ключом: ${key}`);
    };

    const handleDelete = (key) => {
        console.log(`Удалить запись с ключом: ${key}`);
    };

    return (
        <div>
            <div className="px-10">
                <h1 className="text-xl font-semibold mb-3">Маблағлар бўйича ҳисобот</h1>
                <div className="flex justify-between w-full gap-2">
                    <div className="flex gap-2">
                        <RangePicker
                            className="max-h-min"
                            onChange={handleRangePickerChange}
                            value={dateRange} // Значение должно быть dateRange, а не startDate и endDate
                        />
                        <Button type="primary" onClick={handleShowReport} loading={loading}>
                            Кўрсатиш
                        </Button>
                    </div>
                    <Button type="default" className="items-center flex" icon={<RiFileExcel2Fill/>}
                            onClick={exportToExcel} disabled={reportData.length === 0}>
                        Экспорт в Excel
                    </Button>
                </div>
                <div className="report-page pt-10">
                    <Table
                        dataSource={reportData} // Use reportData instead of static data
                        columns={columns}
                        rowClassName="report-row"
                    />
                </div>
            </div>
        </div>
    )
        ;
};

export default FundsReport;
