import { APP_PERMISSIONS } from "../permissions";
import { ROUTES, ROUTE_KEYS, PARENT_KEYS } from "./routes";

/**
 * ✅ labels are now i18n keys (navKey), not hardcoded strings
 * your UI renders: t(language, item.navKey, fallback?)
 */
export interface NavigationMenuItem {
  key: string;
  icon?: string;
  navKey?: string;
  link?: string;
  children?: NavigationMenuItem[];
  access?: (typeof APP_PERMISSIONS)[keyof typeof APP_PERMISSIONS][];
}

export const dashboardMenu: NavigationMenuItem[] = [
  {
    key: ROUTE_KEYS.DASHBOARD,
    icon: ROUTES[ROUTE_KEYS.DASHBOARD].icon!,
    navKey: ROUTES[ROUTE_KEYS.DASHBOARD].navKey,
    link: ROUTES[ROUTE_KEYS.DASHBOARD].path,
    access: ROUTES[ROUTE_KEYS.DASHBOARD].access,
  },

  {
    key: PARENT_KEYS.USERS.key,
    icon: PARENT_KEYS.USERS.icon!,
    navKey: PARENT_KEYS.USERS.navKey,
    access: [APP_PERMISSIONS.VIEW_USERS, APP_PERMISSIONS.ADMIN],
    children: [
      {
        key: ROUTE_KEYS.CREATE_USER,
        navKey: ROUTES[ROUTE_KEYS.CREATE_USER].navKey,
        link: ROUTES[ROUTE_KEYS.CREATE_USER].path,
        icon: ROUTES[ROUTE_KEYS.CREATE_USER].icon!,
        access: ROUTES[ROUTE_KEYS.CREATE_USER].access,
      },
      {
        key: ROUTE_KEYS.USER_LIST,
        navKey: ROUTES[ROUTE_KEYS.USER_LIST].navKey,
        link: ROUTES[ROUTE_KEYS.USER_LIST].path,
        icon: ROUTES[ROUTE_KEYS.USER_LIST].icon!,
        access: ROUTES[ROUTE_KEYS.USER_LIST].access,
      },
    ],
  },

  {
    key: PARENT_KEYS.ROLES.key,
    icon: PARENT_KEYS.ROLES.icon!,
    navKey: PARENT_KEYS.ROLES.navKey,
    access: [APP_PERMISSIONS.VIEW_ROLES, APP_PERMISSIONS.ADMIN],
    children: [
      {
        key: ROUTE_KEYS.CREATE_ROLE,
        navKey: ROUTES[ROUTE_KEYS.CREATE_ROLE].navKey,
        link: ROUTES[ROUTE_KEYS.CREATE_ROLE].path,
        icon: ROUTES[ROUTE_KEYS.CREATE_ROLE].icon!,
        access: ROUTES[ROUTE_KEYS.CREATE_ROLE].access,
      },
      {
        key: ROUTE_KEYS.ROLES_LIST,
        navKey: ROUTES[ROUTE_KEYS.ROLES_LIST].navKey,
        link: ROUTES[ROUTE_KEYS.ROLES_LIST].path,
        icon: ROUTES[ROUTE_KEYS.ROLES_LIST].icon!,
        access: ROUTES[ROUTE_KEYS.ROLES_LIST].access,
      },
    ],
  },

  {
    key: PARENT_KEYS.NEWSLETTERS.key,
    icon: PARENT_KEYS.NEWSLETTERS.icon!,
    navKey: PARENT_KEYS.NEWSLETTERS.navKey,
    access: [APP_PERMISSIONS.VIEW_NEWSLETTER, APP_PERMISSIONS.ADMIN],
    children: [
      {
        key: ROUTE_KEYS.CREATE_NEWSLETTER,
        navKey: ROUTES[ROUTE_KEYS.CREATE_NEWSLETTER].navKey,
        link: ROUTES[ROUTE_KEYS.CREATE_NEWSLETTER].path,
        icon: ROUTES[ROUTE_KEYS.CREATE_NEWSLETTER].icon!,
        access: ROUTES[ROUTE_KEYS.CREATE_NEWSLETTER].access,
      },
      {
        key: ROUTE_KEYS.NEWSLETTER_LIST,
        navKey: ROUTES[ROUTE_KEYS.NEWSLETTER_LIST].navKey,
        link: ROUTES[ROUTE_KEYS.NEWSLETTER_LIST].path,
        icon: ROUTES[ROUTE_KEYS.NEWSLETTER_LIST].icon!,
        access: [APP_PERMISSIONS.VIEW_NEWSLETTER, APP_PERMISSIONS.ADMIN],
      },
    ],
  },

  {
    key: PARENT_KEYS.CAREERS.key,
    icon: PARENT_KEYS.CAREERS.icon!,
    navKey: PARENT_KEYS.CAREERS.navKey,
    access: [APP_PERMISSIONS.VIEW_CAREER, APP_PERMISSIONS.ADMIN],
    children: [
      {
        key: ROUTE_KEYS.CREATE_CAREER,
        navKey: ROUTES[ROUTE_KEYS.CREATE_CAREER].navKey,
        link: ROUTES[ROUTE_KEYS.CREATE_CAREER].path,
        icon: ROUTES[ROUTE_KEYS.CREATE_CAREER].icon!,
        access: ROUTES[ROUTE_KEYS.CREATE_CAREER].access,
      },
      {
        key: ROUTE_KEYS.CAREER_LIST,
        navKey: ROUTES[ROUTE_KEYS.CAREER_LIST].navKey,
        link: ROUTES[ROUTE_KEYS.CAREER_LIST].path,
        icon: ROUTES[ROUTE_KEYS.CAREER_LIST].icon!,
        access: ROUTES[ROUTE_KEYS.CAREER_LIST].access,
      },
    ],
  },

  {
    key: PARENT_KEYS.FILES.key,
    icon: PARENT_KEYS.FILES.icon!,
    navKey: PARENT_KEYS.FILES.navKey,
    access: [APP_PERMISSIONS.VIEW_FILES, APP_PERMISSIONS.ADMIN],
    children: [
      {
        key: ROUTE_KEYS.UPLOAD_FILE,
        navKey: ROUTES[ROUTE_KEYS.UPLOAD_FILE].navKey,
        link: ROUTES[ROUTE_KEYS.UPLOAD_FILE].path,
        icon: ROUTES[ROUTE_KEYS.UPLOAD_FILE].icon!,
        access: ROUTES[ROUTE_KEYS.UPLOAD_FILE].access,
      },
      {
        key: ROUTE_KEYS.FILES_LIST,
        navKey: ROUTES[ROUTE_KEYS.FILES_LIST].navKey,
        link: ROUTES[ROUTE_KEYS.FILES_LIST].path,
        icon: ROUTES[ROUTE_KEYS.FILES_LIST].icon!,
        access: ROUTES[ROUTE_KEYS.FILES_LIST].access,
      },
    ],
  },

  {
    key: PARENT_KEYS.RELATED_BUSINESSES.key,
    icon: PARENT_KEYS.RELATED_BUSINESSES.icon!,
    navKey: PARENT_KEYS.RELATED_BUSINESSES.navKey,
    access: [APP_PERMISSIONS.VIEW_RELATED_BUSINESSES, APP_PERMISSIONS.ADMIN],
    children: [
      {
        key: ROUTE_KEYS.CREATE_RELATED_BUSINESS,
        navKey: ROUTES[ROUTE_KEYS.CREATE_RELATED_BUSINESS].navKey,
        link: ROUTES[ROUTE_KEYS.CREATE_RELATED_BUSINESS].path,
        icon: ROUTES[ROUTE_KEYS.CREATE_RELATED_BUSINESS].icon!,
        access: ROUTES[ROUTE_KEYS.CREATE_RELATED_BUSINESS].access,
      },
      {
        key: ROUTE_KEYS.RELATED_BUSINESSES_LIST,
        navKey: ROUTES[ROUTE_KEYS.RELATED_BUSINESSES_LIST].navKey,
        link: ROUTES[ROUTE_KEYS.RELATED_BUSINESSES_LIST].path,
        icon: ROUTES[ROUTE_KEYS.RELATED_BUSINESSES_LIST].icon!,
        access: ROUTES[ROUTE_KEYS.RELATED_BUSINESSES_LIST].access,
      },
    ],
  },

  {
    key: ROUTE_KEYS.SEND_EMAILS,
    icon: ROUTES[ROUTE_KEYS.SEND_EMAILS].icon!,
    navKey: ROUTES[ROUTE_KEYS.SEND_EMAILS].navKey,
    link: ROUTES[ROUTE_KEYS.SEND_EMAILS].path,
    access: ROUTES[ROUTE_KEYS.SEND_EMAILS].access,
  },
  {
    key: ROUTE_KEYS.PAGES,
    icon: ROUTES[ROUTE_KEYS.PAGES].icon!,
    navKey: ROUTES[ROUTE_KEYS.PAGES].navKey,
    link: ROUTES[ROUTE_KEYS.PAGES].path,
    access: ROUTES[ROUTE_KEYS.PAGES].access,
  },
  {
    key: ROUTE_KEYS.SETTINGS,
    icon: ROUTES[ROUTE_KEYS.SETTINGS].icon!,
    navKey: ROUTES[ROUTE_KEYS.SETTINGS].navKey,
    link: ROUTES[ROUTE_KEYS.SETTINGS].path,
    access: ROUTES[ROUTE_KEYS.SETTINGS].access,
  },
];

export const mainMenu: NavigationMenuItem[] = [
  {
    key: ROUTE_KEYS.HOME,
    icon: ROUTES[ROUTE_KEYS.HOME].icon!,
    navKey: ROUTES[ROUTE_KEYS.HOME].navKey,
    link: ROUTES[ROUTE_KEYS.HOME].path,
  },
  {
    key: ROUTE_KEYS.SERVICES,
    icon: ROUTES[ROUTE_KEYS.SERVICES].icon!,
    navKey: ROUTES[ROUTE_KEYS.SERVICES].navKey,
    link: ROUTES[ROUTE_KEYS.SERVICES].path,
  },
  {
    key: ROUTE_KEYS.ABOUT,
    icon: ROUTES[ROUTE_KEYS.ABOUT].icon!,
    navKey: ROUTES[ROUTE_KEYS.ABOUT].navKey,
    link: ROUTES[ROUTE_KEYS.ABOUT].path,
  },
  {
    key: ROUTE_KEYS.TEAM_MEMBERS,
    icon: ROUTES[ROUTE_KEYS.TEAM_MEMBERS].icon!,
    navKey: ROUTES[ROUTE_KEYS.TEAM_MEMBERS].navKey,
    link: ROUTES[ROUTE_KEYS.TEAM_MEMBERS].path,
  },
  {
    key: ROUTE_KEYS.CAREERS,
    icon: ROUTES[ROUTE_KEYS.CAREERS].icon!,
    navKey: ROUTES[ROUTE_KEYS.CAREERS].navKey,
    link: ROUTES[ROUTE_KEYS.CAREERS].path,
  },
  {
    key: ROUTE_KEYS.NEWSLETTERS,
    icon: ROUTES[ROUTE_KEYS.NEWSLETTERS].icon!,
    navKey: ROUTES[ROUTE_KEYS.NEWSLETTERS].navKey,
    link: ROUTES[ROUTE_KEYS.NEWSLETTERS].path,
  },
  {
    key: ROUTE_KEYS.RELATED_BUSINESSES,
    icon: ROUTES[ROUTE_KEYS.RELATED_BUSINESSES].icon!,
    navKey: ROUTES[ROUTE_KEYS.RELATED_BUSINESSES].navKey,
    link: ROUTES[ROUTE_KEYS.RELATED_BUSINESSES].path,
  },
];
