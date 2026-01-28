# Linlaw

**⚠ Proprietary Project — Not for Public Use**

This repository contains the source code for the Linlaw web application.  
It is a **sold and licensed project** intended for internal or client use only.

---

## License

All rights reserved © 2025.  
Reproduction, modification, or distribution of this repository’s code — in whole or in part — without prior written consent is strictly forbidden.

```
linlaw
├─ .eslintrc.json
├─ .VSCodeCounter
│  ├─ 2025-10-28_10-19-44
│  └─ 2026-01-22_21-20-39
│     ├─ details.md
│     ├─ diff-details.md
│     ├─ diff.csv
│     ├─ diff.md
│     ├─ diff.txt
│     ├─ results.csv
│     ├─ results.json
│     ├─ results.md
│     └─ results.txt
├─ cors.json
├─ next.config.mjs
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ public
│  └─ images
│     ├─ default-avatar.webp
│     ├─ favicon.ico
│     ├─ googlec6edda4dd1f1d963.html
│     ├─ logo.png
│     ├─ logo.svg
│     ├─ product-logo.webp
│     └─ site.webmanifest
├─ push_all.bat
├─ README.md
├─ scripts
├─ src
│  ├─ app
│  │  ├─ api
│  │  │  ├─ auth
│  │  │  │  ├─ login
│  │  │  │  │  └─ route.tsx
│  │  │  │  ├─ refresh
│  │  │  │  │  └─ route.tsx
│  │  │  │  └─ signup
│  │  │  │     └─ route.tsx
│  │  │  ├─ contact-us
│  │  │  │  └─ route.ts
│  │  │  ├─ data
│  │  │  │  └─ route.ts
│  │  │  ├─ files
│  │  │  │  ├─ route.ts
│  │  │  │  ├─ signedUrl
│  │  │  │  │  └─ route.ts
│  │  │  │  ├─ sync
│  │  │  │  │  └─ route.ts
│  │  │  │  └─ [id]
│  │  │  │     └─ route.ts
│  │  │  ├─ inquiry
│  │  │  │  ├─ route.ts
│  │  │  │  └─ [id]
│  │  │  │     ├─ reply
│  │  │  │     │  ├─ index.ts
│  │  │  │     │  └─ [replyId].ts
│  │  │  │     └─ route.ts
│  │  │  ├─ me
│  │  │  │  ├─ getSignedUrl
│  │  │  │  │  └─ route.ts
│  │  │  │  └─ route.ts
│  │  │  ├─ newsletters
│  │  │  │  ├─ route.ts
│  │  │  │  └─ [newsletterId]
│  │  │  │     ├─ attachment
│  │  │  │     │  ├─ route.ts
│  │  │  │     │  ├─ signurl
│  │  │  │     │  │  └─ route.ts
│  │  │  │     │  └─ [attachmentId]
│  │  │  │     │     └─ route.ts
│  │  │  │     └─ route.ts
│  │  │  ├─ pages
│  │  │  │  └─ route.ts
│  │  │  ├─ related-businesses
│  │  │  │  ├─ id
│  │  │  │  │  └─ [id]
│  │  │  │  │     └─ route.ts
│  │  │  │  ├─ route.ts
│  │  │  │  └─ slug
│  │  │  │     └─ [slug]
│  │  │  │        └─ route.ts
│  │  │  ├─ roles
│  │  │  │  ├─ route.ts
│  │  │  │  └─ [id]
│  │  │  │     └─ route.ts
│  │  │  ├─ send-emails
│  │  │  │  └─ route.ts
│  │  │  ├─ settings
│  │  │  │  ├─ key
│  │  │  │  │  └─ [key]
│  │  │  │  │     └─ route.ts
│  │  │  │  ├─ public
│  │  │  │  │  └─ route.ts
│  │  │  │  └─ route.ts
│  │  │  ├─ setup
│  │  │  │  └─ route.ts
│  │  │  ├─ team
│  │  │  │  ├─ route.ts
│  │  │  │  └─ [id]
│  │  │  │     └─ route.ts
│  │  │  └─ users
│  │  │     ├─ route.ts
│  │  │     └─ [id]
│  │  │        ├─ getSignedUrl
│  │  │        │  └─ route.ts
│  │  │        └─ route.ts
│  │  ├─ careers
│  │  │  ├─ content.tsx
│  │  │  └─ page.tsx
│  │  ├─ content.tsx
│  │  ├─ dashboard
│  │  │  ├─ files
│  │  │  │  ├─ page.tsx
│  │  │  │  └─ upload
│  │  │  │     └─ page.tsx
│  │  │  ├─ newsletters
│  │  │  │  ├─ create
│  │  │  │  │  └─ page.tsx
│  │  │  │  ├─ page.tsx
│  │  │  │  └─ [newsletterId]
│  │  │  │     └─ page.tsx
│  │  │  ├─ page.tsx
│  │  │  ├─ pages
│  │  │  │  └─ page.tsx
│  │  │  ├─ related-businesses
│  │  │  │  ├─ create
│  │  │  │  │  └─ page.tsx
│  │  │  │  ├─ page.tsx
│  │  │  │  └─ [id]
│  │  │  │     └─ page.tsx
│  │  │  ├─ roles
│  │  │  │  ├─ create
│  │  │  │  │  └─ page.tsx
│  │  │  │  ├─ page.tsx
│  │  │  │  └─ [id]
│  │  │  │     └─ page.tsx
│  │  │  ├─ send-emails
│  │  │  │  └─ page.tsx
│  │  │  ├─ settings
│  │  │  │  └─ page.tsx
│  │  │  └─ users
│  │  │     ├─ create
│  │  │     │  └─ page.tsx
│  │  │     ├─ page.tsx
│  │  │     └─ [id]
│  │  │        └─ page.tsx
│  │  ├─ inquiry
│  │  │  ├─ create
│  │  │  │  └─ page.tsx
│  │  │  ├─ page.tsx
│  │  │  └─ [id]
│  │  │     └─ page.tsx
│  │  ├─ layout-content.tsx
│  │  ├─ layout.tsx
│  │  ├─ login
│  │  │  └─ page.tsx
│  │  ├─ newsletters
│  │  │  ├─ content.tsx
│  │  │  ├─ page.tsx
│  │  │  └─ [id]
│  │  │     └─ page.tsx
│  │  ├─ page.tsx
│  │  ├─ pageid.tsx
│  │  ├─ profile
│  │  │  └─ page.tsx
│  │  ├─ related-businesses
│  │  │  ├─ content.tsx
│  │  │  ├─ page.tsx
│  │  │  └─ [slug]
│  │  │     └─ page.tsx
│  │  ├─ signup
│  │  │  └─ page.tsx
│  │  └─ team-members
│  │     ├─ content.tsx
│  │     ├─ page.tsx
│  │     └─ [id]
│  │        ├─ page.tsx
│  │        └─ TeamMemberPage.css
│  ├─ components
│  │  ├─ FileUploader
│  │  │  ├─ FileUploader.tsx
│  │  │  └─ UploadProgressList.tsx
│  │  ├─ FormBuilder
│  │  │  ├─ Arrays
│  │  │  │  ├─ ArrayChildDesignRenderer.tsx
│  │  │  │  ├─ ArrayChildDesigns
│  │  │  │  │  ├─ ArrayChildCardDesign.tsx
│  │  │  │  │  ├─ ArrayChildListDesign.tsx
│  │  │  │  │  ├─ ArrayChildNoneDesign.tsx
│  │  │  │  │  └─ ArrayChildTableDesign.tsx
│  │  │  │  ├─ ArrayDesignRenderer.tsx
│  │  │  │  ├─ ArrayDesigns
│  │  │  │  │  ├─ ArrayDefaultCard.tsx
│  │  │  │  │  ├─ ArrayFlatCard.tsx
│  │  │  │  │  ├─ ArrayFlatOutsideCard.tsx
│  │  │  │  │  ├─ ArrayNoneCard.tsx
│  │  │  │  │  └─ ArrayParentCard.tsx
│  │  │  │  └─ ArrayFieldRenderer.tsx
│  │  │  ├─ CombinedField.tsx
│  │  │  ├─ CustomModal.tsx
│  │  │  ├─ Fields
│  │  │  │  ├─ extra
│  │  │  │  │  └─ FieldTitle.tsx
│  │  │  │  ├─ FieldDesignRenderer.tsx
│  │  │  │  ├─ FieldDesigns
│  │  │  │  │  ├─ FieldDefaultCard.tsx
│  │  │  │  │  ├─ FieldParentCard.tsx
│  │  │  │  │  └─ FieldRow.tsx
│  │  │  │  ├─ FieldRenderer.tsx
│  │  │  │  └─ Inputs
│  │  │  │     ├─ BoxSidesInput.tsx
│  │  │  │     ├─ DateInput.tsx
│  │  │  │     ├─ DateTimeInput.tsx
│  │  │  │     ├─ GeneralInput.tsx
│  │  │  │     ├─ IconSelector.tsx
│  │  │  │     ├─ LanguageJsonTextarea.tsx
│  │  │  │     ├─ LanguageJsonTextInput.tsx
│  │  │  │     ├─ MediaSelector.tsx
│  │  │  │     ├─ ResponsiveImagesInput.tsx
│  │  │  │     ├─ RoleSelector.tsx
│  │  │  │     ├─ SizeInput.tsx
│  │  │  │     ├─ sortable
│  │  │  │     │  └─ SortableTag.tsx
│  │  │  │     ├─ SupportedLanguageSelector.module.css
│  │  │  │     ├─ SupportedLanguageSelector.tsx
│  │  │  │     ├─ SwitchInput.tsx
│  │  │  │     ├─ TimeInput.tsx
│  │  │  │     ├─ UserSelector.tsx
│  │  │  │     └─ UsersSelector.tsx
│  │  │  ├─ InputStyle.ts
│  │  │  ├─ Jsons
│  │  │  │  ├─ JsonChildDesignRenderer.tsx
│  │  │  │  ├─ JsonDesignRenderer.tsx
│  │  │  │  ├─ JsonDesigns
│  │  │  │  │  ├─ JsonDefaultCard.tsx
│  │  │  │  │  ├─ JsonFlatCard.tsx
│  │  │  │  │  ├─ JsonFlatOutsideCard.tsx
│  │  │  │  │  ├─ JsonNone.tsx
│  │  │  │  │  └─ JsonParentCard.tsx
│  │  │  │  └─ JsonFieldRenderer.tsx
│  │  │  └─ SortableItem.tsx
│  │  ├─ forms
│  │  │  ├─ NewsletterForm.tsx
│  │  │  ├─ ProfileUpdateForm.tsx
│  │  │  ├─ RelatedBusinessForm.tsx
│  │  │  ├─ RoleForm.tsx
│  │  │  ├─ SetupForm.tsx
│  │  │  └─ UserForm.tsx
│  │  ├─ inputs
│  │  │  ├─ ImageCropper.tsx
│  │  │  ├─ LanguageTextInput.tsx
│  │  │  ├─ ProfileAvatar.tsx
│  │  │  ├─ PublicAPIDynamicDropdown.tsx
│  │  │  ├─ PublicAPIDynamicMultiSelect.tsx
│  │  │  ├─ RichTextEditor.css
│  │  │  ├─ RichTextEditor.tsx
│  │  │  └─ standalone
│  │  │     ├─ ImageSelection.tsx
│  │  │     ├─ LanguageJsonTextarea.tsx
│  │  │     ├─ LanguageJsonTextInput.tsx
│  │  │     ├─ LanguageSelection.tsx
│  │  │     ├─ RoleSelection.tsx
│  │  │     └─ UserSelection.tsx
│  │  ├─ loaders
│  │  │  ├─ InlineLoader.tsx
│  │  │  ├─ LoadingSpin.tsx
│  │  │  ├─ LoadingSpinner.tsx
│  │  │  ├─ ProtectedPage.tsx
│  │  │  └─ SubLoader.tsx
│  │  ├─ modals
│  │  │  └─ FileSelectionModal.tsx
│  │  ├─ RelatedBusinessCard.tsx
│  │  ├─ sections
│  │  │  ├─ AboutUsSection.tsx
│  │  │  ├─ ClickToAction.tsx
│  │  │  ├─ CustomCarousel.tsx
│  │  │  ├─ FAQSection.tsx
│  │  │  ├─ HeroSliderSection.css
│  │  │  ├─ HeroSliderSection.tsx
│  │  │  ├─ NewsletterSection.tsx
│  │  │  ├─ PromoShowcaseSection.tsx
│  │  │  ├─ RelatedBusinessesSection.tsx
│  │  │  ├─ ServicesSection.tsx
│  │  │  ├─ TeamSection.tsx
│  │  │  └─ TestimonialsSection.tsx
│  │  └─ ui
│  │     ├─ FileThumbnail.tsx
│  │     ├─ ImageComponent.tsx
│  │     ├─ PageWrapper.tsx
│  │     ├─ SocialLink.tsx
│  │     ├─ SocialLinks.tsx
│  │     └─ UserAvatar.tsx
│  ├─ config
│  │  ├─ CMS
│  │  │  ├─ fields
│  │  │  │  └─ SECTION_SETTINGS.tsx
│  │  │  ├─ pages
│  │  │  │  ├─ keys
│  │  │  │  │  ├─ CAREER_PAGE_SETTINGS.ts
│  │  │  │  │  ├─ HOME_PAGE_SETTINGS.ts
│  │  │  │  │  ├─ NEWSLETTER_PAGE_SETTINGS.tsx
│  │  │  │  │  ├─ RELATED_BUSINESSES_PAGE_SETTINGS.ts
│  │  │  │  │  ├─ shared
│  │  │  │  │  │  ├─ sharedPageConfig.ts
│  │  │  │  │  │  └─ sharedPageTypes.ts
│  │  │  │  │  └─ TEAM_PAGE_SETTINGS.tsx
│  │  │  │  └─ pageKeys.ts
│  │  │  └─ settings
│  │  │     ├─ index.ts
│  │  │     ├─ keys
│  │  │     │  ├─ DESIGN_SCHEMA_KEYS.ts
│  │  │     │  ├─ FIREBASE_SETTINGS_KEYS.ts
│  │  │     │  ├─ GLOBAL_SETTINGS_KEYS.ts
│  │  │     │  ├─ LANGUAGE_SETTINGS_KEYS.ts
│  │  │     │  ├─ MAIL_KEYS.ts
│  │  │     │  ├─ MESSAGING_SERVICE_KEYS.ts
│  │  │     │  ├─ PUSHER_SETTINGS_KEYS.ts
│  │  │     │  ├─ SEO_SETTINGS_KEYS.ts
│  │  │     │  └─ SOCIAL_MEDIA_KEYS.ts
│  │  │     └─ settingKeys.ts
│  │  ├─ navigations
│  │  │  ├─ IconMapper.tsx
│  │  │  ├─ menu.ts
│  │  │  └─ navigationMenu.tsx
│  │  ├─ permissions.ts
│  │  └─ routes.ts
│  ├─ contexts
│  │  ├─ FileContext.tsx
│  │  ├─ LanguageContext.tsx
│  │  ├─ LayoutContext.tsx
│  │  ├─ SettingsContext.tsx
│  │  └─ UserContext.tsx
│  ├─ db
│  │  └─ index.ts
│  ├─ hooks
│  │  ├─ useFetchFiles.ts
│  │  ├─ useFile.ts
│  │  ├─ useFileModal.ts
│  │  ├─ useFileUpload.ts
│  │  ├─ useFirebaseConfig.ts
│  │  ├─ useLanguage.tsx
│  │  ├─ useLayout.ts
│  │  ├─ useSettings.ts
│  │  └─ useUser.ts
│  ├─ layouts
│  │  ├─ DashboardLayout.tsx
│  │  ├─ MainLayout.tsx
│  │  └─ OverlayBar.tsx
│  ├─ middlewares
│  │  ├─ authMiddleware.ts
│  │  └─ verifyServerAuth.ts
│  ├─ models
│  │  ├─ CacheModel.ts
│  │  ├─ constants.ts
│  │  ├─ FileModel.ts
│  │  ├─ index.ts
│  │  ├─ InquiryModel.ts
│  │  ├─ languages.ts
│  │  ├─ Newsletter.ts
│  │  ├─ PageModel.ts
│  │  ├─ RelatedBusinessModel.ts
│  │  ├─ RoleModel.ts
│  │  ├─ SettingModel.ts
│  │  ├─ TeamBlock.ts
│  │  ├─ UserModel.ts
│  │  └─ Users
│  │     └─ DeviceToken.ts
│  ├─ providers
│  │  ├─ AppProvider.tsx
│  │  ├─ CustomConfigProvider.tsx
│  │  ├─ FileProvider.tsx
│  │  ├─ LanguageProvider.tsx
│  │  ├─ LayoutProvider.tsx
│  │  ├─ PusherProvider.tsx
│  │  ├─ SettingsProvider.tsx
│  │  └─ UserProvider.tsx
│  ├─ repositories
│  │  ├─ CacheRepository.ts
│  │  ├─ FileRepository.ts
│  │  ├─ index.ts
│  │  ├─ InquiryRepository.ts
│  │  ├─ NewsletterRepository.ts
│  │  ├─ PageRepository.ts
│  │  ├─ RelatedBusinessRepository.ts
│  │  ├─ RoleRepository.ts
│  │  ├─ SettingRepository.ts
│  │  └─ UserRepository.ts
│  ├─ router
│  │  └─ LayoutRouter.tsx
│  ├─ services
│  │  ├─ FileService.ts
│  │  ├─ InquiryService.ts
│  │  ├─ MailService.ts
│  │  ├─ NewsletterService.ts
│  │  ├─ PageService.ts
│  │  ├─ RoleService.ts
│  │  ├─ SettingService.ts
│  │  └─ UserService.ts
│  ├─ styles
│  │  ├─ carousel.css
│  │  └─ globals.css
│  ├─ ThirdPartyServices
│  │  ├─ FirebaseService.ts
│  │  └─ PusherService.ts
│  ├─ translations
│  │  └─ index.ts
│  ├─ types
│  │  └─ types.d.ts
│  └─ utils
│     ├─ api
│     │  └─ apiClient.ts
│     ├─ cssMaps.ts
│     ├─ cssUrl.ts
│     ├─ filesUtil.ts
│     ├─ firebaseClient.ts
│     ├─ getTranslatedText.ts
│     ├─ hasRenderableChildren.ts
│     ├─ mime.json
│     ├─ roleUtils.ts
│     └─ server
│        ├─ handleError.ts
│        └─ sendPaymentEmail.ts
├─ tailwind.config.ts
├─ tsconfig.json
└─ uploader
   ├─ package-lock.json
   ├─ package.json
   └─ rewrite-storage-urls.ts

```
```
linlaw
├─ .eslintrc.json
├─ .VSCodeCounter
│  ├─ 2025-10-28_10-19-44
│  └─ 2026-01-22_21-20-39
│     ├─ details.md
│     ├─ diff-details.md
│     ├─ diff.csv
│     ├─ diff.md
│     ├─ diff.txt
│     ├─ results.csv
│     ├─ results.json
│     ├─ results.md
│     └─ results.txt
├─ cors.json
├─ next.config.mjs
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ public
│  ├─ googlec6edda4dd1f1d963.html
│  ├─ images
│  │  ├─ default-avatar.webp
│  │  ├─ favicon.ico
│  │  ├─ logo.png
│  │  ├─ logo.svg
│  │  └─ product-logo.webp
│  └─ site.webmanifest
├─ push_all.bat
├─ README.md
├─ scripts
├─ src
│  ├─ app
│  │  ├─ api
│  │  │  ├─ auth
│  │  │  │  ├─ login
│  │  │  │  │  └─ route.tsx
│  │  │  │  ├─ refresh
│  │  │  │  │  └─ route.tsx
│  │  │  │  └─ signup
│  │  │  │     └─ route.tsx
│  │  │  ├─ contact-us
│  │  │  │  └─ route.ts
│  │  │  ├─ data
│  │  │  │  └─ route.ts
│  │  │  ├─ files
│  │  │  │  ├─ route.ts
│  │  │  │  ├─ signedUrl
│  │  │  │  │  └─ route.ts
│  │  │  │  ├─ sync
│  │  │  │  │  └─ route.ts
│  │  │  │  └─ [id]
│  │  │  │     └─ route.ts
│  │  │  ├─ inquiry
│  │  │  │  ├─ route.ts
│  │  │  │  └─ [id]
│  │  │  │     ├─ reply
│  │  │  │     │  ├─ index.ts
│  │  │  │     │  └─ [replyId].ts
│  │  │  │     └─ route.ts
│  │  │  ├─ me
│  │  │  │  ├─ getSignedUrl
│  │  │  │  │  └─ route.ts
│  │  │  │  └─ route.ts
│  │  │  ├─ newsletters
│  │  │  │  ├─ route.ts
│  │  │  │  └─ [newsletterId]
│  │  │  │     ├─ attachment
│  │  │  │     │  ├─ route.ts
│  │  │  │     │  ├─ signurl
│  │  │  │     │  │  └─ route.ts
│  │  │  │     │  └─ [attachmentId]
│  │  │  │     │     └─ route.ts
│  │  │  │     └─ route.ts
│  │  │  ├─ pages
│  │  │  │  └─ route.ts
│  │  │  ├─ related-businesses
│  │  │  │  ├─ id
│  │  │  │  │  └─ [id]
│  │  │  │  │     └─ route.ts
│  │  │  │  ├─ route.ts
│  │  │  │  └─ slug
│  │  │  │     └─ [slug]
│  │  │  │        └─ route.ts
│  │  │  ├─ roles
│  │  │  │  ├─ route.ts
│  │  │  │  └─ [id]
│  │  │  │     └─ route.ts
│  │  │  ├─ send-emails
│  │  │  │  └─ route.ts
│  │  │  ├─ settings
│  │  │  │  ├─ key
│  │  │  │  │  └─ [key]
│  │  │  │  │     └─ route.ts
│  │  │  │  ├─ public
│  │  │  │  │  └─ route.ts
│  │  │  │  └─ route.ts
│  │  │  ├─ setup
│  │  │  │  └─ route.ts
│  │  │  ├─ team
│  │  │  │  ├─ route.ts
│  │  │  │  └─ [id]
│  │  │  │     └─ route.ts
│  │  │  └─ users
│  │  │     ├─ route.ts
│  │  │     └─ [id]
│  │  │        ├─ getSignedUrl
│  │  │        │  └─ route.ts
│  │  │        └─ route.ts
│  │  ├─ careers
│  │  │  ├─ content.tsx
│  │  │  └─ page.tsx
│  │  ├─ content.tsx
│  │  ├─ dashboard
│  │  │  ├─ files
│  │  │  │  ├─ page.tsx
│  │  │  │  └─ upload
│  │  │  │     └─ page.tsx
│  │  │  ├─ newsletters
│  │  │  │  ├─ create
│  │  │  │  │  └─ page.tsx
│  │  │  │  ├─ page.tsx
│  │  │  │  └─ [newsletterId]
│  │  │  │     └─ page.tsx
│  │  │  ├─ page.tsx
│  │  │  ├─ pages
│  │  │  │  └─ page.tsx
│  │  │  ├─ related-businesses
│  │  │  │  ├─ create
│  │  │  │  │  └─ page.tsx
│  │  │  │  ├─ page.tsx
│  │  │  │  └─ [id]
│  │  │  │     └─ page.tsx
│  │  │  ├─ roles
│  │  │  │  ├─ create
│  │  │  │  │  └─ page.tsx
│  │  │  │  ├─ page.tsx
│  │  │  │  └─ [id]
│  │  │  │     └─ page.tsx
│  │  │  ├─ send-emails
│  │  │  │  └─ page.tsx
│  │  │  ├─ settings
│  │  │  │  └─ page.tsx
│  │  │  └─ users
│  │  │     ├─ create
│  │  │     │  └─ page.tsx
│  │  │     ├─ page.tsx
│  │  │     └─ [id]
│  │  │        └─ page.tsx
│  │  ├─ inquiry
│  │  │  ├─ create
│  │  │  │  └─ page.tsx
│  │  │  ├─ page.tsx
│  │  │  └─ [id]
│  │  │     └─ page.tsx
│  │  ├─ layout-content.tsx
│  │  ├─ layout.tsx
│  │  ├─ login
│  │  │  └─ page.tsx
│  │  ├─ newsletters
│  │  │  ├─ content.tsx
│  │  │  ├─ page.tsx
│  │  │  └─ [id]
│  │  │     └─ page.tsx
│  │  ├─ page.tsx
│  │  ├─ profile
│  │  │  └─ page.tsx
│  │  ├─ related-businesses
│  │  │  ├─ content.tsx
│  │  │  ├─ page.tsx
│  │  │  └─ [slug]
│  │  │     └─ page.tsx
│  │  ├─ robots.ts
│  │  ├─ signup
│  │  │  └─ page.tsx
│  │  ├─ sitemap.ts
│  │  └─ team-members
│  │     ├─ content.tsx
│  │     ├─ page.tsx
│  │     └─ [id]
│  │        ├─ page.tsx
│  │        └─ TeamMemberPage.css
│  ├─ components
│  │  ├─ FileUploader
│  │  │  ├─ FileUploader.tsx
│  │  │  └─ UploadProgressList.tsx
│  │  ├─ FormBuilder
│  │  │  ├─ Arrays
│  │  │  │  ├─ ArrayChildDesignRenderer.tsx
│  │  │  │  ├─ ArrayChildDesigns
│  │  │  │  │  ├─ ArrayChildCardDesign.tsx
│  │  │  │  │  ├─ ArrayChildListDesign.tsx
│  │  │  │  │  ├─ ArrayChildNoneDesign.tsx
│  │  │  │  │  └─ ArrayChildTableDesign.tsx
│  │  │  │  ├─ ArrayDesignRenderer.tsx
│  │  │  │  ├─ ArrayDesigns
│  │  │  │  │  ├─ ArrayDefaultCard.tsx
│  │  │  │  │  ├─ ArrayFlatCard.tsx
│  │  │  │  │  ├─ ArrayFlatOutsideCard.tsx
│  │  │  │  │  ├─ ArrayNoneCard.tsx
│  │  │  │  │  └─ ArrayParentCard.tsx
│  │  │  │  └─ ArrayFieldRenderer.tsx
│  │  │  ├─ CombinedField.tsx
│  │  │  ├─ CustomModal.tsx
│  │  │  ├─ Fields
│  │  │  │  ├─ extra
│  │  │  │  │  └─ FieldTitle.tsx
│  │  │  │  ├─ FieldDesignRenderer.tsx
│  │  │  │  ├─ FieldDesigns
│  │  │  │  │  ├─ FieldDefaultCard.tsx
│  │  │  │  │  ├─ FieldParentCard.tsx
│  │  │  │  │  └─ FieldRow.tsx
│  │  │  │  ├─ FieldRenderer.tsx
│  │  │  │  └─ Inputs
│  │  │  │     ├─ BoxSidesInput.tsx
│  │  │  │     ├─ DateInput.tsx
│  │  │  │     ├─ DateTimeInput.tsx
│  │  │  │     ├─ GeneralInput.tsx
│  │  │  │     ├─ IconSelector.tsx
│  │  │  │     ├─ LanguageJsonTextarea.tsx
│  │  │  │     ├─ LanguageJsonTextInput.tsx
│  │  │  │     ├─ MediaSelector.tsx
│  │  │  │     ├─ ResponsiveImagesInput.tsx
│  │  │  │     ├─ RoleSelector.tsx
│  │  │  │     ├─ SizeInput.tsx
│  │  │  │     ├─ sortable
│  │  │  │     │  └─ SortableTag.tsx
│  │  │  │     ├─ SupportedLanguageSelector.module.css
│  │  │  │     ├─ SupportedLanguageSelector.tsx
│  │  │  │     ├─ SwitchInput.tsx
│  │  │  │     ├─ TimeInput.tsx
│  │  │  │     ├─ UserSelector.tsx
│  │  │  │     └─ UsersSelector.tsx
│  │  │  ├─ InputStyle.ts
│  │  │  ├─ Jsons
│  │  │  │  ├─ JsonChildDesignRenderer.tsx
│  │  │  │  ├─ JsonDesignRenderer.tsx
│  │  │  │  ├─ JsonDesigns
│  │  │  │  │  ├─ JsonDefaultCard.tsx
│  │  │  │  │  ├─ JsonFlatCard.tsx
│  │  │  │  │  ├─ JsonFlatOutsideCard.tsx
│  │  │  │  │  ├─ JsonNone.tsx
│  │  │  │  │  └─ JsonParentCard.tsx
│  │  │  │  └─ JsonFieldRenderer.tsx
│  │  │  └─ SortableItem.tsx
│  │  ├─ forms
│  │  │  ├─ NewsletterForm.tsx
│  │  │  ├─ ProfileUpdateForm.tsx
│  │  │  ├─ RelatedBusinessForm.tsx
│  │  │  ├─ RoleForm.tsx
│  │  │  ├─ SetupForm.tsx
│  │  │  └─ UserForm.tsx
│  │  ├─ inputs
│  │  │  ├─ ImageCropper.tsx
│  │  │  ├─ LanguageTextInput.tsx
│  │  │  ├─ ProfileAvatar.tsx
│  │  │  ├─ PublicAPIDynamicDropdown.tsx
│  │  │  ├─ PublicAPIDynamicMultiSelect.tsx
│  │  │  ├─ RichTextEditor.css
│  │  │  ├─ RichTextEditor.tsx
│  │  │  └─ standalone
│  │  │     ├─ ImageSelection.tsx
│  │  │     ├─ LanguageJsonTextarea.tsx
│  │  │     ├─ LanguageJsonTextInput.tsx
│  │  │     ├─ LanguageSelection.tsx
│  │  │     ├─ RoleSelection.tsx
│  │  │     └─ UserSelection.tsx
│  │  ├─ loaders
│  │  │  ├─ InlineLoader.tsx
│  │  │  ├─ LoadingSpin.tsx
│  │  │  ├─ LoadingSpinner.tsx
│  │  │  ├─ ProtectedPage.tsx
│  │  │  └─ SubLoader.tsx
│  │  ├─ modals
│  │  │  └─ FileSelectionModal.tsx
│  │  ├─ RelatedBusinessCard.tsx
│  │  ├─ sections
│  │  │  ├─ AboutUsSection.tsx
│  │  │  ├─ ClickToAction.tsx
│  │  │  ├─ CustomCarousel.tsx
│  │  │  ├─ FAQSection.tsx
│  │  │  ├─ HeroSliderSection.css
│  │  │  ├─ HeroSliderSection.tsx
│  │  │  ├─ NewsletterSection.tsx
│  │  │  ├─ PromoShowcaseSection.tsx
│  │  │  ├─ RelatedBusinessesSection.tsx
│  │  │  ├─ ServicesSection.tsx
│  │  │  ├─ TeamSection.tsx
│  │  │  └─ TestimonialsSection.tsx
│  │  └─ ui
│  │     ├─ FileThumbnail.tsx
│  │     ├─ ImageComponent.tsx
│  │     ├─ PageWrapper.tsx
│  │     ├─ SocialLink.tsx
│  │     ├─ SocialLinks.tsx
│  │     └─ UserAvatar.tsx
│  ├─ config
│  │  ├─ CMS
│  │  │  ├─ fields
│  │  │  │  └─ SECTION_SETTINGS.tsx
│  │  │  ├─ pages
│  │  │  │  ├─ keys
│  │  │  │  │  ├─ CAREER_PAGE_SETTINGS.ts
│  │  │  │  │  ├─ HOME_PAGE_SETTINGS.ts
│  │  │  │  │  ├─ NEWSLETTER_PAGE_SETTINGS.tsx
│  │  │  │  │  ├─ RELATED_BUSINESSES_PAGE_SETTINGS.ts
│  │  │  │  │  ├─ shared
│  │  │  │  │  │  ├─ sharedPageConfig.ts
│  │  │  │  │  │  └─ sharedPageTypes.ts
│  │  │  │  │  └─ TEAM_PAGE_SETTINGS.tsx
│  │  │  │  └─ pageKeys.ts
│  │  │  └─ settings
│  │  │     ├─ index.ts
│  │  │     ├─ keys
│  │  │     │  ├─ DESIGN_SCHEMA_KEYS.ts
│  │  │     │  ├─ FIREBASE_SETTINGS_KEYS.ts
│  │  │     │  ├─ GLOBAL_SETTINGS_KEYS.ts
│  │  │     │  ├─ LANGUAGE_SETTINGS_KEYS.ts
│  │  │     │  ├─ MAIL_KEYS.ts
│  │  │     │  ├─ MESSAGING_SERVICE_KEYS.ts
│  │  │     │  ├─ PUSHER_SETTINGS_KEYS.ts
│  │  │     │  ├─ SEO_SETTINGS_KEYS.ts
│  │  │     │  └─ SOCIAL_MEDIA_KEYS.ts
│  │  │     └─ settingKeys.ts
│  │  ├─ navigations
│  │  │  ├─ IconMapper.tsx
│  │  │  ├─ menu.ts
│  │  │  ├─ navigationMenu.tsx
│  │  │  └─ routes.ts
│  │  └─ permissions.ts
│  ├─ contexts
│  │  ├─ FileContext.tsx
│  │  ├─ LanguageContext.tsx
│  │  ├─ LayoutContext.tsx
│  │  ├─ SettingsContext.tsx
│  │  └─ UserContext.tsx
│  ├─ db
│  │  └─ index.ts
│  ├─ hooks
│  │  ├─ useFetchFiles.ts
│  │  ├─ useFile.ts
│  │  ├─ useFileModal.ts
│  │  ├─ useFileUpload.ts
│  │  ├─ useFirebaseConfig.ts
│  │  ├─ useLanguage.tsx
│  │  ├─ useLayout.ts
│  │  ├─ useSettings.ts
│  │  └─ useUser.ts
│  ├─ layouts
│  │  ├─ DashboardLayout.tsx
│  │  ├─ MainLayout.tsx
│  │  └─ OverlayBar.tsx
│  ├─ middlewares
│  │  ├─ authMiddleware.ts
│  │  └─ verifyServerAuth.ts
│  ├─ models
│  │  ├─ CacheModel.ts
│  │  ├─ constants.ts
│  │  ├─ FileModel.ts
│  │  ├─ index.ts
│  │  ├─ InquiryModel.ts
│  │  ├─ languages.ts
│  │  ├─ Newsletter.ts
│  │  ├─ PageModel.ts
│  │  ├─ RelatedBusinessModel.ts
│  │  ├─ RoleModel.ts
│  │  ├─ SettingModel.ts
│  │  ├─ TeamBlock.ts
│  │  ├─ UserModel.ts
│  │  └─ Users
│  │     └─ DeviceToken.ts
│  ├─ providers
│  │  ├─ AppProvider.tsx
│  │  ├─ CustomConfigProvider.tsx
│  │  ├─ FileProvider.tsx
│  │  ├─ LanguageProvider.tsx
│  │  ├─ LayoutProvider.tsx
│  │  ├─ PusherProvider.tsx
│  │  ├─ SettingsProvider.tsx
│  │  └─ UserProvider.tsx
│  ├─ repositories
│  │  ├─ CacheRepository.ts
│  │  ├─ FileRepository.ts
│  │  ├─ index.ts
│  │  ├─ InquiryRepository.ts
│  │  ├─ NewsletterRepository.ts
│  │  ├─ PageRepository.ts
│  │  ├─ RelatedBusinessRepository.ts
│  │  ├─ RoleRepository.ts
│  │  ├─ SettingRepository.ts
│  │  └─ UserRepository.ts
│  ├─ router
│  │  └─ LayoutRouter.tsx
│  ├─ services
│  │  ├─ FileService.ts
│  │  ├─ InquiryService.ts
│  │  ├─ MailService.ts
│  │  ├─ NewsletterService.ts
│  │  ├─ PageService.ts
│  │  ├─ RoleService.ts
│  │  ├─ SettingService.ts
│  │  └─ UserService.ts
│  ├─ styles
│  │  ├─ carousel.css
│  │  └─ globals.css
│  ├─ ThirdPartyServices
│  │  ├─ FirebaseService.ts
│  │  └─ PusherService.ts
│  ├─ translations
│  │  └─ index.ts
│  ├─ types
│  │  └─ types.d.ts
│  └─ utils
│     ├─ api
│     │  └─ apiClient.ts
│     ├─ cssMaps.ts
│     ├─ cssUrl.ts
│     ├─ filesUtil.ts
│     ├─ firebaseClient.ts
│     ├─ getTranslatedText.ts
│     ├─ hasRenderableChildren.ts
│     ├─ mime.json
│     ├─ pageid.tsx
│     ├─ roleUtils.ts
│     ├─ server
│     │  ├─ handleError.ts
│     │  ├─ pageSettings.ts
│     │  ├─ publicSiteSettings.ts
│     │  └─ sendPaymentEmail.ts
│     └─ typed.ts
├─ tailwind.config.ts
├─ tsconfig.json
└─ uploader
   ├─ package-lock.json
   ├─ package.json
   └─ rewrite-storage-urls.ts

```