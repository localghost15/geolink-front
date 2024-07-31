import React from 'react';
import { Table, Button, Space, Input, Select } from 'antd';
import { SearchOutlined, SettingOutlined } from '@ant-design/icons';

const { Option } = Select;

const TableConfigurator = ({ columns, dataSource, rowKey, pagination, onConfigChange }) => {
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
    };

    const handleReset = (clearFilters) => {
        clearFilters();
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    placeholder={`Search ${dataIndex}`}
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
                        Search
                    </Button>
                    <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '',
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                // setTimeout(() => searchInput.select(), 100);
            }
        },
    });

    const enhancedColumns = columns.map(col => ({
        ...col,
        ...getColumnSearchProps(col.dataIndex),
    }));

    return (
        <div style={{ marginBottom: '16px' }}>
            <Space style={{ marginBottom: 16 }}>
                <Button
                    icon={<SettingOutlined />}
                    onClick={() => onConfigChange()}
                >
                    Configure Table
                </Button>
                <Select
                    defaultValue="10"
                    style={{ width: 120 }}
                    onChange={(value) => onConfigChange({ pagination: { pageSize: value } })}
                >
                    <Option value="10">10 rows</Option>
                    <Option value="20">20 rows</Option>
                    <Option value="50">50 rows</Option>
                    <Option value="100">100 rows</Option>
                </Select>
            </Space>
            <Table
                columns={enhancedColumns}
                dataSource={dataSource}
                rowKey={rowKey}
                pagination={pagination}
            />
        </div>
    );
};

export default TableConfigurator;


