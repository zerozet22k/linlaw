// config/CMS/pages/keys/SECTION.ts
import { FormType, NestedFieldType, JsonDesign, /* if available */ ChildNestedJsonField, ModalBehaviorType } from "../../settings";
import { LanguageJson } from "@/utils/getTranslatedText";

export type SectionProps = {
    title?: LanguageJson;
    description?: LanguageJson;
    backgroundImage?: string;
    align?: "left" | "center" | "right";
};

const ALIGN_OPTIONS: { label: string; value: string }[] = [
    { label: "Left", value: "left" },
    { label: "Center", value: "center" },
    { label: "Right", value: "right" },
];

export const SECTION: any = {
    label: "Section",
    type: NestedFieldType.JSON,
    design: JsonDesign.NONE,
    modalBehavior: { [ModalBehaviorType.OPEN_IN_MODAL]: true, [ModalBehaviorType.ITEM_MODAL]: false },
    fields: {
        title: { label: "Title", formType: FormType.LANGUAGE_JSON_TEXT },
        description: { label: "Subtitle", formType: FormType.LANGUAGE_JSON_TEXTAREA },
        backgroundImage: { label: "Background Image", formType: FormType.IMAGE_SELECTOR },
        align: {
            label: "Text Align",
            formType: FormType.SELECT,
            options: ALIGN_OPTIONS,
        },
    },
};
