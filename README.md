# Lin Law

Lin Law is a multilingual business platform built with Next.js and TypeScript for legal, corporate, tax, travel, careers, newsletter, and content-management workflows.

## Project Summary

The project combines a public multilingual website with an internal dashboard for managing users, roles, files, newsletters, settings, inquiries, related businesses, careers, and structured page content. It is useful portfolio evidence because it shows business-facing UI, admin workflows, localization, server utilities, and CMS-style configuration in one application.

## Tech Stack

- Next.js 14 App Router
- React 18 and TypeScript
- Tailwind CSS and Ant Design
- MongoDB and Mongoose
- Firebase and Firebase Admin
- SWR, Axios, Framer Motion, Quill, and Swiper
- Nodemailer, Pusher, JWT, and Google Analytics Data API
- ESLint and Prettier

## Main Features

- Multilingual public site with language-based routing
- Internal dashboard for operational management
- User, role, permission, and session-aware workflows
- Newsletter publishing and management
- Inquiry/contact handling
- Careers and related-business content management
- File upload and signed URL workflows
- Settings and page configuration system
- Reusable form-builder and CMS-style architecture
- Structured content management for pages, teams, FAQs, and public sections

## Code Evidence

- `src/i18n` contains locale files and language utilities.
- `src/layouts` contains public and dashboard layout structure.
- `src/config` contains navigation and permission configuration.
- `src/utils/server` contains server-side utilities for public settings, newsletters, careers, and related businesses.
- `uploader` contains supporting file/storage tooling.

## My Role

Built independently as a business-style full-stack project, including frontend screens, dashboard architecture, localization structure, server utilities, data integrations, and deployment-oriented configuration.

## Project Structure

```text
linlaw/
|- src/       App routes, layouts, dashboard code, utilities, i18n, config
|- public/    Static assets and public metadata
|- uploader/  File and storage helper tooling
```

## Local Development

### Requirements

- Node.js 18.17 or newer
- npm 9 or newer

### Install

```bash
npm install
```

### Run

```bash
npm run dev
```

### Useful Commands

```bash
npm run build
npm run typecheck
npm run lint
```

## Screenshots / Demo

Screenshots and live demo links can be added here before sending the portfolio to a university or scholarship reviewer.

## License

All rights reserved. See `LICENSE`.
