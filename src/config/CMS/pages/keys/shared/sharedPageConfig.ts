import { FormType, NestedFieldType, JsonDesign } from "../../../settings";
export const CARD_STYLE_OPTIONS: { label: string; value: string | number }[] = [
  { label: "Default", value: "default" },
  { label: "Shadow", value: "shadow" },
  { label: "Borderless", value: "borderless" },
];

export const ANIMATION_OPTIONS: { label: string; value: string | number }[] = [
  { label: "None", value: "none" },
  { label: "Fade In", value: "fade-in" },
  { label: "Slide Up", value: "slide-up" },
  { label: "Scale In", value: "scale-in" },
];

export const TEXT_ALIGN_OPTIONS: { label: string; value: string | number }[] = [
  { label: "Left", value: "left" },
  { label: "Center", value: "center" },
  { label: "Right", value: "right" },
];

export const SHARED_PAGE_CONTENT_FIELDS = {
  title: {
    label: "Page Title",
    guide: "The main title of the page.",
    formType: FormType.LANGUAGE_JSON_TEXT,
  },
  subtitle: {
    label: "Page Subtitle",
    guide: "The subtitle of the page.",
    formType: FormType.LANGUAGE_JSON_TEXT,
  },
  description: {
    label: "Page Description",
    guide: "A brief description of the page.",
    formType: FormType.LANGUAGE_JSON_TEXTAREA,
  },
  backgroundImage: {
    label: "Background Image",
    guide: "The background image for the page.",
    formType: FormType.IMAGE_SELECTOR,
  },
};

export const SHARED_PAGE_DESIGN_FIELDS = {
  columnCount: {
    label: "Column Count",
    guide: "Number of columns (1, 2, or 3) for grid layout.",
    formType: FormType.SIZE,
  },
  gridGutter: {
    label: "Grid Gutter Size",
    formType: FormType.SIZE,
  },
  cardStyle: {
    label: "Card Style",
    guide: "Choose the card styling.",
    formType: FormType.SELECT,
    options: CARD_STYLE_OPTIONS,
  },
  typography: {
    label: "Typography",
    guide: "Control font size and color.",
    type: NestedFieldType.JSON,
    design: JsonDesign.FLAT_OUTSIDE,
    fields: {
      titleSize: { label: "Title Size", formType: FormType.SIZE },
      descriptionSize: { label: "Description Size", formType: FormType.SIZE },
      color: { label: "Text Color", formType: FormType.COLOR },
    },
  },
  animation: {
    label: "Animation Style",
    guide: "Choose entrance animation.",
    formType: FormType.SELECT,
    options: ANIMATION_OPTIONS,
  },
  showIcons: {
    label: "Show Icons",
    guide: "Toggle to show or hide icons in sections.",
    formType: FormType.BOOLEAN,
  },
  showImages: {
    label: "Show Images",
    guide: "Toggle to show or hide images in sections.",
    formType: FormType.BOOLEAN,
  },
  borderRadius: {
    label: "Border Radius",
    guide: "Adjust the roundness of section cards.",
    formType: FormType.SIZE,
  },
  textAlign: {
    label: "Text Alignment",
    guide: "Choose text alignment inside the cards.",
    formType: FormType.SELECT,
    options: TEXT_ALIGN_OPTIONS,
  },
};
