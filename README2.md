# Lin Law

A multilingual business platform built with Next.js and TypeScript for legal, corporate, tax, travel, and content management workflows.

## Overview

Lin Law is a full-stack web application developed independently as a real-world business platform. It combines a public-facing multilingual website with an internal dashboard for managing users, roles, files, newsletters, settings, inquiries, and structured page content.

The project is built on top of a reusable boilerplate and extended into a company-ready system with custom business logic, CMS-style configuration, multilingual routing, and admin-oriented workflows.

## Features

- multilingual public website with language-based routing
- internal dashboard for operational management
- newsletter publishing and management
- file upload and signed URL workflows
- user and role management
- settings and page configuration system
- inquiry and contact handling
- reusable form-builder and CMS-style architecture
- structured content management for pages, teams, and related businesses

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- PostCSS
- App Router
- custom config-driven CMS patterns

## Project Structure

```txt
linlaw/
├─ src/          # app routes, dashboard, api, components, services, models
├─ public/       # static assets
├─ uploader/     # utility scripts for storage/file handling
└─ scripts/      # project helper scripts