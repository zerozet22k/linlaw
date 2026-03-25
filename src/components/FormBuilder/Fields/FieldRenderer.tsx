"use client";
import React, { CSSProperties } from "react";
import { FieldDesign, ChildFieldInfo, FormType, RenderSurface } from "@/config/CMS/settings";
import MediaSelector from "./Inputs/MediaSelector";
import RoleSelector from "./Inputs/RoleSelector";
import GeneralInput from "@/components/FormBuilder/Fields/Inputs/GeneralInput";
import IconSelector from "./Inputs/IconSelector";
import SupportedLanguageSelector from "./Inputs/SupportedLanguageSelector";
import LanguageJsonTextarea from "./Inputs/LanguageJsonTextarea";
import LanguageJsonTextInput from "./Inputs/LanguageJsonTextInput";
import FieldDesignRenderer from "./FieldDesignRenderer";
import SizeInput from "./Inputs/SizeInput";
import ResponsiveImagesInput from "./Inputs/ResponsiveImagesInput";
import UserSelector from "./Inputs/UserSelector";
import UsersSelector from "./Inputs/UsersSelector";
import BoxSidesInput from "./Inputs/BoxSidesInput";
import DateInput from "./Inputs/DateInput";
import DateTimeInput from "./Inputs/DateTimeInput";
import TimeInput from "./Inputs/TimeInput";
import { FileType } from "@/models/FileModel";
import SwitchInput from "./Inputs/SwitchInput";
import LinkAssistanceInput from "./Inputs/LinkAssistanceInput";

type FieldRendererProps = {
  config: ChildFieldInfo;
  value: any;
  onChange: (value: any) => void;
  style?: CSSProperties;
  inputStyle?: CSSProperties;
  zIndex?: number;
  surface?: RenderSurface;
};

const renderFormField = (
  formType: FormType,
  value: any,
  onChange: (val: any) => void,
  options?: { label: string; value: string | number }[],
  linkAssistanceMode?: "mixed" | "external",
  inputStyle?: CSSProperties,
  zIndex?: number,
) => {
  const commonStyle = { ...inputStyle };

  switch (formType) {
    case FormType.IMAGE_SELECTOR:
      return (
        <MediaSelector
          fileType={FileType.IMAGE}
          value={value || ""}
          onChange={onChange}
          style={commonStyle}
          zIndex={zIndex}
        />
      );
    case FormType.VIDEO_SELECTOR:
      return (
        <MediaSelector
          fileType={FileType.VIDEO}
          value={value || ""}
          onChange={onChange}
          style={commonStyle}
          zIndex={zIndex}
          previewHeight={220}
          videoControls
          videoMuted
        />
      );
    case FormType.ROLE_SELECTOR:
      return (
        <RoleSelector value={value} onChange={onChange} style={commonStyle} />
      );
    case FormType.USER_SELECTOR:
      return <UserSelector value={value} onChange={onChange} style={commonStyle} />;

    case FormType.USERS_SELECTOR:
      return <UsersSelector value={value} onChange={onChange} style={commonStyle} />;

    case FormType.ICON_SELECTOR:
      return (
        <IconSelector value={value} onChange={onChange} style={commonStyle} />
      );

    case FormType.SUPPORTED_LANGUAGE_SELECTOR:
      return (
        <SupportedLanguageSelector
          value={value}
          onChange={onChange}
          style={commonStyle}
        />
      );

    case FormType.LANGUAGE_JSON_TEXT:
      return <LanguageJsonTextInput value={value || {}} onChange={onChange} />;

    case FormType.LANGUAGE_JSON_TEXTAREA:
      return <LanguageJsonTextarea value={value || {}} onChange={onChange} />;
    case FormType.SIZE:
      return (
        <SizeInput
          value={value || "1em"}
          onChange={onChange}
          style={commonStyle}
        />
      );
    case FormType.BOX_SIDES:
      return (
        <BoxSidesInput
          value={value || "1em"}
          onChange={onChange}
          style={commonStyle}
        />
      );
    case FormType.RESPONSIVE_IMAGES:
      return <ResponsiveImagesInput value={value} onChange={onChange} />;

    case FormType.DATE:
      return <DateInput value={value} onChange={onChange} style={commonStyle} />;

    case FormType.DATETIME:
      return <DateTimeInput value={value} onChange={onChange} style={commonStyle} />;

    case FormType.TIME:
      return <TimeInput value={value} onChange={onChange} style={commonStyle} />;

    case FormType.SWITCH:
      return (
        <SwitchInput
          value={!!value}
          onChange={onChange}
          style={commonStyle}
          size="small"
          showLabel={true}
          labels={{ on: "Enabled", off: "Disabled" }}
        />
      );

    case FormType.URL:
      return (
        <LinkAssistanceInput
          value={value}
          onChange={onChange}
          style={commonStyle}
          mode="external"
        />
      );

    case FormType.LINK_ASSISTANCE:
      return (
        <LinkAssistanceInput
          value={value}
          onChange={onChange}
          style={commonStyle}
          mode={linkAssistanceMode ?? "mixed"}
        />
      );

    default:
      return (
        <GeneralInput
          formType={formType}
          value={value}
          onChange={onChange}
          options={options}
          style={commonStyle}
        />
      );

  }
};

const FieldRenderer: React.FC<FieldRendererProps> = ({
  config,
  value,
  onChange,
  style = {},
  inputStyle = {},
  zIndex = 1000,
  surface = "body",
}) => {

  const parentDesign = config.parentDesign || FieldDesign.ROW;

  const content = renderFormField(
    config.formType,
    value,
    onChange,
    config.options,
    config.linkAssistanceMode,
    inputStyle,
    zIndex,
  );

  return (
    <FieldDesignRenderer
      design={parentDesign}
      label={config.label}
      guide={config.guide}
      renderItem={() => content}
      style={style}
      surface={surface}
    />
  );
};

export default FieldRenderer;
