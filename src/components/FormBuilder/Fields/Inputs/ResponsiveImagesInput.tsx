"use client";

import React, { CSSProperties, useMemo } from "react";
import { Typography } from "antd";
import MediaSelector from "./MediaSelector";
import { FileType } from "@/models/FileModel";

interface ResponsiveImagesValue {
  desktop?: string;
  tablet?: string;
  mobile?: string;
}

interface ResponsiveImagesInputProps {
  value?: ResponsiveImagesValue;
  onChange?: (value: ResponsiveImagesValue) => void;
  style?: CSSProperties;
}

const BASE_W = 1920;
const BASE_H = 1080;
const ASPECT = BASE_W / BASE_H;

function frameFromHeight(h: number) {
  return {
    width: Math.round(h * ASPECT),
    height: Math.round(h),
  };
}

const ResponsiveImagesInput: React.FC<ResponsiveImagesInputProps> = ({
  value = {},
  onChange,
  style,
}) => {
  const handleChange = (key: keyof ResponsiveImagesValue, url: string) => {
    onChange?.({ ...value, [key]: url });
  };


  const OUTER_PREVIEW_HEIGHT = 280;


  const rows = useMemo(
    () =>
      [
        {
          key: "desktop" as const,
          label: "Desktop Image",
          previewHeight: OUTER_PREVIEW_HEIGHT,
          frameH: 236,
          objectFit: "cover" as const,
          objectPosition: "center" as const,
        },
        {
          key: "tablet" as const,
          label: "Tablet Image",
          previewHeight: OUTER_PREVIEW_HEIGHT,
          frameH: 210,
          objectFit: "cover" as const,
          objectPosition: "center" as const,
        },
        {
          key: "mobile" as const,
          label: "Mobile Image",
          previewHeight: OUTER_PREVIEW_HEIGHT,
          frameH: 185,
          objectFit: "cover" as const,
          objectPosition: "center" as const,
        },
      ].map((r) => {
        const frame = frameFromHeight(r.frameH);
        return {
          ...r,
          tileFrameStyle: {
            width: frame.width,
            height: frame.height,
          } satisfies CSSProperties,
        };
      }),
    []
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, ...style }}>
      {rows.map((row) => (
        <div key={row.key}>
          <Typography.Text strong>{row.label}</Typography.Text>

          <div style={{ marginTop: 8 }}>
            <MediaSelector
              value={value[row.key] || ""}
              onChange={(url) => handleChange(row.key, url)}
              fileType={FileType.IMAGE}
              preview
              previewMode="tile"
              showField={false}
              placeholder={row.label.replace(" Image", "")}
              previewHeight={row.previewHeight}
              tileFrameStyle={row.tileFrameStyle}
              previewMediaStyle={{
                objectFit: row.objectFit,
                objectPosition: row.objectPosition,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResponsiveImagesInput;
