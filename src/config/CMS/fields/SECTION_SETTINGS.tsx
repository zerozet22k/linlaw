import {
    FormType,
    NestedFieldType,
    JsonDesign,
    ChildNestedJsonField,
    ModalBehaviorType,

    TEXT_ALIGN_OPTIONS,
    VERTICAL_ALIGN_OPTIONS,
    BG_MODE_OPTIONS,
    BG_SIZE_OPTIONS,
    BG_REPEAT_OPTIONS,
    BG_ATTACH_OPTIONS,
    OVERFLOW_MODE_OPTIONS,
    FLEX_ALIGN_ITEMS_OPTIONS,
    FLEX_JUSTIFY_CONTENT_OPTIONS,

    TextAlign,
    VerticalAlign,
    BgMode,
    BgSize,
    BgRepeat,
    BgAttachment,
    OverflowMode,
    FlexAlignItems,
    FlexJustifyContent,

    BoxSides,
    BOX_SIDES_FIELD,
} from "../settings";
import type { LanguageJson } from "@/utils/getTranslatedText";

export type SectionProps = {
    enabled?: boolean;

    content?: {
        title?: LanguageJson;
        description?: LanguageJson;
        align?: TextAlign;
        textColor?: string;
        contentMaxWidth?: string;
    };

    background?: {
        mode?: BgMode;
        color?: { backgroundColor?: string };
        image?: {
            backgroundImage?: string;
            backgroundSize?: BgSize;
            backgroundPosition?: string;
            backgroundRepeat?: BgRepeat;
            backgroundAttachment?: BgAttachment;
        };
        gradient?: {
            gradientFrom?: string;
            gradientTo?: string;
            gradientAngle?: number;
        };
        video?: {
            videoUrl?: string;
            videoPoster?: string;
            videoLoop?: boolean;
            videoMuted?: boolean;
            videoAutoplay?: boolean;
            videoPlaysInline?: boolean;
        };
    };

    overlay?: {
        overlayEnabled?: boolean;
        overlayColor?: string;
        overlayOpacity?: number;
    };

    layout?: {
        height?: {
            minHeightEnabled?: boolean;
            minHeight?: string;
            maxHeightEnabled?: boolean;
            maxHeight?: string;
            verticalAlign?: VerticalAlign;
        };
        spacing?: {
            padding?: BoxSides;
        };
        overflow?: { overflowMode?: OverflowMode };
        items?: {
            align?: FlexAlignItems;
            justify?: FlexJustifyContent;
            wrap?: boolean;
            gap?: string;
        };
    };
};

export const SECTION = {
    label: "Section",
    type: NestedFieldType.JSON,
    design: JsonDesign.NONE,
    modalBehavior: {
        [ModalBehaviorType.OPEN_IN_MODAL]: true,
        [ModalBehaviorType.ITEM_MODAL]: false,
    },
    slots: {
        extra: ["enabled"],
    },

    fields: {
        enabled: {
            label: "Enabled",
            guide: "Turn this section on/off.",
            formType: FormType.SWITCH,
        },

        content: {
            label: "Content",
            type: NestedFieldType.JSON,
            design: JsonDesign.FLAT,
            fields: {
                title: { label: "Title", formType: FormType.LANGUAGE_JSON_TEXT },
                description: {
                    label: "Subtitle",
                    formType: FormType.LANGUAGE_JSON_TEXTAREA,
                },
                align: {
                    label: "Text Align",
                    formType: FormType.SELECT,
                    options: TEXT_ALIGN_OPTIONS,
                },
                textColor: { label: "Text Color", formType: FormType.COLOR },
                contentMaxWidth: { label: "Content Max Width", formType: FormType.SIZE },
            },
        } satisfies ChildNestedJsonField,

        background: {
            label: "Background",
            type: NestedFieldType.JSON,
            design: JsonDesign.FLAT,
            openInModalPlacement: "header",

            modalBehavior: {
                [ModalBehaviorType.OPEN_IN_MODAL]: true,
                [ModalBehaviorType.ITEM_MODAL]: false,
            },
            fields: {
                mode: {
                    label: "Mode",
                    guide:
                        "Auto picks the first available: video → image → gradient → color → none.",
                    formType: FormType.SELECT,
                    options: BG_MODE_OPTIONS,
                },

                color: {
                    label: "Color",
                    type: NestedFieldType.JSON,
                    design: JsonDesign.FLAT,
                    fields: {
                        backgroundColor: { label: "Background Color", formType: FormType.COLOR },
                    },
                } satisfies ChildNestedJsonField,

                image: {
                    label: "Image",
                    type: NestedFieldType.JSON,
                    design: JsonDesign.FLAT,
                    fields: {
                        backgroundImage: { label: "Image", formType: FormType.IMAGE_SELECTOR },
                        backgroundSize: {
                            label: "Size",
                            formType: FormType.SELECT,
                            options: BG_SIZE_OPTIONS,
                        },
                        backgroundPosition: { label: "Position", formType: FormType.TEXT },
                        backgroundRepeat: {
                            label: "Repeat",
                            formType: FormType.SELECT,
                            options: BG_REPEAT_OPTIONS,
                        },
                        backgroundAttachment: {
                            label: "Attachment",
                            formType: FormType.SELECT,
                            options: BG_ATTACH_OPTIONS,
                        },
                    },
                } satisfies ChildNestedJsonField,

                gradient: {
                    label: "Gradient",
                    type: NestedFieldType.JSON,
                    design: JsonDesign.FLAT,
                    fields: {
                        gradientFrom: { label: "From", formType: FormType.COLOR },
                        gradientTo: { label: "To", formType: FormType.COLOR },
                        gradientAngle: { label: "Angle (deg)", formType: FormType.NUMBER },
                    },
                } satisfies ChildNestedJsonField,

                video: {
                    label: "Video",
                    type: NestedFieldType.JSON,
                    design: JsonDesign.FLAT,
                    fields: {
                        videoUrl: { label: "URL", formType: FormType.VIDEO_SELECTOR },
                        videoPoster: { label: "Poster", formType: FormType.IMAGE_SELECTOR },
                        videoAutoplay: { label: "Autoplay", formType: FormType.BOOLEAN },
                        videoMuted: { label: "Muted", formType: FormType.BOOLEAN },
                        videoLoop: { label: "Loop", formType: FormType.BOOLEAN },
                        videoPlaysInline: {
                            label: "Plays Inline (iOS)",
                            formType: FormType.BOOLEAN,
                        },
                    },
                } satisfies ChildNestedJsonField,
            },
        } satisfies ChildNestedJsonField,

        overlay: {
            label: "Overlay",
            type: NestedFieldType.JSON,
            design: JsonDesign.FLAT,
            fields: {
                overlayEnabled: {
                    label: "Enable Overlay",
                    guide: "Adds a color overlay above background to improve text contrast.",
                    formType: FormType.BOOLEAN,
                },
                overlayColor: { label: "Color", formType: FormType.COLOR },
                overlayOpacity: { label: "Opacity (0–1)", formType: FormType.NUMBER },
            },
        } satisfies ChildNestedJsonField,

        layout: {
            label: "Layout",
            type: NestedFieldType.JSON,
            design: JsonDesign.FLAT,
            fields: {
                height: {
                    label: "Height",
                    type: NestedFieldType.JSON,
                    design: JsonDesign.FLAT,
                    fields: {
                        minHeightEnabled: { label: "Force Min Height", formType: FormType.BOOLEAN },
                        minHeight: { label: "Min Height", formType: FormType.SIZE },
                        maxHeightEnabled: { label: "Force Max Height", formType: FormType.BOOLEAN },
                        maxHeight: { label: "Max Height", formType: FormType.SIZE },
                        verticalAlign: {
                            label: "Vertical Align",
                            formType: FormType.SELECT,
                            options: VERTICAL_ALIGN_OPTIONS,
                        },
                    },
                } satisfies ChildNestedJsonField,

                spacing: {
                    label: "Spacing",
                    type: NestedFieldType.JSON,
                    design: JsonDesign.FLAT,
                    fields: {
                        padding: { ...BOX_SIDES_FIELD, label: "Padding" },
                    },
                } satisfies ChildNestedJsonField,

                overflow: {
                    label: "Overflow",
                    type: NestedFieldType.JSON,
                    design: JsonDesign.FLAT,
                    fields: {
                        overflowMode: {
                            label: "Overflow Mode",
                            formType: FormType.SELECT,
                            options: OVERFLOW_MODE_OPTIONS,
                        },
                    },
                } satisfies ChildNestedJsonField,

                items: {
                    label: "Items",
                    type: NestedFieldType.JSON,
                    design: JsonDesign.FLAT,
                    fields: {
                        align: {
                            label: "Align Items",
                            formType: FormType.SELECT,
                            options: FLEX_ALIGN_ITEMS_OPTIONS,
                        },
                        justify: {
                            label: "Justify Items",
                            formType: FormType.SELECT,
                            options: FLEX_JUSTIFY_CONTENT_OPTIONS,
                        },
                        wrap: { label: "Wrap", formType: FormType.BOOLEAN },
                        gap: { label: "Gap", guide: 'e.g. "16px" or "1rem"', formType: FormType.SIZE },
                    },
                } satisfies ChildNestedJsonField,
            },
        } satisfies ChildNestedJsonField,
    },
} as const;
