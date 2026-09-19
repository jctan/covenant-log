---
title: Admin Console Quick Guide
description: Introduces the entry points and page-by-page features of astro-whono's local Admin Console.
badge: Guide
date: 2026-04-24
updatedAt: 2026-08-10
tags: [ "Admin Console", "Guide" ]
draft: true
---

The Admin Console `/admin/` is the local dashboard entry point, used to take over site configuration and content maintenance after you fork, clone, or self-host the project.

It isn't a standalone CMS — saving writes back to the config or content files in the repo, so it pairs naturally with Git: you can diff changes before and after, and roll back like any other project file when needed.

:::note[Local tool]
The Admin Console only provides write access in the development environment.<br>
In production, at most a read-only Site Overview page remains; `/api/admin/*` only serves the local dashboard and isn't a public API.
:::

## Quick Start

Start the project locally:

```bash
npm install
npm run dev
```

The dev server runs on `http://localhost:4321/` by default; if you've changed the port, replace `4321` with your actual port.

| Entry | Page | Main Purpose |
| :---: | :---: | :--- |
| `/admin/` | Site Overview | View site overview, content structure, recent posts, etc. |
| `/admin/theme/` | Theme Console | Edit site info, sidebar, homepage, and inner-page copy |
| `/admin/content/` | Content Console | Post management and visual writing |
| `/admin/images/` | Images Console | Browse image assets and copy usable paths |
| `/admin/data/` | Data Console | Import and export theme settings for migration and backup |

## Main Pages

### 📈 Site Overview

[Site Overview](/admin/) is the dashboard's home page, showing content counts, recent updates, and dashboard entry points (entries are visible only in the development environment).

This page can optionally be made visible to visitors, controlled by the Admin Overview toggle in the Theme Console.

### 🛠️ Theme Console

Theme Console manages theme-level configuration, making it easy to quickly adjust basic site settings after a fork or clone.

See the [Theme Console configuration guide](/archive/theme-console-guide/) for details.

### 📝 Content Console

Content Console is the entry point for content management and visual writing, letting you view and maintain the site's written content in one place.

See the [Content Console usage guide](/archive/content-console-guide/) for details.

### 🖼️ Images Console

Images Console lets you browse local and cloud images, check image details, and copy paths or URLs usable in config or content fields.

See the [Content Console usage guide](/archive/content-console-guide/) for object-storage configuration and live service verification.
To swap in a local image, first place it in the project's designated directory, then go back to the relevant page to select or fill in the path.

### 📤 Data Console

Data Console handles importing and exporting theme settings. Exporting is good for migration or backup; importing runs a pre-check before confirming the write.

It handles the theme configuration data managed by Theme Console, not post content.

---
That covers the Admin Console's current main entry points and features. If you have ideas or suggestions, feel free to open an Issue.
