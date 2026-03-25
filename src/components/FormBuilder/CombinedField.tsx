import React from "react";
import FieldRenderer from "./Fields/FieldRenderer";
import ArrayFieldRenderer from "./Arrays/ArrayFieldRenderer";
import JsonFieldRenderer from "./Jsons/JsonFieldRenderer";
import {
  ChildFieldInfo,
  ChildNestedJsonField,
  ChildNestedArrayField,
  NestedFieldType,
  RenderSurface,
} from "@/config/CMS/settings";

type CombinedFieldProps = {
  keyPrefix: string;
  config: ChildFieldInfo | ChildNestedJsonField | ChildNestedArrayField;
  values: any;
  onChange: (key: string, value: any, type: string) => void;
  zIndex?: number;
  surface?: RenderSurface;
};

const isFieldInfo = (
  field: ChildFieldInfo | ChildNestedJsonField | ChildNestedArrayField
): field is ChildFieldInfo => "formType" in field;

const CombinedField: React.FC<CombinedFieldProps> = ({
  keyPrefix,
  config,
  values,
  onChange,
  zIndex = 1000,
  surface = "body",
}) => {
  const wrapperStyle: React.CSSProperties =
    surface === "header"
      ? { minWidth: 0, maxWidth: "100%", flex: "0 1 auto" }
      : { width: "100%", minWidth: 0 };

  if ("fields" in config) {
    if (config.type === NestedFieldType.ARRAY) {
      return (
        <div style={wrapperStyle}>
          <ArrayFieldRenderer
            config={config}
            value={values || []}
            onChange={(value) => onChange(keyPrefix, value, "array")}
            style={surface === "header" ? { minWidth: 0 } : wrapperStyle}
            zIndex={zIndex + 1}
          />
        </div>
      );
    }

    if (config.type === NestedFieldType.JSON) {
      return (
        <div style={wrapperStyle}>
          <JsonFieldRenderer
            config={config as any}
            value={values || {}}
            onChange={(value) => onChange(keyPrefix, value, "json")}
            style={surface === "header" ? { minWidth: 0 } : wrapperStyle}
            zIndex={zIndex + 1}
            surface={surface}
          />
        </div>
      );
    }
  }

  if (isFieldInfo(config)) {
    return (
      <div style={wrapperStyle}>
        <FieldRenderer
          config={config}
          value={values}
          onChange={(value) => onChange(keyPrefix, value, config.formType)}
          style={{ position: "relative", minWidth: 0 }}
          zIndex={zIndex + 1}
          surface={surface}
        />
      </div>
    );
  }

  return null;
};

export default CombinedField;
