import "./AddRow.css";
import { DatePicker, Form, Input, Select, Button } from 'antd';
import { useState } from "react";
import AddTag from "./AddTag";
import { uid } from 'uid';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

const { TextArea } = Input;
const { Option } = Select;

const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};

const dateConfig = {
    rules: [
        {
            type: 'object',
        },
    ],
};

function AddRow({ addRow }) {
    const [form] = Form.useForm();
    const [tags, setTags] = useState([]);

    const addTag = (tagArr) => { setTags(tagArr) }

    const onFinish = (values) => {
        values = {
            ...values,
            tag: tags,
            dueDate: values['dueDate'] ? values['dueDate'].format('YYYY-MM-DD') : "",
            timestamp: new Date().toString(),
            key: uid()
        };
        addRow(values);
    };

    return (
        <div className="addRow">
            <Form {...layout} name="normal_login" className="login-form"
                form={form}
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
            >
                <Form.Item label="Title" name="title"
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Please input title',
                        },
                        ({ getFieldValue }) => (

                            {

                                validator(_, value) {
                                    if (value && getFieldValue("title").length > 100) {
                                        return Promise.reject("title length exceeded, max 100 char")
                                    }
                                    return Promise.resolve()
                                }
                            }
                        )
                    ]}
                >
                    <Input size="default" placeholder="Title" />
                </Form.Item>
                <Form.Item label="Description" name="description"
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Please enter description'
                        },
                        ({ getFieldValue }) => (
                            {
                                validator(_, value) {
                                    if (value && getFieldValue("description").length > 1000) {
                                        return Promise.reject("description length exceeded, max 1000 char")
                                    }
                                    return Promise.resolve()
                                }
                            }
                        )
                    ]}>
                    <TextArea rows={4} />
                </Form.Item>
                <Form.Item label="Due Date" name="dueDate" {...dateConfig}>
                    <DatePicker disabledDate={(current) => {
                        return current && current < dayjs(new Date().toJSON().slice(0, 10));
                    }} />
                </Form.Item>
                <Form.Item label="Add Tag" name="tags" >
                    <AddTag addTag={addTag} initialTags={[]} />
                </Form.Item>
                <Form.Item name="status" label="Select" initialValue="OPEN">
                    <Select placeholder="Select Status" >
                        <Option value="OPEN">OPEN</Option>
                        <Option value="WORKING">WORKING</Option>
                        <Option value="DONE">DONE</Option>
                        <Option value="OVERDUE">OVERDUE</Option>
                    </Select>
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Add Row
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default AddRow;