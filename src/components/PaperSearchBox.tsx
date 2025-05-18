"use client";

import { useState } from "react";
import { Form, Select, Button, Space, Flex, theme } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

export function PaperSearchBox() {
  const router = useRouter();
  const [form] = Form.useForm();
  const { token } = theme.useToken();

  const subjects = [
    { label: "Physics", value: "Physics" },
    { label: "Biology", value: "Biology" },
    { label: "Chemistry", value: "Chemistry" },
    { label: "Mathematics", value: "Mathematics" },
  ];

  const years = [
    { label: "2021", value: "2021" },
    { label: "2022", value: "2022" },
    { label: "2023", value: "2023" },
    { label: "2024", value: "2024" },
    { label: "2025", value: "2025" },
  ];

  const paperTypes = [
    { label: "MCQ", value: "MCQ" },
    { label: "Essay", value: "Essay" },
    { label: "Practical", value: "Practical" },
  ];

  const onFinish = async (values: any) => {
    const { subject, year, paperType } = values;
    // const res = await fetch(`http://localhost:3001/papers?subject=${subject}&year=${year}&type=${paperType}`);
    // const data = await res.json();
    // console.log("Received data:", data);
    router.push(`/papers/${subject?.toLowerCase()}/${year}/${paperType?.toLowerCase()}`);


  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      layout="inline"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        width: "100%",
        margin: "auto",
        backgroundColor: token.colorBgContainer,
      }}
    >
      <Space wrap size={24}>
        <Form.Item name="subject" rules={[{ required: true, message: "Please select a subject" }]}>
          <Select
            showSearch
            placeholder="Select a subject"
            options={subjects}
            style={{ width: 200 }}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>
        <Form.Item name="year" rules={[{ required: true, message: "Please select a year" }]}>
          <Select
            showSearch
            placeholder="Select year"
            options={years}
            style={{ width: 200 }}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>
        <Form.Item
          name="paperType"
          rules={[{ required: true, message: "Please select a paper type" }]}
        >
          <Select
            showSearch
            placeholder="Select Exam type"
            options={paperTypes}
            style={{ width: 200 }}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            icon={<ArrowRightOutlined />}
            className="flex items-center justify-center"
          >
            Search Papers
          </Button>
        </Form.Item>
      </Space>
    </Form>
  );
}
