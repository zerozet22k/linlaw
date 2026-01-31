import { APP_PERMISSIONS, AppPermissionType } from "../permissions";

export const PARENT_KEYS = {
  USERS: { key: "users", icon: "TeamOutlined", navKey: "nav.parents.users" },
  ROLES: { key: "roles", icon: "TeamOutlined", navKey: "nav.parents.roles" },
  FILES: { key: "files", icon: "UploadOutlined", navKey: "nav.parents.files" },
  NEWSLETTERS: {
    key: "newsletters",
    icon: "MailOutlined",
    navKey: "nav.parents.newsletters",
  },
  RELATED_BUSINESSES: {
    key: "related-businesses",
    icon: "ApartmentOutlined",
    navKey: "nav.parents.relatedBusinesses",
  },
} as const;

export const ROUTE_KEYS = {
  DASHBOARD: "dashboard",
  USER_LIST: "user-list",
  CREATE_USER: "create-user",
  EDIT_USER: "edit-user",
  ROLES_LIST: "roles-list",
  CREATE_ROLE: "create-role",
  EDIT_ROLE: "edit-role",
  FILES_LIST: "files-list",
  UPLOAD_FILE: "upload-file",
  SETTINGS: "settings",
  PAGES: "pages",
  HOME: "home",
  ABOUT: "about",
  SERVICES: "services",

  TEAM_MEMBERS: "team-members",
  TEAM_MEMBER_INFO: "team-member-info", // ✅ public detail route

  CAREERS: "careers",
  LOGIN: "login",
  REGISTER: "register",
  FORGOT_PASSWORD: "forgot-password",
  PROFILE: "profile",

  SEND_EMAILS: "send-emails",

  NEWSLETTER_LIST: "newsletter-list",
  CREATE_NEWSLETTER: "create-newsletter",
  EDIT_NEWSLETTER: "edit-newsletter",

  NEWSLETTERS: "newsletters",
  NEWSLETTER_INFO: "newsletters-info", // ✅ public detail route

  RELATED_BUSINESSES_LIST: "related-businesses-list",
  CREATE_RELATED_BUSINESS: "create-related-business",
  EDIT_RELATED_BUSINESS: "edit-related-business",

  RELATED_BUSINESSES: "related-businesses",
  RELATED_BUSINESS_INFO: "related-business-info", // ✅ public detail route

  // ✅ missing dashboard detail routes
  DASHBOARD_NEWSLETTER_INFO: "dashboard-newsletter-info",
  DASHBOARD_RELATED_BUSINESS_INFO: "dashboard-related-business-info",
} as const;

export type RouteKey = (typeof ROUTE_KEYS)[keyof typeof ROUTE_KEYS];

export const dashboardRoute = "/dashboard";

export type RouteConfig = {
  key: RouteKey;
  path: string;
  navKey?: string;
  icon?: string | null;
  access?: AppPermissionType[];
  loginRequired?: boolean;
  IfNotLoggedInRedirectUrl?: string;
  IfLoggedInRedirectUrl?: string;
  noAccessMessage?: string;
  exactMatch?: boolean;
  showGoTop?: boolean;
};

export const ROUTES: Record<RouteKey, RouteConfig> = {
  [ROUTE_KEYS.DASHBOARD]: {
    key: ROUTE_KEYS.DASHBOARD,
    path: dashboardRoute,
    navKey: "nav.routes.dashboard",
    icon: "DashboardOutlined",
    access: [APP_PERMISSIONS.VIEW_DASHBOARD],
    loginRequired: true,
    IfNotLoggedInRedirectUrl: "/login?redirect=/dashboard",
  },

  [ROUTE_KEYS.PROFILE]: {
    key: ROUTE_KEYS.PROFILE,
    path: "/profile",
    navKey: "nav.routes.profile",
    icon: "UserOutlined",
    loginRequired: true,
    IfNotLoggedInRedirectUrl: "/login?redirect=/profile",
  },

  [ROUTE_KEYS.USER_LIST]: {
    key: ROUTE_KEYS.USER_LIST,
    path: `${dashboardRoute}/users`,
    navKey: "nav.routes.userList",
    icon: "TeamOutlined",
    access: [APP_PERMISSIONS.VIEW_USERS, APP_PERMISSIONS.ADMIN],
    loginRequired: true,
  },
  [ROUTE_KEYS.CREATE_USER]: {
    key: ROUTE_KEYS.CREATE_USER,
    path: `${dashboardRoute}/users/create`,
    navKey: "nav.routes.createUser",
    icon: "UserOutlined",
    access: [APP_PERMISSIONS.CREATE_USER, APP_PERMISSIONS.ADMIN],
    loginRequired: true,
  },
  [ROUTE_KEYS.EDIT_USER]: {
    key: ROUTE_KEYS.EDIT_USER,
    path: `${dashboardRoute}/users/edit/:id`,
    navKey: "nav.routes.editUser",
    icon: null,
    access: [APP_PERMISSIONS.EDIT_USER, APP_PERMISSIONS.ADMIN],
    loginRequired: true,
    exactMatch: true,
    noAccessMessage: "You do not have permission to edit this user.",
  },

  [ROUTE_KEYS.ROLES_LIST]: {
    key: ROUTE_KEYS.ROLES_LIST,
    path: `${dashboardRoute}/roles`,
    navKey: "nav.routes.rolesList",
    icon: "TeamOutlined",
    access: [APP_PERMISSIONS.VIEW_ROLES, APP_PERMISSIONS.ADMIN],
    loginRequired: true,
  },
  [ROUTE_KEYS.CREATE_ROLE]: {
    key: ROUTE_KEYS.CREATE_ROLE,
    path: `${dashboardRoute}/roles/create`,
    navKey: "nav.routes.createRole",
    icon: "FormOutlined",
    access: [APP_PERMISSIONS.CREATE_ROLE, APP_PERMISSIONS.ADMIN],
    loginRequired: true,
  },
  [ROUTE_KEYS.EDIT_ROLE]: {
    key: ROUTE_KEYS.EDIT_ROLE,
    path: `${dashboardRoute}/roles/edit/:id`,
    navKey: "nav.routes.editRole",
    icon: null,
    access: [APP_PERMISSIONS.EDIT_ROLE, APP_PERMISSIONS.ADMIN],
    loginRequired: true,
    exactMatch: true,
  },

  [ROUTE_KEYS.NEWSLETTER_LIST]: {
    key: ROUTE_KEYS.NEWSLETTER_LIST,
    path: `${dashboardRoute}/newsletters`,
    navKey: "nav.routes.newsletterList",
    icon: "MailOutlined",
    access: [APP_PERMISSIONS.VIEW_NEWSLETTER, APP_PERMISSIONS.ADMIN],
    loginRequired: true,
    IfNotLoggedInRedirectUrl: "/login?redirect=/dashboard/newsletters",
  },

  [ROUTE_KEYS.CREATE_NEWSLETTER]: {
    key: ROUTE_KEYS.CREATE_NEWSLETTER,
    path: `${dashboardRoute}/newsletters/create`,
    navKey: "nav.routes.createNewsletter",
    icon: "EditOutlined",
    access: [APP_PERMISSIONS.CREATE_NEWSLETTER, APP_PERMISSIONS.ADMIN],
    loginRequired: true,
  },

  // existing dashboard edit route
  [ROUTE_KEYS.EDIT_NEWSLETTER]: {
    key: ROUTE_KEYS.EDIT_NEWSLETTER,
    path: `${dashboardRoute}/newsletters/:id`,
    navKey: "nav.routes.editNewsletter",
    icon: null,
    access: [APP_PERMISSIONS.EDIT_NEWSLETTER, APP_PERMISSIONS.ADMIN],
    loginRequired: true,
    noAccessMessage: "You do not have permission to edit this newsletter.",
    exactMatch: true,
  },

  // ✅ added: dashboard info route (same path as EDIT, but separate key if you want different title/behavior)
  // If you don’t need a separate route key, remove this block.
  [ROUTE_KEYS.DASHBOARD_NEWSLETTER_INFO]: {
    key: ROUTE_KEYS.DASHBOARD_NEWSLETTER_INFO,
    path: `${dashboardRoute}/newsletters/:newsletterId`,
    navKey: "nav.routes.dashboardNewsletterInfo",
    icon: null,
    access: [APP_PERMISSIONS.VIEW_NEWSLETTER, APP_PERMISSIONS.ADMIN],
    loginRequired: true,
    exactMatch: true,
  },

  [ROUTE_KEYS.RELATED_BUSINESSES_LIST]: {
    key: ROUTE_KEYS.RELATED_BUSINESSES_LIST,
    path: `${dashboardRoute}/related-businesses`,
    navKey: "nav.routes.relatedBusinessesList",
    icon: "ApartmentOutlined",
    access: [APP_PERMISSIONS.VIEW_RELATED_BUSINESSES, APP_PERMISSIONS.ADMIN],
    loginRequired: true,
  },
  [ROUTE_KEYS.CREATE_RELATED_BUSINESS]: {
    key: ROUTE_KEYS.CREATE_RELATED_BUSINESS,
    path: `${dashboardRoute}/related-businesses/create`,
    navKey: "nav.routes.createRelatedBusiness",
    icon: "PlusOutlined",
    access: [APP_PERMISSIONS.ADMIN],
    loginRequired: true,
  },

  // existing dashboard edit route
  [ROUTE_KEYS.EDIT_RELATED_BUSINESS]: {
    key: ROUTE_KEYS.EDIT_RELATED_BUSINESS,
    path: `${dashboardRoute}/related-businesses/:id`,
    navKey: "nav.routes.editRelatedBusiness",
    icon: null,
    access: [APP_PERMISSIONS.ADMIN],
    loginRequired: true,
    exactMatch: true,
    noAccessMessage: "You do not have permission to edit this related business.",
  },

  // ✅ added: dashboard info route (optional)
  // If you don’t need it separate from EDIT, remove this block.
  [ROUTE_KEYS.DASHBOARD_RELATED_BUSINESS_INFO]: {
    key: ROUTE_KEYS.DASHBOARD_RELATED_BUSINESS_INFO,
    path: `${dashboardRoute}/related-businesses/:relatedBusinessId`,
    navKey: "nav.routes.dashboardRelatedBusinessInfo",
    icon: null,
    access: [APP_PERMISSIONS.VIEW_RELATED_BUSINESSES, APP_PERMISSIONS.ADMIN],
    loginRequired: true,
    exactMatch: true,
  },

  [ROUTE_KEYS.FILES_LIST]: {
    key: ROUTE_KEYS.FILES_LIST,
    path: `${dashboardRoute}/files`,
    navKey: "nav.routes.filesList",
    icon: "FolderOutlined",
    access: [APP_PERMISSIONS.VIEW_FILES, APP_PERMISSIONS.ADMIN],
    loginRequired: true,
    IfNotLoggedInRedirectUrl: "/login?redirect=/dashboard/files",
    noAccessMessage: "You do not have permission to view files.",
  },
  [ROUTE_KEYS.UPLOAD_FILE]: {
    key: ROUTE_KEYS.UPLOAD_FILE,
    path: `${dashboardRoute}/files/upload`,
    navKey: "nav.routes.uploadFile",
    icon: "UploadOutlined",
    access: [APP_PERMISSIONS.UPLOAD_FILE, APP_PERMISSIONS.ADMIN],
    loginRequired: true,
    IfNotLoggedInRedirectUrl: "/login?redirect=/dashboard/files/upload",
    noAccessMessage: "You do not have permission to upload files.",
  },

  [ROUTE_KEYS.SEND_EMAILS]: {
    key: ROUTE_KEYS.SEND_EMAILS,
    path: `${dashboardRoute}/send-emails`,
    navKey: "nav.routes.sendEmails",
    icon: "MailOutlined",
    access: [APP_PERMISSIONS.ADMIN, APP_PERMISSIONS.SEND_EMAIL],
    loginRequired: true,
    IfNotLoggedInRedirectUrl: "/login?redirect=/dashboard/send-emails",
    noAccessMessage: "You do not have permission to send emails.",
  },

  [ROUTE_KEYS.PAGES]: {
    key: ROUTE_KEYS.PAGES,
    path: `${dashboardRoute}/pages`,
    navKey: "nav.routes.pages",
    icon: "FileTextOutlined",
    access: [APP_PERMISSIONS.EDIT_PAGES, APP_PERMISSIONS.ADMIN],
    loginRequired: true,
  },
  [ROUTE_KEYS.SETTINGS]: {
    key: ROUTE_KEYS.SETTINGS,
    path: `${dashboardRoute}/settings`,
    navKey: "nav.routes.settings",
    icon: "SettingOutlined",
    access: [APP_PERMISSIONS.EDIT_SETTINGS, APP_PERMISSIONS.ADMIN],
    loginRequired: true,
  },

  // public routes
  [ROUTE_KEYS.HOME]: {
    key: ROUTE_KEYS.HOME,
    path: "/",
    navKey: "nav.routes.home",
    icon: "HomeOutlined",
    loginRequired: false,
    showGoTop: true,
  },
  [ROUTE_KEYS.ABOUT]: {
    key: ROUTE_KEYS.ABOUT,
    path: "/#about",
    navKey: "nav.routes.about",
    icon: "InfoCircleOutlined",
    loginRequired: false,
    showGoTop: true,
  },
  [ROUTE_KEYS.SERVICES]: {
    key: ROUTE_KEYS.SERVICES,
    path: "/#services",
    navKey: "nav.routes.services",
    icon: "AppstoreOutlined",
    loginRequired: false,
    showGoTop: true,
  },

  [ROUTE_KEYS.TEAM_MEMBERS]: {
    key: ROUTE_KEYS.TEAM_MEMBERS,
    path: "/team-members",
    navKey: "nav.routes.teamMembers",
    icon: "SolutionOutlined",
    loginRequired: false,
    showGoTop: true,
  },

  // ✅ added public detail route
  [ROUTE_KEYS.TEAM_MEMBER_INFO]: {
    key: ROUTE_KEYS.TEAM_MEMBER_INFO,
    path: "/team-members/:id",
    navKey: "nav.routes.teamMemberInfo",
    icon: "SolutionOutlined",
    loginRequired: false,
    showGoTop: true,
    exactMatch: true,
  },

  [ROUTE_KEYS.NEWSLETTERS]: {
    key: ROUTE_KEYS.NEWSLETTERS,
    path: "/newsletters",
    navKey: "nav.routes.newsletters",
    icon: "FileTextOutlined",
    loginRequired: false,
    showGoTop: true,
  },

  [ROUTE_KEYS.NEWSLETTER_INFO]: {
    key: ROUTE_KEYS.NEWSLETTER_INFO,
    path: "/newsletters/:id",
    navKey: "nav.routes.newsletterInfo",
    icon: "FileTextOutlined",
    loginRequired: false,
    showGoTop: true,
    exactMatch: true,
  },

  [ROUTE_KEYS.RELATED_BUSINESSES]: {
    key: ROUTE_KEYS.RELATED_BUSINESSES,
    path: "/related-businesses",
    navKey: "nav.routes.relatedBusinesses",
    icon: "ApartmentOutlined",
    loginRequired: false,
    showGoTop: true,
  },
  
  [ROUTE_KEYS.RELATED_BUSINESS_INFO]: {
    key: ROUTE_KEYS.RELATED_BUSINESS_INFO,
    path: "/related-businesses/:slug",
    navKey: "nav.routes.relatedBusinessInfo",
    icon: "ApartmentOutlined",
    loginRequired: false,
    showGoTop: true,
    exactMatch: true,
  },

  [ROUTE_KEYS.CAREERS]: {
    key: ROUTE_KEYS.CAREERS,
    path: "/careers",
    navKey: "nav.routes.careers",
    icon: "IdcardOutlined",
    loginRequired: false,
    showGoTop: true,
  },

  // auth routes
  [ROUTE_KEYS.LOGIN]: {
    key: ROUTE_KEYS.LOGIN,
    path: "/login",
    navKey: "nav.routes.login",
    IfLoggedInRedirectUrl: "/dashboard",
  },

  [ROUTE_KEYS.REGISTER]: {
    key: ROUTE_KEYS.REGISTER,
    path: "/signup",
    IfLoggedInRedirectUrl: "/dashboard",
  },

  [ROUTE_KEYS.FORGOT_PASSWORD]: {
    key: ROUTE_KEYS.FORGOT_PASSWORD,
    path: "/forget-password",
    navKey: "nav.routes.forgotPassword",
    icon: "KeyOutlined",
    IfLoggedInRedirectUrl: "/dashboard",
  },
};
