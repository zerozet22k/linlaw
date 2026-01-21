export enum FormType {
  TEXT = "text",
  NUMBER = "number",
  BOOLEAN = "boolean",
  SWITCH = "switch",
  URL = "url",
  FILE = "file",
  SELECT = "select",
  EMAIL = "email",
  COLOR = "color",
  TEXTAREA = "textarea",
  CUSTOM_FILE = "custom-file",
  IMAGE_SELECTOR = "image-selector",
  VIDEO_SELECTOR = "video-selector",
  ICON_SELECTOR = "icon-selector",
  ROLE_SELECTOR = "role-selector",
  USER_SELECTOR = "user-selector",
  USERS_SELECTOR = "users-selector",
  SUPPORTED_LANGUAGE_SELECTOR = "supported-language-selector",
  LANGUAGE_JSON_TEXT = "language-json-text",
  LANGUAGE_JSON_TEXTAREA = "language-json-textarea",
  RESPONSIVE_IMAGES = "responsive-images",
  SIZE = "size",
  BOX_SIDES = "box-sides",

  DATE = "date",
  DATETIME = "datetime",
  TIME = "time",
}
export type ResponsiveImagesType = {
  desktop?: string;
  tablet?: string;
  mobile?: string;
};
export enum NestedFieldType {
  JSON = "json",
  ARRAY = "array",
}

export enum TextAlign {
  LEFT = "left",
  RIGHT = "right",
  CENTER = "center",
}

export type TextAlignValue = TextAlign.LEFT | TextAlign.CENTER | TextAlign.RIGHT;
export const TEXT_ALIGN_OPTIONS: { label: string; value: TextAlignValue }[] = [
  { label: "Left", value: TextAlign.LEFT },
  { label: "Center", value: TextAlign.CENTER },
  { label: "Right", value: TextAlign.RIGHT },
];

export enum VerticalAlign {
  TOP = "top",
  CENTER = "center",
  BOTTOM = "bottom",
}

export type VerticalAlignValue =
  | VerticalAlign.TOP
  | VerticalAlign.CENTER
  | VerticalAlign.BOTTOM;

export const VERTICAL_ALIGN_OPTIONS: { label: string; value: VerticalAlignValue }[] = [
  { label: "Top", value: VerticalAlign.TOP },
  { label: "Center", value: VerticalAlign.CENTER },
  { label: "Bottom", value: VerticalAlign.BOTTOM },
];

export enum BgMode {
  AUTO = "auto",
  NONE = "none",
  COLOR = "color",
  IMAGE = "image",
  GRADIENT = "gradient",
  VIDEO = "video",
}

export type BgModeValue =
  | BgMode.AUTO
  | BgMode.NONE
  | BgMode.COLOR
  | BgMode.IMAGE
  | BgMode.GRADIENT
  | BgMode.VIDEO;

export const BG_MODE_OPTIONS: { label: string; value: BgModeValue }[] = [
  { label: "Auto", value: BgMode.AUTO },
  { label: "None", value: BgMode.NONE },
  { label: "Color", value: BgMode.COLOR },
  { label: "Image", value: BgMode.IMAGE },
  { label: "Gradient", value: BgMode.GRADIENT },
  { label: "Video", value: BgMode.VIDEO },
];


export enum BgSize {
  COVER = "cover",
  CONTAIN = "contain",
  AUTO = "auto",
}
export type BgSizeValue = BgSize.COVER | BgSize.CONTAIN | BgSize.AUTO;
export const BG_SIZE_OPTIONS: { label: string; value: BgSizeValue }[] = [
  { label: "Cover", value: BgSize.COVER },
  { label: "Contain", value: BgSize.CONTAIN },
  { label: "Auto", value: BgSize.AUTO },
];


export enum BgRepeat {
  NO_REPEAT = "no-repeat",
  REPEAT = "repeat",
  REPEAT_X = "repeat-x",
  REPEAT_Y = "repeat-y",
}
export type BgRepeatValue =
  | BgRepeat.NO_REPEAT
  | BgRepeat.REPEAT
  | BgRepeat.REPEAT_X
  | BgRepeat.REPEAT_Y;
export const BG_REPEAT_OPTIONS: { label: string; value: BgRepeatValue }[] = [
  { label: "No repeat", value: BgRepeat.NO_REPEAT },
  { label: "Repeat", value: BgRepeat.REPEAT },
  { label: "Repeat X", value: BgRepeat.REPEAT_X },
  { label: "Repeat Y", value: BgRepeat.REPEAT_Y },
];


export enum BgAttachment {
  SCROLL = "scroll",
  FIXED = "fixed",
}
export type BgAttachmentValue = BgAttachment.SCROLL | BgAttachment.FIXED;
export const BG_ATTACH_OPTIONS: { label: string; value: BgAttachmentValue }[] = [
  { label: "Scroll", value: BgAttachment.SCROLL },
  { label: "Fixed (parallax-ish)", value: BgAttachment.FIXED },
];


export enum OverflowMode {
  CLIP = "clip",
  SCROLL = "scroll",
}
export type OverflowModeValue = OverflowMode.CLIP | OverflowMode.SCROLL;
export const OVERFLOW_MODE_OPTIONS: { label: string; value: OverflowModeValue }[] = [
  { label: "Clip (hide overflow)", value: OverflowMode.CLIP },
  { label: "Scrollable (inner scroll)", value: OverflowMode.SCROLL },
];
export enum FlexAlignItems {
  START = "start",
  CENTER = "center",
  END = "end",
  STRETCH = "stretch",
  BASELINE = "baseline",
}
export type FlexAlignItemsValue =
  | FlexAlignItems.START
  | FlexAlignItems.CENTER
  | FlexAlignItems.END
  | FlexAlignItems.STRETCH
  | FlexAlignItems.BASELINE;
export const FLEX_ALIGN_ITEMS_OPTIONS: { label: string; value: FlexAlignItemsValue }[] = [
  { label: "Start", value: FlexAlignItems.START },
  { label: "Center", value: FlexAlignItems.CENTER },
  { label: "End", value: FlexAlignItems.END },
  { label: "Stretch", value: FlexAlignItems.STRETCH },
  { label: "Baseline", value: FlexAlignItems.BASELINE },
];
export enum FlexJustifyContent {
  START = "start",
  CENTER = "center",
  END = "end",
  SPACE_BETWEEN = "space-between",
  SPACE_AROUND = "space-around",
  SPACE_EVENLY = "space-evenly",
}
export type FlexJustifyContentValue =
  | FlexJustifyContent.START
  | FlexJustifyContent.CENTER
  | FlexJustifyContent.END
  | FlexJustifyContent.SPACE_BETWEEN
  | FlexJustifyContent.SPACE_AROUND
  | FlexJustifyContent.SPACE_EVENLY;

export const FLEX_JUSTIFY_CONTENT_OPTIONS: {
  label: string;
  value: FlexJustifyContentValue;
}[] = [
    { label: "Start", value: FlexJustifyContent.START },
    { label: "Center", value: FlexJustifyContent.CENTER },
    { label: "End", value: FlexJustifyContent.END },
    { label: "Space Between", value: FlexJustifyContent.SPACE_BETWEEN },
    { label: "Space Around", value: FlexJustifyContent.SPACE_AROUND },
    { label: "Space Evenly", value: FlexJustifyContent.SPACE_EVENLY },
  ];

export const OVERLAY_OPACITY_GUIDE = "0.35–0.55";
export const GRADIENT_ANGLE_GUIDE = "0–360. Example: 135";


export enum ModalBehaviorType {
  OPEN_IN_MODAL = "openInModal",
  ITEM_MODAL = "itemModal",
}

export type ModalBehavior = {
  [ModalBehaviorType.OPEN_IN_MODAL]?: boolean;
  [ModalBehaviorType.ITEM_MODAL]?: boolean;
};

export enum JsonDesign {
  CARD = "card",
  FLAT = "flat",
  FLAT_OUTSIDE = "flat_outside",
  PARENT = "parent",
  PAGE_SECTION = "page_section",
  NONE = "none",
}

export enum HorizontalSide {
  AUTO = "auto",
  LEFT = "left",
  RIGHT = "right",
}
export type HorizontalSideValue =
  | HorizontalSide.AUTO
  | HorizontalSide.LEFT
  | HorizontalSide.RIGHT;

export const HORIZONTAL_SIDE_OPTIONS: { label: string; value: HorizontalSideValue }[] = [
  { label: "Auto", value: HorizontalSide.AUTO },
  { label: "Left", value: HorizontalSide.LEFT },
  { label: "Right", value: HorizontalSide.RIGHT },
];

export enum FlowDirection {
  AUTO = "auto",
  LTR = "ltr",
  RTL = "rtl",
}
export type FlowDirectionValue =
  | FlowDirection.AUTO
  | FlowDirection.LTR
  | FlowDirection.RTL;

export const FLOW_DIRECTION_OPTIONS: { label: string; value: FlowDirectionValue }[] = [
  { label: "Auto", value: FlowDirection.AUTO },
  { label: "Left → Right", value: FlowDirection.LTR },
  { label: "Right → Left", value: FlowDirection.RTL },
];

export enum ButtonVariant {
  PRIMARY = "primary",
  DEFAULT = "default",
  DASHED = "dashed",
  LINK = "link",
  TEXT = "text",
}
export type ButtonVariantValue =
  | ButtonVariant.PRIMARY
  | ButtonVariant.DEFAULT
  | ButtonVariant.DASHED
  | ButtonVariant.LINK
  | ButtonVariant.TEXT;

export const BUTTON_VARIANT_OPTIONS: { label: string; value: ButtonVariantValue }[] = [
  { label: "Primary", value: ButtonVariant.PRIMARY },
  { label: "Default", value: ButtonVariant.DEFAULT },
  { label: "Dashed", value: ButtonVariant.DASHED },
  { label: "Link", value: ButtonVariant.LINK },
  { label: "Text", value: ButtonVariant.TEXT },
];

export enum LinkTargetMode {
  SAME_TAB = "same_tab",
  NEW_TAB = "new_tab",
}
export type LinkTargetModeValue = LinkTargetMode.SAME_TAB | LinkTargetMode.NEW_TAB;

export const LINK_TARGET_OPTIONS: { label: string; value: LinkTargetModeValue }[] = [
  { label: "Same tab", value: LinkTargetMode.SAME_TAB },
  { label: "New tab", value: LinkTargetMode.NEW_TAB },
];

export enum ArrayDesign {
  FLAT = "flat",
  FLAT_OUTSIDE = "flat_outside",
  CARD = "card",
  PARENT = "parent",
  NONE = "none",
}

export enum ChildArrayDesign {
  LIST = "list",
  CARD = "card",
  TABLE = "table",
  NONE = "none",
}

export enum JsonFunctionality {
  INTELLIGENT = "intelligent",
}

export enum ArrayFunctionality {
  SORTABLE = "sortable",
  FILTERABLE = "filterable",
  DRAGGABLE = "draggable",
}

export enum FieldDesign {
  NONE = "none",
  CARD = "card",
  PARENT = "parent",
  ROW = "row",
}
export type SlotsShape = {
  body?: readonly string[];
  extra?: readonly string[];
  hidden?: readonly string[];
};

export type OpenInModalPlacement = "header" | "body";
export type RenderSurface = OpenInModalPlacement ;
interface BaseParentField {
  label?: string;
  guide?: string;
  visibility?: "public" | "private";
}
export type BoxSides = {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  _linkX?: boolean;
  _linkY?: boolean;
};
export const BOX_SIDES_FIELD = {
  label: "Sides",
  formType: FormType.BOX_SIDES,
} as const;

interface BaseChildField {
  label?: string;
  guide?: string;
}

export interface FieldInfo extends BaseParentField {
  formType: FormType;
  parentDesign?: FieldDesign;
}

export interface NestedJsonField extends BaseParentField {
  design?: JsonDesign;
  type: NestedFieldType.JSON;
  fields: Record<string, ChildFieldInfo | ChildNestedJsonField | ChildNestedArrayField>;
  jsonFunctionalities?: JsonFunctionality[];
  slots?: SlotsShape;
  modalBehavior?: ModalBehavior;
  openInModalPlacement?: OpenInModalPlacement;
}

export interface NestedArrayField extends BaseParentField {
  modalBehavior?: ModalBehavior;
  type: NestedFieldType.ARRAY;
  fields: Record<
    string,
    ChildFieldInfo | ChildNestedJsonField | ChildNestedArrayField
  >;
  keyLabel?: string;
  arrayDesign?: ArrayDesign;
  childArrayDesign?: ChildArrayDesign;
  arrayFunctionalities?: ArrayFunctionality[];
}

export interface ChildFieldInfo extends BaseChildField {
  formType: FormType;
  parentDesign?: FieldDesign;
  options?: { label: string; value: string | number }[];
}

export interface ChildNestedJsonField extends BaseChildField {
  visibility?: "public" | "private";
  design?: JsonDesign;
  type: NestedFieldType.JSON;
  fields: Record<string, ChildFieldInfo | ChildNestedJsonField | ChildNestedArrayField>;
  jsonFunctionalities?: JsonFunctionality[];
  slots?: SlotsShape;
  modalBehavior?: ModalBehavior;
  openInModalPlacement?: OpenInModalPlacement;
}

export interface ChildNestedArrayField extends BaseChildField {
  visibility?: "public" | "private";
  modalBehavior?: ModalBehavior;

  type: NestedFieldType.ARRAY;
  fields: Record<
    string,
    ChildFieldInfo | ChildNestedJsonField | ChildNestedArrayField
  >;
  keyLabel?: string;
  arrayDesign?: ArrayDesign;
  childArrayDesign?: ChildArrayDesign;
  arrayFunctionalities?: ArrayFunctionality[];
}

export type GeneralConfig<Keys extends Record<string, string>> = {
  [K in Keys[keyof Keys]]: FieldInfo | NestedJsonField | NestedArrayField;
};

type ValidValue = string | number | boolean | object | null | undefined;

export function mergeJsonByConfig(
  currentValue: Record<string, any> | undefined,
  newObj: Record<string, any>,
  config: {
    fields: Record<
      string,
      ChildFieldInfo | ChildNestedJsonField | ChildNestedArrayField
    >;
  }
): Record<string, any> {
  const merged: Record<string, ValidValue> = currentValue
    ? { ...currentValue }
    : {};

  for (const [fieldKey, fieldConfig] of Object.entries(config.fields)) {
    if (!(fieldKey in newObj)) {
      continue;
    }

    const pastedValue = newObj[fieldKey];

    if (
      "type" in fieldConfig &&
      fieldConfig.type === NestedFieldType.JSON &&
      typeof pastedValue === "object" &&
      pastedValue !== null
    ) {
      merged[fieldKey] = mergeJsonByConfig(
        currentValue?.[fieldKey],
        pastedValue,
        fieldConfig
      );
    } else if (
      "type" in fieldConfig &&
      fieldConfig.type === NestedFieldType.ARRAY &&
      Array.isArray(pastedValue)
    ) {
      merged[fieldKey] = pastedValue;
    } else {
      merged[fieldKey] = pastedValue;
    }
  }

  return merged;
}
