"use client";

import React, { useState } from "react";
import { Button, Modal, Form, Input, notification } from "antd";
import apiClient from "@/utils/api/apiClient";
import { getTranslatedText } from "@/utils/getTranslatedText";
import { useLanguage } from "@/hooks/useLanguage";
import { contactTranslations } from "@/translations";

const ClickToAction: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { language } = useLanguage();

  const handleSendEmail = async (values: any) => {
    setLoading(true);
    try {
      const response = await apiClient.post("/contact-us", {
        name: values.name || "",
        phone: values.phone || "",
        email: values.email,
        subject: values.subject,
        message: values.message,
      });

      if (response.status === 200) {
        notification.success({
          message: getTranslatedText(
            contactTranslations.notifSuccess,
            language
          ),
        });
        form.resetFields();
        setVisible(false);
      } else {
        throw new Error(
          response.data.error ||
            getTranslatedText(contactTranslations.notifFailure, language)
        );
      }
    } catch (error: any) {
      notification.error({
        message:
          error?.message ||
          getTranslatedText(contactTranslations.notifGenericFailure, language),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        style={{
          textAlign: "center",
          marginTop: 40,
          padding: 30,
          borderRadius: 8,
        }}
      >
        <h2 style={{ fontSize: 26, fontWeight: "bold", marginBottom: 10 }}>
          {getTranslatedText(contactTranslations.header, language)}
        </h2>
        <p style={{ fontSize: 18, lineHeight: 1.6, color: "#555" }}>
          {getTranslatedText(contactTranslations.subheader, language)}
        </p>
        <Button
          type="primary"
          size="large"
          style={{ marginTop: 10, fontSize: 18 }}
          onClick={() => setVisible(true)}
        >
          {getTranslatedText(contactTranslations.buttonLabel, language)}
        </Button>
      </div>

      <Modal
        title={getTranslatedText(contactTranslations.modalTitle, language)}
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSendEmail}>
          {/* Your Name (required) */}
          <Form.Item
            label={getTranslatedText(contactTranslations.yourName, language)}
            name="name"
            rules={[
              {
                required: true,
                message: getTranslatedText(
                  contactTranslations.yourNameRequired,
                  language
                ),
              },
            ]}
          >
            <Input />
          </Form.Item>

          {/* Your Phone Number (optional) */}
          <Form.Item
            label={getTranslatedText(
              contactTranslations.yourPhoneNumber,
              language
            )}
            name="phone"
            rules={[
              {
                pattern: /^\+?\d{7,15}$/,
                message: getTranslatedText(
                  contactTranslations.yourPhoneNumberRequired,
                  language
                ),
              },
            ]}
          >
            <Input placeholder="+66987654321" />
          </Form.Item>

          {/* Your Email (required) */}
          <Form.Item
            label={getTranslatedText(contactTranslations.yourEmail, language)}
            name="email"
            rules={[
              {
                required: true,
                message: getTranslatedText(
                  contactTranslations.yourEmailRequired,
                  language
                ),
              },
              {
                type: "email",
                message: getTranslatedText(
                  contactTranslations.yourEmailRequired,
                  language
                ),
              },
            ]}
          >
            <Input />
          </Form.Item>

          {/* Subject (required) */}
          <Form.Item
            label={getTranslatedText(contactTranslations.subject, language)}
            name="subject"
            rules={[
              {
                required: true,
                message: getTranslatedText(
                  contactTranslations.subjectRequired,
                  language
                ),
              },
            ]}
          >
            <Input />
          </Form.Item>

          {/* Message (required) */}
          <Form.Item
            label={getTranslatedText(contactTranslations.message, language)}
            name="message"
            rules={[
              {
                required: true,
                message: getTranslatedText(
                  contactTranslations.messageRequired,
                  language
                ),
              },
            ]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {getTranslatedText(contactTranslations.sendEmail, language)}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ClickToAction;
