// GeneralInput.tsx
import React, { CSSProperties } from "react";
import { Input, Switch, Select, Upload, Space } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { FormType } from "@/config/CMS/settings";
import {
  defaultWrapperStyle,
  defaultInputStyle,
  defaultSelectStyle,
  defaultSelectStyles,
} from "../../InputStyle";

type GeneralInputProps = {
  formType: FormType;
  value: any;
  onChange: (value: any) => void;
  options?: { label: string; value: string | number }[];
  style?: CSSProperties;
};

const GeneralInput: React.FC<GeneralInputProps> = ({
  formType,
  value,
  onChange,
  options = [],
  style = {},
}) => {
  const commonWrapperStyle: CSSProperties = {
    ...defaultWrapperStyle,
    ...style,
  };

  switch (formType) {
    case FormType.COLOR:
      return (
        <div style={commonWrapperStyle}>
          <Space align="center" size={10}>
            <Input
              type="color"
              value={value || "#000000"}
              onChange={(e) => onChange(e.target.value)}
              style={{
                width: 40,
                height: 36,
                padding: 0,
                borderRadius: 10,
                border: "1px solid rgba(0,0,0,0.15)",
                cursor: "pointer",
              }}
            />
            <span style={{ opacity: 0.85 }}>{value || "#000000"}</span>
          </Space>
        </div>
      );

    case FormType.BOOLEAN:
      return (
        <div style={commonWrapperStyle}>
          <Space align="center" size={10}>
            <Switch checked={!!value} onChange={onChange} />
            <span style={{ opacity: 0.85 }}>
              {value ? "Enabled" : "Disabled"}
            </span>
          </Space>
        </div>
      );

    case FormType.FILE:
      return (
        <div style={commonWrapperStyle}>
          <Upload
            beforeUpload={(file) => {
              onChange(file);
              return false;
            }}
            showUploadList={false}
          >
            <Input
              prefix={<UploadOutlined />}
              placeholder={value ? value.name : "Upload"}
              readOnly
              style={defaultInputStyle}
            />
          </Upload>
        </div>
      );

    case FormType.SELECT:
      return (
        <div style={commonWrapperStyle}>
          <Select
            value={value ?? undefined}
            onChange={onChange}
            placeholder="Select"
            style={defaultSelectStyle}
            styles={defaultSelectStyles}
            options={options}
            popupMatchSelectWidth={false}
          />
        </div>
      );

    case FormType.TEXTAREA:
      return (
        <div style={commonWrapperStyle}>
          <Input.TextArea
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            rows={6}
            style={{
              ...defaultInputStyle,
              resize: "vertical",
              minHeight: "120px",
            }}
          />
        </div>
      );

    default:
      return (
        <div style={commonWrapperStyle}>
          <Input
            type={
              formType === FormType.NUMBER
                ? "number"
                : formType === FormType.EMAIL
                ? "email"
                : formType === FormType.URL
                ? "url"
                : "text"
            }
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            style={defaultInputStyle}
          />
        </div>
      );
  }
};

export default GeneralInput;
