"use client";
import React, { useState } from "react";
import { Form, Input, Button, Card, message } from "antd";
import apiClient from "@/utils/api/apiClient";

const SendEmailPage: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { subject: string; message: string }) => {
    try {
      setLoading(true);
      const response = await apiClient.post("/send-emails", values);
      if (response.status === 200) {
        message.success("Emails sent successfully.");
      } else if (response.status === 207) {
        message.warning("Emails sent with some errors.");
      } else {
        message.error("Failed to send emails.");
      }
    } catch (error: any) {
      console.error("Error sending emails:", error);
      message.error("An error occurred while sending emails.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Send Emails" style={{ maxWidth: 600, margin: "0 auto" }}>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Subject"
          name="subject"
          rules={[{ required: true, message: "Please input the subject." }]}
        >
          <Input placeholder="Email subject" />
        </Form.Item>
        <Form.Item
          label="Message"
          name="message"
          rules={[{ required: true, message: "Please input the message." }]}
        >
          <Input.TextArea rows={6} placeholder="Email message" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Send Emails
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default SendEmailPage;
