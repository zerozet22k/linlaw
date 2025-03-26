import { LanguageJson } from "@/utils/getTranslatedText";

export type CardStyle = "default" | "shadow" | "borderless";
export type AnimationStyle = "none" | "fade-in" | "slide-up" | "scale-in";
export type TextAlign = "left" | "center" | "right";

export type SharedPageContentType = {
  title: LanguageJson;
  subtitle: LanguageJson;
  description: LanguageJson;
  backgroundImage?: string;
};

export type SharedPageDesignType = {
  columnCount: string;
  gridGutter: string;
  cardStyle: CardStyle;
  typography: {
    titleSize: string;
    descriptionSize: string;
    color: string;
  };
  animation: AnimationStyle;
  showIcons: boolean;
  showImages: boolean;
  borderRadius: string;
  textAlign: TextAlign;
};
