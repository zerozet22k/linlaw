"use client";

import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Spin,
  Switch,
  message,
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

import apiClient from "@/utils/api/apiClient";
import LanguageJsonTextInput from "@/components/inputs/standalone/LanguageJsonTextInput";
import LanguageJsonTextarea from "@/components/inputs/standalone/LanguageJsonTextarea";
import type { CareerAPI } from "@/models/CareerModel";
import { EMP_TYPE_LABEL } from "@/utils/careerUtil";

type Props = {
  career?: CareerAPI;
};

const employmentTypeOptions = Object.entries(EMP_TYPE_LABEL).map(
  ([value, label]) => ({
    value,
    label,
  })
);

const salaryPeriodOptions = [
  { value: "year", label: "Year" },
  { value: "month", label: "Month" },
  { value: "day", label: "Day" },
  { value: "hour", label: "Hour" },
];

const salaryCurrencyOptions = [
  { value: "USD", label: "USD ($)" },
  { value: "THB", label: "Thai Baht (฿)" },
  { value: "MMK", label: "Myanmar Kyat (K)" },
];

const ymdRule = {
  pattern: /^\d{4}-\d{2}-\d{2}$/,
  message: "Use YYYY-MM-DD format.",
};

const renderLanguageList = (name: string, label: string) => (
  <Form.List name={name}>
    {(fields, { add, remove }) => (
      <Card
        size="small"
        title={label}
        extra={
          <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
            Add
          </Button>
        }
      >
            <Space orientation="vertical" style={{ width: "100%" }} size="middle">
          {fields.map((field) => (
            <Card
              key={field.key}
              size="small"
              extra={
                <Button
                  danger
                  type="text"
                  icon={<MinusCircleOutlined />}
                  onClick={() => remove(field.name)}
                />
              }
            >
              <Form.Item
                label="Text"
                name={[field.name, "text"]}
                style={{ marginBottom: 0 }}
              >
                <LanguageJsonTextarea />
              </Form.Item>
            </Card>
          ))}
        </Space>
      </Card>
    )}
  </Form.List>
);

const CareerForm: React.FC<Props> = ({ career }) => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const isEdit = Boolean(career?._id);

  useEffect(() => {
    if (career) {
      form.setFieldsValue({
        title: career.title ?? { en: "" },
        summary: career.summary ?? {},
        department: career.department ?? "",
        location: career.location ?? "",
        employmentType: career.employmentType,
        postedAt: career.postedAt ?? "",
        closingDate: career.closingDate ?? "",
        salary: career.salary ?? {},
        description: career.description ?? {},
        tags: career.tags ?? [],
        responsibilities: career.responsibilities ?? [],
        requirements: career.requirements ?? [],
        benefits: career.benefits ?? [],
        order: career.order ?? 0,
        isActive: career.isActive ?? true,
      });
      return;
    }

    form.resetFields();
    form.setFieldsValue({
      title: { en: "" },
      summary: {},
      description: {},
      salary: {},
      tags: [],
      responsibilities: [],
      requirements: [],
      benefits: [],
      order: 0,
      isActive: true,
    });
  }, [career, form]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const payload = {
        title: values.title ?? {},
        summary: values.summary ?? {},
        department: values.department?.trim() || "",
        location: values.location?.trim() || "",
        employmentType: values.employmentType || undefined,
        postedAt: values.postedAt?.trim() || undefined,
        closingDate: values.closingDate?.trim() || undefined,
        salary: values.salary ?? {},
        description: values.description ?? {},
        tags: values.tags ?? [],
        responsibilities: values.responsibilities ?? [],
        requirements: values.requirements ?? [],
        benefits: values.benefits ?? [],
        order: values.order ?? 0,
        isActive: values.isActive ?? true,
      };

      if (isEdit && career?._id) {
        await apiClient.put(`/careers/${career._id}`, payload);
        message.success("Career updated successfully.");
      } else {
        await apiClient.post("/careers", payload);
        message.success("Career created successfully.");
      }

      router.push("/dashboard/careers");
    } catch (error: any) {
      console.error("Career submit error:", error);
      message.error(error?.response?.data?.message || "Failed to save career.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row gutter={[0, 0]}>
      <Col xs={24}>
        <Card title={isEdit ? "Edit Career" : "Create Career"}
          styles={{ body: { padding: "16px" } }}
        >
          <Alert
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
               title="Careers are now managed as their own collection and no longer live in page settings."
          />

          <Spin spinning={loading}>
            <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
              <Row gutter={[16, 12]}>
                <Col xs={24} md={16}>
                  <Form.Item
                    label="Title"
                    name="title"
                    rules={[{ required: true, message: "Please enter a title." }]}
                  >
                    <LanguageJsonTextInput />
                  </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                  <Form.Item label="Employment Type" name="employmentType">
                    <Select
                      allowClear
                      placeholder="Select employment type"
                      options={employmentTypeOptions}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item label="Department" name="department">
                    <Input placeholder="Litigation" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item label="Location" name="location">
                    <Input placeholder="Bangkok / Remote" />
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Form.Item label="Summary" name="summary">
                    <LanguageJsonTextarea />
                  </Form.Item>
                </Col>

                <Col xs={24} md={6}>
                  <Form.Item label="Posted At" name="postedAt" rules={[ymdRule]}>
                    <Input placeholder="YYYY-MM-DD" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={6}>
                  <Form.Item label="Closing Date" name="closingDate" rules={[ymdRule]}>
                    <Input placeholder="YYYY-MM-DD" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={4}>
                  <Form.Item label="Order" name="order">
                    <InputNumber style={{ width: "100%" }} />
                  </Form.Item>
                </Col>

                <Col xs={24} md={4}>
                  <Form.Item label="Active" name="isActive" valuePropName="checked">
                    <Switch />
                  </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                  <Form.Item label="Salary Currency" name={["salary", "currency"]}>
                    <Select
                      allowClear
                      placeholder="Select currency"
                      options={salaryCurrencyOptions}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={5}>
                  <Form.Item label="Salary Min" name={["salary", "min"]}>
                    <InputNumber style={{ width: "100%" }} min={0} />
                  </Form.Item>
                </Col>

                <Col xs={24} md={5}>
                  <Form.Item label="Salary Max" name={["salary", "max"]}>
                    <InputNumber style={{ width: "100%" }} min={0} />
                  </Form.Item>
                </Col>

                <Col xs={24} md={6}>
                  <Form.Item label="Salary Period" name={["salary", "period"]}>
                    <Select
                      allowClear
                      placeholder="Period"
                      options={salaryPeriodOptions}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Form.Item label="Description" name="description">
                    <LanguageJsonTextarea />
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Form.List name="tags">
                    {(fields, { add, remove }) => (
                      <Card
                        size="small"
                        title="Tags"
                        extra={
                          <Button
                            type="dashed"
                            onClick={() => add({ value: "" })}
                            icon={<PlusOutlined />}
                          >
                            Add Tag
                          </Button>
                        }
                      >
                        <Space orientation="vertical" style={{ width: "100%" }} size="middle">
                          {fields.map((field) => (
                            <Space key={field.key} style={{ display: "flex", width: "100%" }} align="baseline">
                              <Form.Item
                                name={[field.name, "value"]}
                                rules={[{ required: true, message: "Please enter a tag." }]}
                                style={{ flex: 1, minWidth: 0, marginBottom: 0 }}
                              >
                                <Input placeholder="Corporate law" />
                              </Form.Item>
                              <Button
                                danger
                                type="text"
                                icon={<MinusCircleOutlined />}
                                onClick={() => remove(field.name)}
                              />
                            </Space>
                          ))}
                        </Space>
                      </Card>
                    )}
                  </Form.List>
                </Col>

                <Col xs={24}>{renderLanguageList("responsibilities", "Responsibilities")}</Col>
                <Col xs={24}>{renderLanguageList("requirements", "Requirements")}</Col>
                <Col xs={24}>{renderLanguageList("benefits", "Benefits")}</Col>

                <Col xs={24}>
                  <Space>
                    <Button type="primary" htmlType="submit" loading={loading}>
                      {isEdit ? "Update Career" : "Create Career"}
                    </Button>
                    <Button onClick={() => router.push("/dashboard/careers")}>
                      Cancel
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Form>
          </Spin>
        </Card>
      </Col>
    </Row>
  );
};

export default CareerForm;
