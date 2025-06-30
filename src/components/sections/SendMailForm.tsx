"use client";

import React, { useState } from "react";
import { Button, Modal, Form, Input, notification } from "antd";
import apiClient from "@/utils/api/apiClient";
import { getTranslatedText } from "@/utils/getTranslatedText";
import { useLanguage } from "@/hooks/useLanguage";
import { sendMailTranslations, commonFormValidations } from "@/translations";

const SendMailForm: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { language } = useLanguage();

  const handleSendEmail = async (values: any) => {
    setLoading(true);
    try {
      const response = await apiClient.post("/contact-us", {
        email: values.email,
        subject: values.subject,
        message: values.message,
      });

      if (response.status === 200) {
        notification.success({
          message: getTranslatedText(
            sendMailTranslations.notifSuccess,
            language
          ),
        });
        form.resetFields();
        setVisible(false);
      } else {
        throw new Error(
          response.data.error ||
            getTranslatedText(sendMailTranslations.notifFailure, language)
        );
      }
    } catch (error: any) {
      notification.error({
        message:
          error?.message ||
          getTranslatedText(sendMailTranslations.notifGenericFailure, language),
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
          marginTop: "40px",
          padding: "30px",

          borderRadius: "8px",
        }}
      >
        <h2
          style={{ fontSize: "26px", fontWeight: "bold", marginBottom: "10px" }}
        >
          {getTranslatedText(sendMailTranslations.header, language)}
        </h2>
        <p style={{ fontSize: "18px", lineHeight: "1.6", color: "#555" }}>
          {getTranslatedText(sendMailTranslations.subheader, language)}
        </p>
        <Button
          type="primary"
          size="large"
          style={{ marginTop: "10px", fontSize: "18px" }}
          onClick={() => setVisible(true)}
        >
          {getTranslatedText(sendMailTranslations.buttonLabel, language)}
        </Button>
      </div>

      <Modal
        title={getTranslatedText(sendMailTranslations.modalTitle, language)}
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSendEmail}>
          <Form.Item
            label={getTranslatedText(sendMailTranslations.yourEmail, language)}
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

          <Form.Item
            label={getTranslatedText(sendMailTranslations.subject, language)}
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

          <Form.Item
            label={getTranslatedText(sendMailTranslations.message, language)}
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
              {getTranslatedText(sendMailTranslations.sendEmail, language)}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default SendMailForm;
