"use client";

import React, { useState } from "react";
import { Button, Modal, Form, Input, notification } from "antd";
import apiClient from "@/utils/api/apiClient";
import { getTranslatedText } from "@/utils/getTranslatedText";
import { useLanguage } from "@/hooks/useLanguage";
import { contactUsTranslations, commonFormValidations } from "@/translations";

const ContactUsForm: React.FC = () => {
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
            contactUsTranslations.notifSuccess,
            language
          ),
        });
        form.resetFields();
        setVisible(false);
      } else {
        throw new Error(
          response.data.error ||
            getTranslatedText(contactUsTranslations.notifFailure, language)
        );
      }
    } catch (error: any) {
      notification.error({
        message:
          error?.message ||
          getTranslatedText(
            contactUsTranslations.notifGenericFailure,
            language
          ),
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
          {getTranslatedText(contactUsTranslations.header, language)}
        </h2>
        <p style={{ fontSize: 18, lineHeight: 1.6, color: "#555" }}>
          {getTranslatedText(contactUsTranslations.subheader, language)}
        </p>
        <Button
          type="primary"
          size="large"
          style={{ marginTop: 10, fontSize: 18 }}
          onClick={() => setVisible(true)}
        >
          {getTranslatedText(contactUsTranslations.buttonLabel, language)}
        </Button>
      </div>

      <Modal
        title={getTranslatedText(contactUsTranslations.modalTitle, language)}
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSendEmail}>
          {/* Name (required) */}
          <Form.Item
            label={getTranslatedText(contactUsTranslations.yourName, language)}
            name="name"
            rules={[
              {
                required: true,
                message: getTranslatedText(
                  commonFormValidations.nameRequired,
                  language
                ),
              },
            ]}
          >
            <Input />
          </Form.Item>

          {/* Phone (optional) */}
          <Form.Item
            label={getTranslatedText(
              contactUsTranslations.phoneNumber,
              language
            )}
            name="phone"
            rules={[
              {
                pattern: /^\+?\d{7,15}$/,
                message: getTranslatedText(
                  commonFormValidations.phoneValid,
                  language
                ),
              },
            ]}
          >
            <Input placeholder="+66987654321" />
          </Form.Item>

          {/* Email */}
          <Form.Item
            label={getTranslatedText(contactUsTranslations.yourEmail, language)}
            name="email"
            rules={[
              {
                required: true,
                message: getTranslatedText(
                  commonFormValidations.emailRequired,
                  language
                ),
              },
              {
                type: "email",
                message: getTranslatedText(
                  commonFormValidations.emailValid,
                  language
                ),
              },
            ]}
          >
            <Input />
          </Form.Item>

          {/* Subject */}
          <Form.Item
            label={getTranslatedText(contactUsTranslations.subject, language)}
            name="subject"
            rules={[
              {
                required: true,
                message: getTranslatedText(
                  commonFormValidations.subjectRequired,
                  language
                ),
              },
            ]}
          >
            <Input />
          </Form.Item>

          {/* Message */}
          <Form.Item
            label={getTranslatedText(contactUsTranslations.message, language)}
            name="message"
            rules={[
              {
                required: true,
                message: getTranslatedText(
                  commonFormValidations.messageRequired,
                  language
                ),
              },
            ]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {getTranslatedText(contactUsTranslations.sendEmail, language)}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ContactUsForm;
