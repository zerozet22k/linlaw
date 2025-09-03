import {
    FormType,
    GeneralConfig,
    NestedFieldType,
    JsonDesign,
    ArrayDesign,
    ArrayFunctionality,
    ModalBehaviorType,
} from "../../settings";
import {
    SHARED_PAGE_CONTENT_FIELDS,
    SHARED_PAGE_DESIGN_FIELDS,
} from "./shared/sharedPageConfig";
import {
    SharedPageContentType,
    SharedPageDesignType,
} from "./shared/sharedPageTypes";
import { SECTION, SectionProps } from "../../fields/SECTION_SETTINGS";
import { LanguageJson } from "@/utils/getTranslatedText";

const pageName = "careers";

export const CAREER_PAGE_SETTINGS_KEYS = {
    PAGE_CONTENT: `${pageName}-page-content`,
    DESIGN: `${pageName}-design`,
    JOBS_SECTION: `${pageName}-jobs-section`,
} as const;

export const CAREER_PAGE_SETTINGS: GeneralConfig<typeof CAREER_PAGE_SETTINGS_KEYS> =
{
    [CAREER_PAGE_SETTINGS_KEYS.PAGE_CONTENT]: {
        label: "Page Content",
        type: NestedFieldType.JSON,
        design: JsonDesign.PARENT,
        fields: SHARED_PAGE_CONTENT_FIELDS,
    },

    [CAREER_PAGE_SETTINGS_KEYS.DESIGN]: {
        label: "Page Design",
        type: NestedFieldType.JSON,
        design: JsonDesign.PARENT,
        fields: SHARED_PAGE_DESIGN_FIELDS,
    },

    [CAREER_PAGE_SETTINGS_KEYS.JOBS_SECTION]: {
        label: "Jobs (Information Only)",
        type: NestedFieldType.JSON,
        design: JsonDesign.PARENT,
        fields: {
            section: SECTION,

            items: {
                label: "Job Entries",
                keyLabel: "Job",
                type: NestedFieldType.ARRAY,
                arrayDesign: ArrayDesign.FLAT_OUTSIDE,
                arrayFunctionalities: [ArrayFunctionality.SORTABLE, ArrayFunctionality.FILTERABLE],
                modalBehavior: { [ModalBehaviorType.OPEN_IN_MODAL]: false, [ModalBehaviorType.ITEM_MODAL]: true },
                fields: {
                    title: { label: "Job Title", formType: FormType.LANGUAGE_JSON_TEXT },
                    summary: { label: "Short Summary", formType: FormType.LANGUAGE_JSON_TEXTAREA },

                    department: { label: "Department", formType: FormType.TEXT },
                    location: { label: "Location", formType: FormType.TEXT },

                    employmentType: {
                        label: "Employment Type",
                        formType: FormType.SELECT,
                        options: [
                            { label: "Full-time", value: "fullTime" },
                            { label: "Part-time", value: "partTime" },
                            { label: "Contract", value: "contract" },
                            { label: "Internship", value: "internship" },
                            { label: "Temporary", value: "temporary" },
                            { label: "Freelance", value: "freelance" },
                            { label: "Remote", value: "remote" },
                            { label: "Hybrid", value: "hybrid" },
                            { label: "On-site", value: "onsite" },
                        ],
                    },

                    tags: {
                        label: "Tags",
                        keyLabel: "Tag",
                        type: NestedFieldType.ARRAY,
                        arrayDesign: ArrayDesign.FLAT_OUTSIDE,
                        fields: { value: { label: "Tag", formType: FormType.TEXT } },
                    },

                    postedAt: {
                        label: "Posted At",
                        guide: "YYYY-MM-DD",
                        formType: FormType.DATE,
                    },
                    closingDate: {
                        label: "Closing Date",
                        guide: "YYYY-MM-DD",
                        formType: FormType.DATE,
                    },

                    salary: {
                        label: "Salary",
                        type: NestedFieldType.JSON,
                        design: JsonDesign.PARENT,
                        fields: {
                            currency: { label: "Currency (e.g. THB, USD)", formType: FormType.TEXT },
                            min: { label: "Min", formType: FormType.NUMBER },
                            max: { label: "Max", formType: FormType.NUMBER },
                            period: {
                                label: "Period",
                                formType: FormType.SELECT,
                                options: [
                                    { label: "Year", value: "year" },
                                    { label: "Month", value: "month" },
                                    { label: "Day", value: "day" },
                                    { label: "Hour", value: "hour" },
                                ],
                            },
                        },
                    },

                    description: { label: "Description", formType: FormType.LANGUAGE_JSON_TEXTAREA },

                    responsibilities: {
                        label: "Responsibilities",
                        keyLabel: "Item",
                        type: NestedFieldType.ARRAY,
                        arrayDesign: ArrayDesign.FLAT_OUTSIDE,
                        arrayFunctionalities: [ArrayFunctionality.SORTABLE],
                        fields: { text: { label: "Text", formType: FormType.LANGUAGE_JSON_TEXTAREA } },
                    },

                    requirements: {
                        label: "Requirements",
                        keyLabel: "Item",
                        type: NestedFieldType.ARRAY,
                        arrayDesign: ArrayDesign.FLAT_OUTSIDE,
                        arrayFunctionalities: [ArrayFunctionality.SORTABLE],
                        fields: { text: { label: "Text", formType: FormType.LANGUAGE_JSON_TEXTAREA } },
                    },

                    benefits: {
                        label: "Benefits",
                        keyLabel: "Item",
                        type: NestedFieldType.ARRAY,
                        arrayDesign: ArrayDesign.FLAT_OUTSIDE,
                        arrayFunctionalities: [ArrayFunctionality.SORTABLE],
                        fields: { text: { label: "Text", formType: FormType.LANGUAGE_JSON_TEXTAREA } },
                    },
                },
            },
        },
    },
};

export type CAREER_PAGE_SETTINGS_TYPES = {
    [CAREER_PAGE_SETTINGS_KEYS.PAGE_CONTENT]: SharedPageContentType;
    [CAREER_PAGE_SETTINGS_KEYS.DESIGN]: SharedPageDesignType;

    [CAREER_PAGE_SETTINGS_KEYS.JOBS_SECTION]: {
        section?: SectionProps;
        items: {
            title: LanguageJson;
            summary?: LanguageJson;

            department?: string;
            location?: string;
            employmentType?:
            | "fullTime" | "partTime" | "contract" | "internship" | "temporary"
            | "freelance" | "remote" | "hybrid" | "onsite";

            tags?: { value: string }[];
            postedAt?: string;
            closingDate?: string;

            salary?: {
                currency?: string;
                min?: number;
                max?: number;
                period?: "year" | "month" | "day" | "hour";
            };

            description?: LanguageJson;
            responsibilities?: { text: LanguageJson }[];
            requirements?: { text: LanguageJson }[];
            benefits?: { text: LanguageJson }[];
        }[];
    };
};
