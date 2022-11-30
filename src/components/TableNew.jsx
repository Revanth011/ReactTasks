import "./TableNew.css";
import { Table, Tag, Typography, Popconfirm, Form, Input, Button, DatePicker, Select } from 'antd';
import { useState } from "react";
import Link from "antd/es/typography/Link";
import AddTag from "./AddTag";
const { Option } = Select;

function TableNew({ tasks_data, setTasks, tagsFilter }) {
    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = useState('');
    const isEditing = (record) => record.key === editingKey;
    const [editRow, setEditingRow] = useState({});
    const [rowDate, setRowDate] = useState("");
    const [tags, setTags] = useState([]);

    const edit = async (record) => {
        setEditingRow(record);
        setEditingKey(record.key);
        form.setFieldsValue({
            timestamp: record.timestamp,
            title: record.title,
            description: record.description,
            dueDate: record.dueDate,
            tag: record.tag,
            status: record.status,
        });
    };

    const cancel = () => { setEditingKey(''); };

    const removeRow = (record) => {
        const newData = tasks_data.filter((item, i) => {
            if (item.key === record.key) return false;
            return true;
        });
        setTasks(newData);
    }

    const addTag = (tagArr) => { setTags(tagArr) }

    const columns = [
        {
            title: 'Timestamp',
            dataIndex: 'timestamp',
            editable: true,
            sorter: (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
        },
        {
            title: 'Title',
            dataIndex: 'title',
            editable: true,
            sorter: (a, b) => a.title.localeCompare(b.title),
            render: (text, record) => (
                <>
                    {
                        record.key === editingKey ?
                            <Form.Item
                                name="title"
                                rules={
                                    [
                                        {
                                            required: true,
                                            message: "title required"
                                        },
                                        ({ getFieldValue }) => (
                                            {
                                                validator(_, value) {
                                                    if (value.length > 100) {
                                                        return Promise.reject("title length exceeded, max 100 char")
                                                    }
                                                    return Promise.resolve()
                                                }
                                            }
                                        )
                                    ]
                                }

                            >
                                <Input size="default" />
                            </Form.Item>
                            : text
                    }
                </>
            )
        },
        {
            title: 'Description',
            dataIndex: 'description',
            sorter: (a, b) => a.description.localeCompare(b.description),
            editable: true,
            render: (text, record) => (
                <>
                    {
                        record.key === editingKey ?
                            <Form.Item name="description"
                                rules={
                                    [
                                        {
                                            required: true,
                                            message: "description required"
                                        },
                                        ({ getFieldValue }) => (
                                            {
                                                validator(_, value) {
                                                    if (value.length > 1000) {
                                                        return Promise.reject("description length exceeded, max 1000 char")
                                                    }
                                                    return Promise.resolve()
                                                }
                                            }
                                        )
                                    ]
                                }>
                                <Input size="default" />
                            </Form.Item>
                            : text
                    }
                </>
            )
        },
        {
            title: 'Due Date',
            dataIndex: 'dueDate',
            editable: true,
            sorter: (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
            render: (text, record) => (
                <>
                    {
                        record.key === editingKey ?
                            <DatePicker
                                disabledDate={(current) => {
                                    return current < new Date(record.timestamp);
                                }}
                                onChange={(val) => setRowDate(val.format('YYYY-MM-DD'))} />
                            : text
                    }
                </>
            )
        },
        {
            title: 'Tag',
            dataIndex: 'tag',
            filters: tagsFilter,
            render: (_, record) => (
                <>
                    {
                        record.key === editingKey ?
                            <AddTag addTag={addTag} initialTags={record.tag} />
                            :
                            record.tag.map((tag, i) => {
                                return (
                                    <Tag color="green" key={i}>
                                        {tag.toUpperCase()}
                                    </Tag>
                                );
                            })}
                </>
            ),
            onFilter: (value, record) => record.tag.some((val, i) => {
                return value === val
            })
        },
        {
            title: 'Status',
            filters: [
                {
                    text: 'OPEN',
                    value: 'OPEN',
                },
                {
                    text: 'WORKING',
                    value: 'WORKING',
                },
                {
                    text: 'DONE',
                    value: 'DONE',
                },
                {
                    text: 'OVERDUE',
                    value: 'OVERDUE',
                },
            ],
            onFilter: (value, record) => record.status.includes(value),
            dataIndex: 'status',
            editable: true,
            render: (text, record) => (
                <>
                    {
                        record.key === editingKey ?
                            <Form.Item name="status" label="Select" initialValue="OPEN">
                                <Select placeholder="Select Status" >
                                    <Option value="OPEN">OPEN</Option>
                                    <Option value="WORKING">WORKING</Option>
                                    <Option value="DONE">DONE</Option>
                                    <Option value="OVERDUE">OVERDUE</Option>
                                </Select>
                            </Form.Item>
                            : text
                    }
                </>
            ),
        },
        {
            title: 'Operation',
            dataIndex: 'operation',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Button
                            type="link"
                            htmlType="submit"
                            style={{
                                marginRight: 8,
                            }}
                        >
                            Save
                        </Button>
                        <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                            <Link>Cancel</Link>
                        </Popconfirm>
                    </span>
                ) : (
                    <>
                        <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                            Edit
                        </Typography.Link>
                        <br />
                        <Typography.Link disabled={editingKey !== ''} onClick={() => removeRow(record)}>
                            Delete
                        </Typography.Link>
                    </>
                );
            }
        }
    ];

    const onFinish = (values) => {
        const newData = [...tasks_data];
        const index = newData.findIndex((item) => editingKey === item.key);
        newData.splice(index, 1, {
            ...editRow,
            ...values,
            timestamp: new Date().toString(),
            dueDate: rowDate === "" ? editRow.dueDate : rowDate,
            tag: tags
        })
        setTasks(newData);
        setEditingKey('');
        setEditingRow({});
    }

    return (
        <div className="table">
            <Form form={form} onFinish={onFinish}>
                <Table
                    columns={columns}
                    dataSource={tasks_data}
                    pagination={{ position: ["bottomCenter"] }}
                    rowKey="key" />;
            </Form>
        </div>
    )
}

export default TableNew;