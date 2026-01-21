"use client";

import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Button, Input, Space, Tooltip, Typography } from "antd";
import {
  PictureOutlined,
  VideoCameraOutlined,
  SyncOutlined,
  DeleteOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import { useFile } from "@/hooks/useFile";
import {
  defaultInputStyle,
  flexColumnStyle,
  previewImageStyle as defaultPreviewImageStyle,
} from "../../InputStyle";
import { FileType } from "@/models/FileModel";
import Image from "next/image";

const { Text } = Typography;

type PreviewMode = "tile" | "inline";
type TileFrameAppearance = "none" | "border" | "card";

interface MediaSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
  style?: CSSProperties;

  zIndex?: number;
  fileType?: FileType.IMAGE | FileType.VIDEO;

  preview?: boolean;
  previewMode?: PreviewMode;

  showField?: boolean;
  placeholder?: string;

  /** Outer dashed preview box height (tile mode) */
  previewHeight?: number;

  /** Outer wrapper style (dashed box) */
  previewContainerStyle?: CSSProperties;

  /**
   * Style applied to the media element (<img>/<video>).
   * Use this for objectFit/objectPosition to simulate "cover" like hero.
   */
  previewMediaStyle?: CSSProperties;

  /**
   * Controls INNER frame sizing (NOT the outer dashed box).
   * - Use maxWidth/maxHeight to cap the frame
   * - width/height are treated as aliases for maxWidth/maxHeight
   */
  tileFrameStyle?: CSSProperties;

  /**
   * Force an inner-frame aspect ratio (e.g. 16/9, "16/9", 1.777...).
   * Useful to preview 1920x1080 behavior (16:9), or a hero container ratio.
   */
  tileFrameAspectRatio?: number | `${number}/${number}` | string;

  /**
   * Visual chrome for the inner frame.
   * - "none": no border/shadow (your request)
   * - "border": subtle border only
   * - "card": border + shadow
   */
  tileFrameAppearance?: TileFrameAppearance;

  /** Inner frame corner radius (defaults to 10) */
  tileFrameRadius?: number;

  disabled?: boolean;

  videoControls?: boolean;
  videoMuted?: boolean;
  videoLoop?: boolean;
  videoAutoPlay?: boolean;
  videoPoster?: string;
}

const toCssSize = (v: any) => (typeof v === "number" ? `${v}px` : v);

const parseAspectRatio = (v: MediaSelectorProps["tileFrameAspectRatio"]) => {
  if (v == null) return undefined;
  if (typeof v === "number" && isFinite(v) && v > 0) return v;

  if (typeof v === "string") {
    const s = v.trim();
    if (!s) return undefined;

    // "16/9"
    if (s.includes("/")) {
      const [a, b] = s.split("/").map((x) => Number(x.trim()));
      if (isFinite(a) && isFinite(b) && a > 0 && b > 0) return a / b;
      return undefined;
    }

    // "1.7777"
    const n = Number(s);
    if (isFinite(n) && n > 0) return n;
  }

  return undefined;
};

const MediaSelector: React.FC<MediaSelectorProps> = ({
  value = "",
  onChange,
  style = {},

  zIndex = 1000,
  fileType = FileType.IMAGE,

  preview = true,
  previewMode = "tile",

  showField = true,
  placeholder,

  previewHeight = 280,
  previewContainerStyle = {},
  previewMediaStyle = {},

  tileFrameStyle,
  tileFrameAspectRatio,
  tileFrameAppearance = "none",
  tileFrameRadius = 10,

  disabled = false,

  videoControls = true,
  videoMuted = true,
  videoLoop = true,
  videoAutoPlay = false,
  videoPoster,
}) => {
  const { openModal, syncFiles, loading } = useFile();
  const [mediaOk, setMediaOk] = useState(true);

  const hasValue = !!value;
  const isVideo = fileType === FileType.VIDEO;

  useEffect(() => {
    setMediaOk(true);
  }, [value, fileType]);

  const openPicker = useCallback(() => {
    if (disabled) return;

    setMediaOk(true);

    openModal(
      (selectedUrl) => {
        setMediaOk(true);
        onChange?.(selectedUrl);
      },
      fileType as any,
      zIndex + 1
    );
  }, [disabled, openModal, onChange, fileType, zIndex]);

  const clear = useCallback(() => {
    setMediaOk(true);
    onChange?.("");
  }, [onChange]);

  const copy = useCallback(async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // ignore
    }
  }, [value]);

  const icon = isVideo ? <VideoCameraOutlined /> : <PictureOutlined />;
  const chooseText = isVideo ? "Choose video" : "Choose image";
  const fieldPlaceholder = placeholder ?? (isVideo ? "Video" : "Image");

  const tilePadding = useMemo(() => {
    const base = Math.round(previewHeight * 0.08);
    return Math.min(40, Math.max(14, base));
  }, [previewHeight]);

  const hasCustomSize =
    previewMediaStyle?.width != null || previewMediaStyle?.height != null;

  const objectFit = (previewMediaStyle as any)?.objectFit ?? "cover";
  const objectPosition = (previewMediaStyle as any)?.objectPosition ?? "center";

  // inner frame constraints
  const frameMaxWRaw = tileFrameStyle?.maxWidth ?? tileFrameStyle?.width;
  const frameMaxHRaw = tileFrameStyle?.maxHeight ?? tileFrameStyle?.height;

  const ratio = parseAspectRatio(tileFrameAspectRatio);

  // available area inside outer box (height known, width unknown -> treat as infinite)
  const areaMaxH = Math.max(0, previewHeight - tilePadding * 2);

  // if numeric constraints + ratio, compute actual W/H to preserve ratio and fit height
  const frameWn = typeof frameMaxWRaw === "number" ? frameMaxWRaw : undefined;
  const frameHnFromProp =
    typeof frameMaxHRaw === "number" ? frameMaxHRaw : undefined;

  const computedFrame = useMemo(() => {
    if (!ratio) return undefined;

    const maxH = Math.min(frameHnFromProp ?? Infinity, areaMaxH);
    const maxW = frameWn ?? Infinity;

    if (!isFinite(maxH) && !isFinite(maxW)) return undefined;

    // pick the largest size that fits BOTH maxW and maxH while keeping ratio
    const w = Math.min(maxW, maxH * ratio);
    const h = w / ratio;

    if (!isFinite(w) || !isFinite(h) || w <= 0 || h <= 0) return undefined;

    return { w, h };
  }, [ratio, frameHnFromProp, frameWn, areaMaxH]);

  const mediaStyle: CSSProperties = hasCustomSize
    ? {
        ...defaultPreviewImageStyle,
        ...previewMediaStyle,
        display: "block",
      }
    : {
        ...defaultPreviewImageStyle,
        ...previewMediaStyle,
        display: "block",
        width: "100%",
        height: "100%",
        objectFit: objectFit as any,
        objectPosition: objectPosition as any,
      };

  const frameChromeStyle: CSSProperties = useMemo(() => {
    if (tileFrameAppearance === "border") {
      return { border: "1px solid rgba(0,0,0,0.10)" };
    }
    if (tileFrameAppearance === "card") {
      return {
        border: "1px solid rgba(0,0,0,0.10)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
      };
    }
    return {}; // "none"
  }, [tileFrameAppearance]);

  /**
   * For Next/Image we need a positioned box to `fill`.
   * - If caller provided explicit width/height in previewMediaStyle, respect it.
   * - Otherwise fall back to a reasonable thumbnail size (inline mode).
   */
  const inlineThumbBoxStyle: CSSProperties = useMemo(() => {
    const w = (previewMediaStyle as any)?.width ?? 120;
    const h = (previewMediaStyle as any)?.height ?? 80;
    return {
      position: "relative",
      width: typeof w === "number" ? w : w,
      height: typeof h === "number" ? h : h,
      overflow: "hidden",
      borderRadius: (mediaStyle as any)?.borderRadius ?? 10,
      flex: "0 0 auto",
    };
  }, [previewMediaStyle, mediaStyle]);

  const previewBlock = (() => {
    if (!preview) return null;

    // INLINE MODE
    if (previewMode === "inline") {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            ...previewContainerStyle,
          }}
        >
          <div
            onClick={openPicker}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: disabled ? "not-allowed" : "pointer",
              userSelect: "none",
            }}
          >
            {hasValue && mediaOk ? (
              isVideo ? (
                <video
                  key={value}
                  src={value}
                  controls={videoControls}
                  muted={videoMuted}
                  loop={videoLoop}
                  autoPlay={videoAutoPlay}
                  poster={videoPoster}
                  onError={() => setMediaOk(false)}
                  style={mediaStyle}
                />
              ) : (
                <div style={inlineThumbBoxStyle}>
                  <Image
                    key={value}
                    src={value}
                    alt="Preview"
                    fill
                    sizes="(max-width: 768px) 120px, 160px"
                    style={{
                      objectFit: objectFit as any,
                      objectPosition: objectPosition as any,
                    }}
                    onError={() => setMediaOk(false)}
                  />
                </div>
              )
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  opacity: 0.75,
                }}
              >
                {icon}
                <Text type="secondary">{chooseText}</Text>
              </div>
            )}
          </div>

          <Space size={6}>
            <Tooltip title="Sync">
              <Button
                icon={<SyncOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  syncFiles();
                }}
                loading={loading}
                disabled={disabled}
              />
            </Tooltip>

            {hasValue && (
              <Tooltip title="Clear">
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    clear();
                  }}
                  disabled={disabled}
                />
              </Tooltip>
            )}

            {hasValue && (
              <Tooltip title="Copy">
                <Button
                  icon={<CopyOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    copy();
                  }}
                  disabled={disabled}
                />
              </Tooltip>
            )}

            <Button
              type="primary"
              icon={icon}
              onClick={(e) => {
                e.stopPropagation();
                openPicker();
              }}
              disabled={disabled}
            >
              Choose
            </Button>
          </Space>
        </div>
      );
    }

    // TILE MODE
    const frameStyle: CSSProperties = {
      overflow: "hidden",
      borderRadius: tileFrameRadius,
      ...frameChromeStyle,

      // sizing: preserve ratio if possible; otherwise use maxWidth/maxHeight caps
      ...(computedFrame
        ? {
            width: toCssSize(computedFrame.w),
            height: toCssSize(computedFrame.h),
            maxWidth: "100%",
            maxHeight: "100%",
          }
        : {
            width:
              frameMaxWRaw != null
                ? `min(100%, ${toCssSize(frameMaxWRaw)})`
                : "min(100%, 1100px)",
            height:
              frameMaxHRaw != null
                ? `min(100%, ${toCssSize(frameMaxHRaw)})`
                : `min(100%, ${toCssSize(areaMaxH)})`,
            ...(ratio ? { aspectRatio: `${ratio}` } : {}),
          }),

      // allow extra overrides (but keeps our computed sizing above working)
      ...(tileFrameStyle ?? {}),
    };

    return (
      <div
        style={{
          width: "100%",
          border: "1px dashed rgba(0,0,0,0.22)",
          borderRadius: 10,
          overflow: "hidden",
          background: "transparent",
          cursor: disabled ? "not-allowed" : "pointer",
          userSelect: "none",
          ...previewContainerStyle,
        }}
        onClick={openPicker}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            height: previewHeight,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: tilePadding,
            boxSizing: "border-box",
          }}
        >
          {hasValue && mediaOk ? (
            <div
              style={{ ...frameStyle, position: "relative" }}
              onClick={(e) => e.stopPropagation()}
            >
              {isVideo ? (
                <video
                  key={value}
                  src={value}
                  controls={videoControls}
                  muted={videoMuted}
                  loop={videoLoop}
                  autoPlay={videoAutoPlay}
                  playsInline
                  poster={videoPoster}
                  onError={() => setMediaOk(false)}
                  style={mediaStyle}
                />
              ) : (
                <Image
                  key={value}
                  src={value}
                  alt="Preview"
                  fill
                  sizes="(max-width: 768px) 92vw, 1100px"
                  style={{
                    objectFit: objectFit as any,
                    objectPosition: objectPosition as any,
                  }}
                  onError={() => setMediaOk(false)}
                />
              )}
            </div>
          ) : (
            <div
              style={{
                height: "100%",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: 6,
                opacity: 0.75,
              }}
            >
              {icon}
              <Text type="secondary">{chooseText}</Text>
            </div>
          )}

          {/* Action bar */}
          <div
            style={{
              position: "absolute",
              left: 10,
              right: 10,
              bottom: 10,
              display: "flex",
              justifyContent: "space-between",
              gap: 8,
              pointerEvents: "none",
            }}
          >
            <Space size={6} style={{ pointerEvents: "auto" }}>
              <Tooltip title="Sync">
                <Button
                  icon={<SyncOutlined />}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={(e) => {
                    e.stopPropagation();
                    syncFiles();
                  }}
                  loading={loading}
                  disabled={disabled}
                />
              </Tooltip>

              {hasValue && (
                <Tooltip title="Clear">
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={(e) => {
                      e.stopPropagation();
                      clear();
                    }}
                    disabled={disabled}
                  />
                </Tooltip>
              )}
            </Space>

            <Space size={6} style={{ pointerEvents: "auto" }}>
              {hasValue && (
                <Tooltip title="Copy">
                  <Button
                    icon={<CopyOutlined />}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={(e) => {
                      e.stopPropagation();
                      copy();
                    }}
                    disabled={disabled}
                  />
                </Tooltip>
              )}

              <Button
                type="primary"
                icon={icon}
                onMouseDown={(e) => e.preventDefault()}
                onClick={(e) => {
                  e.stopPropagation();
                  openPicker();
                }}
                disabled={disabled}
              >
                Choose
              </Button>
            </Space>
          </div>
        </div>
      </div>
    );
  })();

  return (
    <div style={{ ...flexColumnStyle, gap: 8, ...style }}>
      {previewBlock}

      {showField && (
        <Input
          value={value}
          placeholder={fieldPlaceholder}
          disabled={disabled}
          onChange={(e) => {
            setMediaOk(true);
            onChange?.(e.target.value);
          }}
          style={{ ...defaultInputStyle }}
        />
      )}
    </div>
  );
};

export default MediaSelector;
