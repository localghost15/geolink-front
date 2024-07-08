import React, { useState, useEffect } from 'react';
import { Table, Button, message, Spin } from 'antd';
import { FileExcelOutlined } from '@ant-design/icons';
import {getDateReport, getDoctorsReportById} from "../../services/reports/reportsService";
import * as XLSX from 'xlsx';
import { useParams, useLocation } from 'react-router-dom';

const FundsReportDetail = () => {
    const { date } = useParams();
    const location = useLocation();
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchReportDetail = async () => {
            setLoading(true);
            try {
                const response = await getDateReport(date);
                const data = response.data; // Обратите внимание на использование response.data
                if (Array.isArray(data)) {
                    // Проверка, является ли data массивом
                    const dataWithKeys = data.map((item, index) => ({ ...item, key: index + 1 }));
                    setReportData(dataWithKeys);
                } else {
                    setReportData([]);
                    message.error('Неправильный формат данных от API');
                }
            } catch (error) {
                console.error('Ошибка при получении данных о дате:', error);
                message.error('Не удалось загрузить данные');
            } finally {
                setLoading(false);
            }
        };

        fetchReportDetail();
    }, [date]);

    const exportToExcel = () => {
        if (reportData.length === 0) {
            message.warning('Нет данных для экспорта');
            return;
        }

        // Удаление ключа key при экспорте
        const worksheet = XLSX.utils.json_to_sheet(reportData.map(({ key, ...rest }) => rest));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, `Report_${date}`);
        XLSX.writeFile(workbook, `Doctor_${date}_Report.xlsx`);
    };

    const columns = [
        {
            title: '№',
            dataIndex: 'key',
            key: 'key',
            sorter: (a, b) => a.key - b.key,
        },
        {
            title: 'Имя пациента',
            dataIndex: ['patient_id', 'name'],
            key: 'patientName',
            sorter: (a, b) => a.patientName.localeCompare(b.patientName),
        },
        {
            title: 'Сумма',
            dataIndex: 'total_amount',
            key: 'total_amount',
            render: (text) => <span>{text} сўм</span>,
            sorter: (a, b) => a.total_amount - b.total_amount,
        }
    ];

    return (
        <div className="px-10">
            <div className="flex justify-between w-full gap-2 mb-4">
                <h1 className="text-xl font-semibold mb-3">Врачнинг маблағ учун хисоботи {date}</h1>
                <Button type="default" icon={<FileExcelOutlined />} onClick={exportToExcel} disabled={reportData.length === 0}>
                    Экспорт в Excel
                </Button>
            </div>
            <Spin spinning={loading}>
                <Table bordered
                       size="small"
                    dataSource={reportData}
                    columns={columns}
                    rowClassName="report-row"
                />
            </Spin>
        </div>
    );
};

export default FundsReportDetail;
