import React, { useEffect, useState } from 'react';
import { Table, Modal } from 'antd';
import axiosInstance from "../axios/axiosInstance";

const columns = [
  {
    title: 'Рақам',
    dataIndex: 'id',
    sorter: true,
    width: '10%',
  },
  {
    title: 'Кабул ордери',
    dataIndex: 'service.name',
    render: (text, record) => {
      const serviceTypeTrueOrder = record.orders.find(order => order.service_type === true);
      return serviceTypeTrueOrder ? serviceTypeTrueOrder.id : '';
    },
    width: '30%',
  },
  {
    title: 'Сана',
    dataIndex: 'date_at',
    sorter: true,
    width: '20%',
  },
  {
    title: 'Умумий хисоб',
    dataIndex: 'total_amount',
    render: (text) => `${text} сўм`,
    sorter: true,
    width: '20%',
  },
  {
    title: 'Тўлов Холати',
    dataIndex: 'bill',
    filters: [
      {
        text: 'Кутилмоқда',
        value: 'pending',
      },
      {
        text: 'Тўланган',
        value: 'payed',
      },
    ],
    onFilter: (value, record) => record.bill.includes(value),
    width: '20%',
  },
];

export const PaymentHistoryTable = ({ patientId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
    filters: {},
  });
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [tableParams.pagination.current, tableParams.pagination.pageSize, tableParams.filters, patientId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/visit?patient_id=${patientId}&page=${tableParams.pagination.current}`);
      const uniqueVisits = removeDuplicateVisits(response.data.data);
      setData(uniqueVisits.reverse());
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          total: response.data.meta.total,
        },
      });
    } catch (error) {
      console.error('Error fetching visits:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeDuplicateVisits = (visits) => {
    const visitedIds = new Set();
    return visits.filter(visit => {
      if (visit.parent_id !== null) {
        return false; // Пропустить дочерние визиты
      }
      const uniqueKey = `${visit.id}`;
      if (visitedIds.has(uniqueKey)) {
        return false;
      }
      visitedIds.add(uniqueKey);
      return true;
    });
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
  };

  const handleRowClick = (visit) => {
    setSelectedVisit(visit);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedVisit(null);
    setModalOpen(false);
  };

  return (
      <div>
        <Table
            columns={columns}
            dataSource={data}
            pagination={tableParams.pagination}
            loading={loading}
            onChange={handleTableChange}
            onRow={(record) => ({
              onClick: () => handleRowClick(record),
            })}
            rowKey={(record) => record.id}
            filters={tableParams.filters}
        />

        <Modal
            centered
            title="Тўлов малумоти"
            visible={modalOpen}
            onCancel={handleCloseModal}
            footer={null}
        >
          {selectedVisit && (
              <div className="overflow-scroll">
                <Table
                    dataSource={selectedVisit.orders}
                    rowKey={(record) => record.id}
                    pagination={false}
                >
                  <Table.Column title="Транзакция миқдори" dataIndex="amount" key="amount" />
                  <Table.Column title="Транзакция тури" dataIndex="type" key="type" />
                  <Table.Column
                      title="Транзакция санаси"
                      dataIndex="created_at"
                      key="created_at"
                      render={(text) => new Date(text).toLocaleString()}
                  />
                </Table>
              </div>
          )}
        </Modal>
      </div>
  );
};

export default PaymentHistoryTable;
