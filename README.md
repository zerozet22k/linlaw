
```
myanmarlaw
├─ .eslintrc.json
├─ cors.json
├─ next.config.mjs
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ public
│  └─ images
│     ├─ default-avatar.webp
│     ├─ favicon.ico
│     ├─ logo.png
│     ├─ logo.svg
│     ├─ product-logo.webp
│     └─ site.webmanifest
├─ push_all.bat
├─ README.md
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
│  │  │  ├─ roles
│  │  │  │  ├─ route.ts
│  │  │  │  └─ [id]
│  │  │  │     └─ route.ts
│  │  │  ├─ send-email
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
│  │  │  ├─ roles
│  │  │  │  ├─ create
│  │  │  │  │  └─ page.tsx
│  │  │  │  ├─ page.tsx
│  │  │  │  └─ [id]
│  │  │  │     └─ page.tsx
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
│  │  ├─ services
│  │  │  ├─ content.tsx
│  │  │  └─ page.tsx
│  │  ├─ signup
│  │  │  └─ page.tsx
│  │  └─ team-members
│  │     ├─ content.tsx
│  │     ├─ page.tsx
│  │     └─ [id]
│  │        └─ page.tsx
│  ├─ components
│  │  ├─ CustomCarousel.tsx
│  │  ├─ FAQSection.tsx
│  │  ├─ FileThumbnail.tsx
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
│  │  │  │  │  ├─ DefaultCard.tsx
│  │  │  │  │  ├─ FlatCard.tsx
│  │  │  │  │  ├─ FlatOutsideCard.tsx
│  │  │  │  │  └─ ParentCard.tsx
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
│  │  │  │     ├─ GeneralInput.tsx
│  │  │  │     ├─ IconSelector.tsx
│  │  │  │     ├─ ImageSelector.tsx
│  │  │  │     ├─ LanguageJsonTextarea.tsx
│  │  │  │     ├─ LanguageJsonTextInput.tsx
│  │  │  │     ├─ ResponsiveImagesInput.tsx
│  │  │  │     ├─ RoleSelector.tsx
│  │  │  │     ├─ SizeInput.tsx
│  │  │  │     └─ SupportedLanguageSelector.tsx
│  │  │  ├─ InputStyle.ts
│  │  │  └─ Jsons
│  │  │     ├─ JsonChildDesignRenderer.tsx
│  │  │     ├─ JsonDesignRenderer.tsx
│  │  │     ├─ JsonDesigns
│  │  │     │  ├─ JsonDefaultCard.tsx
│  │  │     │  ├─ JsonFlatCard.tsx
│  │  │     │  ├─ JsonFlatOutsideCard.tsx
│  │  │     │  └─ JsonParentCard.tsx
│  │  │     └─ JsonFieldRenderer.tsx
│  │  ├─ forms
│  │  │  ├─ NewsletterForm.tsx
│  │  │  ├─ ProfileUpdateForm.tsx
│  │  │  ├─ RoleForm.tsx
│  │  │  ├─ SetupForm.tsx
│  │  │  └─ UserForm.tsx
│  │  ├─ HeroSlider.css
│  │  ├─ HeroSlider.tsx
│  │  ├─ ImageComponent.tsx
│  │  ├─ inputs
│  │  │  ├─ FileSelectionModal.tsx
│  │  │  ├─ ImageCropper.tsx
│  │  │  ├─ PublicAPIDynamicDropdown.tsx
│  │  │  ├─ PublicAPIDynamicMultiSelect.tsx
│  │  │  ├─ RichTextEditor.css
│  │  │  ├─ RichTextEditor.tsx
│  │  │  ├─ standalone
│  │  │  │  ├─ ImageSelection.tsx
│  │  │  │  └─ RoleSelection.tsx
│  │  │  └─ UserSelector.tsx
│  │  ├─ LanguageSelector.tsx
│  │  ├─ LanguageTextInput.tsx
│  │  ├─ loaders
│  │  │  ├─ InlineLoader.tsx
│  │  │  ├─ LoadingSpin.tsx
│  │  │  ├─ LoadingSpinner.tsx
│  │  │  ├─ ProtectedPage.tsx
│  │  │  └─ SubLoader.tsx
│  │  ├─ PageWrapper.tsx
│  │  ├─ ProfileAvatar.tsx
│  │  ├─ sections
│  │  │  ├─ AdCard.tsx
│  │  │  ├─ AdCards.tsx
│  │  │  ├─ ContactUsSection.tsx
│  │  │  ├─ InfoCards.tsx
│  │  │  ├─ ReviewsSection.tsx
│  │  │  ├─ TeamSection.tsx
│  │  │  └─ Testimonials.tsx
│  │  ├─ SendMailForm.tsx
│  │  ├─ SocialLink.tsx
│  │  ├─ SocialLinks.tsx
│  │  ├─ SortableItem.tsx
│  │  └─ UserAvatar.tsx
│  ├─ config
│  │  ├─ CMS
│  │  │  ├─ pages
│  │  │  │  ├─ ABOUT_PAGE_SETTINGS.ts
│  │  │  │  ├─ HOME_PAGE_SETTINGS.ts
│  │  │  │  ├─ NEWSLETTER_PAGE_SETTINGS.tsx
│  │  │  │  ├─ pageKeys.ts
│  │  │  │  ├─ SERVICES_PAGE_SETTINGS.ts
│  │  │  │  └─ TEAM_PAGE_SETTINGS.tsx
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
│  │  ├─ Newsletter.ts
│  │  ├─ PageModel.ts
│  │  ├─ RoleModel.ts
│  │  ├─ SettingModel.ts
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
│  ├─ types
│  │  └─ types.d.ts
│  └─ utils
│     ├─ api
│     │  └─ apiClient.ts
│     ├─ filesUtil.ts
│     ├─ firebaseClient.ts
│     ├─ getTranslatedText.ts
│     ├─ roleUtils.ts
│     └─ server
│        ├─ handleError.ts
│        └─ sendPaymentEmail.ts
├─ tailwind.config.ts
└─ tsconfig.json

```
```
myanmarlaw
├─ .eslintrc.json
├─ cors.json
├─ next.config.mjs
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ public
│  └─ images
│     ├─ default-avatar.webp
│     ├─ favicon.ico
│     ├─ logo.png
│     ├─ logo.svg
│     ├─ product-logo.webp
│     └─ site.webmanifest
├─ push_all.bat
├─ README.md
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
│  │  │  ├─ roles
│  │  │  │  ├─ route.ts
│  │  │  │  └─ [id]
│  │  │  │     └─ route.ts
│  │  │  ├─ send-email
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
│  │  │  ├─ roles
│  │  │  │  ├─ create
│  │  │  │  │  └─ page.tsx
│  │  │  │  ├─ page.tsx
│  │  │  │  └─ [id]
│  │  │  │     └─ page.tsx
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
│  │  ├─ services
│  │  │  ├─ content.tsx
│  │  │  └─ page.tsx
│  │  ├─ signup
│  │  │  └─ page.tsx
│  │  └─ team-members
│  │     ├─ content.tsx
│  │     ├─ page.tsx
│  │     └─ [id]
│  │        └─ page.tsx
│  ├─ components
│  │  ├─ CustomCarousel.tsx
│  │  ├─ FAQSection.tsx
│  │  ├─ FileThumbnail.tsx
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
│  │  │  │  │  ├─ DefaultCard.tsx
│  │  │  │  │  ├─ FlatCard.tsx
│  │  │  │  │  ├─ FlatOutsideCard.tsx
│  │  │  │  │  └─ ParentCard.tsx
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
│  │  │  │     ├─ GeneralInput.tsx
│  │  │  │     ├─ IconSelector.tsx
│  │  │  │     ├─ ImageSelector.tsx
│  │  │  │     ├─ LanguageJsonTextarea.tsx
│  │  │  │     ├─ LanguageJsonTextInput.tsx
│  │  │  │     ├─ ResponsiveImagesInput.tsx
│  │  │  │     ├─ RoleSelector.tsx
│  │  │  │     ├─ SizeInput.tsx
│  │  │  │     └─ SupportedLanguageSelector.tsx
│  │  │  ├─ InputStyle.ts
│  │  │  └─ Jsons
│  │  │     ├─ JsonChildDesignRenderer.tsx
│  │  │     ├─ JsonDesignRenderer.tsx
│  │  │     ├─ JsonDesigns
│  │  │     │  ├─ JsonDefaultCard.tsx
│  │  │     │  ├─ JsonFlatCard.tsx
│  │  │     │  ├─ JsonFlatOutsideCard.tsx
│  │  │     │  └─ JsonParentCard.tsx
│  │  │     └─ JsonFieldRenderer.tsx
│  │  ├─ forms
│  │  │  ├─ NewsletterForm.tsx
│  │  │  ├─ ProfileUpdateForm.tsx
│  │  │  ├─ RoleForm.tsx
│  │  │  ├─ SetupForm.tsx
│  │  │  └─ UserForm.tsx
│  │  ├─ HeroSlider.css
│  │  ├─ HeroSlider.tsx
│  │  ├─ ImageComponent.tsx
│  │  ├─ inputs
│  │  │  ├─ FileSelectionModal.tsx
│  │  │  ├─ ImageCropper.tsx
│  │  │  ├─ PublicAPIDynamicDropdown.tsx
│  │  │  ├─ PublicAPIDynamicMultiSelect.tsx
│  │  │  ├─ RichTextEditor.css
│  │  │  ├─ RichTextEditor.tsx
│  │  │  ├─ standalone
│  │  │  │  ├─ ImageSelection.tsx
│  │  │  │  └─ RoleSelection.tsx
│  │  │  └─ UserSelector.tsx
│  │  ├─ LanguageSelector.tsx
│  │  ├─ LanguageTextInput.tsx
│  │  ├─ loaders
│  │  │  ├─ InlineLoader.tsx
│  │  │  ├─ LoadingSpin.tsx
│  │  │  ├─ LoadingSpinner.tsx
│  │  │  ├─ ProtectedPage.tsx
│  │  │  └─ SubLoader.tsx
│  │  ├─ PageWrapper.tsx
│  │  ├─ ProfileAvatar.tsx
│  │  ├─ sections
│  │  │  ├─ AdCard.tsx
│  │  │  ├─ AdCards.tsx
│  │  │  ├─ ContactUsSection.tsx
│  │  │  ├─ InfoCards.tsx
│  │  │  ├─ ReviewsSection.tsx
│  │  │  ├─ TeamSection.tsx
│  │  │  └─ Testimonials.tsx
│  │  ├─ SendMailForm.tsx
│  │  ├─ SocialLink.tsx
│  │  ├─ SocialLinks.tsx
│  │  ├─ SortableItem.tsx
│  │  └─ UserAvatar.tsx
│  ├─ config
│  │  ├─ CMS
│  │  │  ├─ pages
│  │  │  │  ├─ ABOUT_PAGE_SETTINGS.ts
│  │  │  │  ├─ HOME_PAGE_SETTINGS.ts
│  │  │  │  ├─ NEWSLETTER_PAGE_SETTINGS.tsx
│  │  │  │  ├─ pageKeys.ts
│  │  │  │  ├─ SERVICES_PAGE_SETTINGS.ts
│  │  │  │  └─ TEAM_PAGE_SETTINGS.tsx
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
│  │  ├─ Newsletter.ts
│  │  ├─ PageModel.ts
│  │  ├─ RoleModel.ts
│  │  ├─ SettingModel.ts
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
│  ├─ types
│  │  └─ types.d.ts
│  └─ utils
│     ├─ api
│     │  └─ apiClient.ts
│     ├─ filesUtil.ts
│     ├─ firebaseClient.ts
│     ├─ getTranslatedText.ts
│     ├─ roleUtils.ts
│     └─ server
│        ├─ handleError.ts
│        └─ sendPaymentEmail.ts
├─ tailwind.config.ts
└─ tsconfig.json

```