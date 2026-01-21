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
  if ("fields" in config) {
    if (config.type === NestedFieldType.ARRAY) {
      return (
        <ArrayFieldRenderer
          config={config}
          value={values || []}
          onChange={(value) => onChange(keyPrefix, value, "array")}
          zIndex={zIndex + 1}
      
        />
      );
    }

    if (config.type === NestedFieldType.JSON) {
      return (
        <JsonFieldRenderer
          config={config as any}
          value={values || {}}
          onChange={(value) => onChange(keyPrefix, value, "json")}
          zIndex={zIndex + 1}
          surface={surface}
        />
      );
    }
  }

  if (isFieldInfo(config)) {
    return (
      <FieldRenderer
        config={config}
        value={values}
        onChange={(value) => onChange(keyPrefix, value, config.formType)}
        style={{ position: "relative" }}
        zIndex={zIndex + 1}
        surface={surface}  
      />
    );
  }

  return null;
};

export default CombinedField;
