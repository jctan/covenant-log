---
title: Content Console Usage Guide
description: Explains the content types, list search, image uploads, edit/preview, and download/delete capabilities of astro-whono's local Content Console in the development environment.
badge: Guide
date: 2026-06-13
updatedAt: 2026-08-10
tags: [ "Content Console", "Guide" ]
draft: true
---

astro-whono provides a local Content Console for managing the site's written content in the development environment.

Content Console lives at `/admin/content/`. It covers browsing, searching, editing, and previewing across the four content types — Essay, Bits, Memo, and About — and supports creating new drafts, downloading source files, and deleting, so you can maintain content without hand-writing frontmatter.

:::note[Development environment]
`/admin/content/` and its edit pages are only operable in the development environment. In production, visiting shows only a local-development notice — content data and the editor aren't loaded; `/api/admin/content/*` only serves the local dashboard and isn't a public API.
:::

## Local Startup and Entry

During local development, start the project with:

```bash
npm install
npm run dev
```

By default, the dev server runs on `http://localhost:4321/`. Once it's running, you can go directly to:

```text
http://localhost:4321/admin/content/
```

If you've changed the local dev port, replace `4321` with your actual port.

Content Console reads source files directly from `src/content/**` and doesn't depend on a database. Creating, saving, and deleting all land on content files in the repo; where uploaded images are stored depends on local files or an optional S3-compatible storage configuration.

## Image Uploads and Cloud Storage

By default, the Admin Console saves uploaded images locally; you can also configure S3-compatible object storage in the development environment.

Once enabled, body images for Essay/Memo and image attachments for Bits are uploaded to the configured bucket, and the `https://` public address is written into the content. Existing local images aren't migrated automatically. Images Console (`/admin/images/`) lets you browse and copy cloud URLs.

Maintainers can run `npm run smoke:cloud-images` to verify the live service. This command doesn't touch the network by default; only when `ASTRO_WHONO_CLOUD_SMOKE=1` is explicitly set and dedicated test credentials are provided will it upload a test object, paginate through the object list, and clean the object up afterward.

### R2, MinIO, or another custom endpoint

Fill this in `.env.local` at the project root:

```dotenv
ASTRO_WHONO_IMAGE_STORAGE=s3
ASTRO_WHONO_S3_ENDPOINT=https://your-s3-endpoint
ASTRO_WHONO_S3_REGION=auto
ASTRO_WHONO_S3_BUCKET=your-bucket
ASTRO_WHONO_S3_ACCESS_KEY_ID=your-access-key
ASTRO_WHONO_S3_SECRET_ACCESS_KEY=your-secret-key
ASTRO_WHONO_S3_PUBLIC_BASE_URL=https://your-cdn-domain
# Optional: ASTRO_WHONO_S3_PREFIX=blog
# Optional: ASTRO_WHONO_S3_FORCE_PATH_STYLE=true (defaults to true for custom endpoints)
# Optional: ASTRO_WHONO_S3_SESSION_TOKEN=temporary-session-token
```

`ASTRO_WHONO_S3_ENDPOINT` is the object storage service's access address, while `ASTRO_WHONO_S3_PUBLIC_BASE_URL` is the public image address written into content — the two can differ. The public address must be a valid `https://` URL. Custom endpoints default to `region=auto` and path-style; if your service has special requirements, you can explicitly set `ASTRO_WHONO_S3_FORCE_PATH_STYLE`.

### Native AWS S3

For native AWS S3, don't set `ASTRO_WHONO_S3_ENDPOINT`, and fill in the bucket's actual region — `auto` isn't allowed:

```dotenv
ASTRO_WHONO_IMAGE_STORAGE=s3
ASTRO_WHONO_S3_REGION=us-east-1
ASTRO_WHONO_S3_BUCKET=your-bucket
ASTRO_WHONO_S3_ACCESS_KEY_ID=your-access-key
ASTRO_WHONO_S3_SECRET_ACCESS_KEY=your-secret-key
ASTRO_WHONO_S3_PUBLIC_BASE_URL=https://your-cdn-domain
# Optional: ASTRO_WHONO_S3_PREFIX=blog
# Optional: ASTRO_WHONO_S3_SESSION_TOKEN=temporary-session-token
```

`.env.local` is gitignored by default; don't commit the access key, secret access key, or session token to the repo.

## Content Types and Capabilities

Content Console manages all four content types in one place, but their capabilities differ:

| Content | Directory | Create | Edit | Delete | List filters |
| :--- | :--- | :---: | :---: | :---: | :---: |
| Essay | `src/content/essay/` | Yes | Yes | Yes | Yes |
| Bits | `src/content/bits/` | Yes | Yes | Yes | Yes |
| Memo | `src/content/memo/index.md` | — | Yes | — | — |
| About | `src/content/about/index.md` | — | Yes | — | — |

Essay and Bits are multi-entry content — you can create new drafts, edit and delete entries one by one in the console, and the list also offers filtering and pagination. Memo and About are fixed single-page content — you can only edit the existing body text; creating or deleting isn't supported.

## Browsing, Filtering, and Search

When you open `/admin/content/`, it shows a content overview grouped by Essay, Bits, Memo, and About by default. The top toolbar offers:

- Search: look up content across all types by title, tag, or slug
- Scope: switch between "All content" and a single content type
- Status: All / Published / Drafts only
- Sort: Recently updated / Title A–Z
- Year: filter by the content's year

Status, sort, year filtering, and pagination only apply to Essay and Bits; Memo and About are fixed single pages and don't expose these filters. In the list, drafts are marked `[draft]`, and essays with archiving turned off are marked `[archive off]`.

Each item provides an "Edit" button, plus a "More" menu with revision info, view on the live site, download, and delete actions.

## Creating and Editing

### Essay

Click "New post" in the Essay group; after filling in basic info like the title, a draft is generated and you're taken to the edit page.

The essay edit page provides:

- A CodeMirror-based body editor with multiple built-in syntax-highlighting themes and a line-number option
- Edit/preview layout toggle, with server-rendered previews
- A frontmatter info panel: publish date, updated date, tags, draft, archive, and other fields
- Two auxiliary side panels: table of contents and Markdown syntax reference
- Toolbar: common Markdown, math formulas, emoji, images, and galleries
- Body image uploads: saved to the current content's attachment directory by default; once cloud storage is enabled, they're written to the configured bucket and the returned `https://` address is inserted

### Bits

Click "New bit" in the Bits group; after choosing a publish time, a draft is generated and you're taken to the edit page.

The bits edit page is a standalone workspace where you can edit the body, basic info, and image (`images`) rows, with image upload support and a live card preview that matches how the card looks in the `/bits/` list.

### Memo and About

Memo and About are fixed single-page content; their edit pages only handle the body text:

- Memo: edit the body of `src/content/memo/index.md`, with support for inserting body images, a page preview, and a body table of contents
- About: edit the body of `src/content/about/index.md`; friend links and FAQs render in the preview using the public-page styles; the contact-links position is controlled with the `::contact-links` placeholder

The page title and subtitle for Memo and About aren't maintained here — adjust them in Theme Console instead.

## Bulk Actions

After checking items in the list, you can perform "Bulk actions":

- Publish / Mark as draft: bulk-toggle the `draft` status
- Download: package the selected content's source files into a zip download
- Delete: bulk-delete the selected content; source files are moved to the recycle bin (a confirmation is shown before deleting)

Bulk actions apply to whatever's checked in the current list; narrow things down with filters or search first, then batch-process.

## Download and Delete

- Download: click "Download source file" in that item's "More" menu to get the corresponding Markdown file
- Delete: delete from that item's "More" menu; the source file is moved to the recycle bin rather than erased outright; a confirmation is shown before deleting

Download and delete act on the source file itself. Delete is only supported for Essay and Bits; Memo and About don't offer deletion.

## Content Fields and Writing Conventions

Content Console shares the same field rules as editing `src/content/**` directly. Listed here are the parts used most often in everyday writing; for the full set of formatting examples, see the [Markdown Formatting Guide](https://astro.whono.me/archive/markdown-guide/).

### Essay

```yaml
title: My Post
date: 2026-01-01
draft: false
archive: true
# slug: my-post
# publishedAt: 2026-01-01T12:00:00+08:00
# updatedAt: 2026-01-02
```

`title` and `date` are required; `tags`, `description`, `cover`, `badge`, and other fields are optional as needed. `date` can be `YYYY-MM-DD` or an ISO 8601 timestamp with a timezone; fill in `publishedAt` only when you need to preserve a specific publish time, and `updatedAt` can't be earlier than `date`. If `slug` is left blank, it's derived from the source file path (e.g. `2024/my-post` becomes `2024-my-post`); custom values must use lowercase kebab-case. The final slug can't be `page`, `tag`, or `rss.xml`, and can't duplicate another essay's slug.

`draft: true` essays only show up in local development; production lists, RSS, and the sitemap filter them out. `archive: false` only removes the post from the `/archive/` aggregation and the archive RSS feed — it's still reachable from `/essay/` and its detail route.

### Bits

```yaml
date: 2026-01-01T12:00:00+08:00
tags: [Reading]
images:
  - src: bits/demo-01.webp
    width: 800
    height: 600
    alt: Example image
# author:
#   name: Alice
#   avatar: author/alice.webp
```

`title`, `tags`, `images`, and `author` are all optional. `images[].src` accepts a relative image path under `public/**` (drop the `public/` prefix, e.g. `bits/demo-01.webp`) or a remote `https://` address; local relative paths can't use `http`, `..`, query strings, or fragments. Positive-integer `width` / `height` values reduce layout shift, and `alt` provides the image caption. Avatars likewise only accept relative paths under `public/**`, e.g. `author/avatar.webp`. Since `/bits/` currently doesn't generate detail pages, you usually don't need to fill in `slug`.

### Memo and About

Memo and About are both fixed single pages: Memo's source file is `src/content/memo/index.md` and shouldn't be marked as a draft; About's source file is `src/content/about/index.md`, with friend links, FAQs, and contact links in the body using their respective directives. Both pages' titles and subtitles are maintained in Theme Console.

### Images, Excerpts, and Body Text

- Essay/Memo body images are saved to the current content's attachment directory by default; Bits local images are saved to `public/bits/`. Once cloud storage is enabled in the Admin Console, newly uploaded images are written to the configured bucket instead, with the `https://` address written into the content — existing local images aren't migrated automatically.
- List excerpts default to a cleaned, truncated version of the body; use `<!-- more -->` to mark the truncation point explicitly. `description` is only used for the SEO and Open Graph meta description — it doesn't affect the list excerpt.
- Syntax and examples for callouts, figures, galleries, formulas, code blocks, and more are all in the [Markdown Formatting Guide](https://astro.whono.me/archive/markdown-guide/).

Newly created essays and bits default to draft; after saving, preview locally first, and publish only after confirming the content, images, and frontmatter.

---

## Closing Notes

:::info[Why build a local dashboard]
Content Console is the most complex, most time-consuming part of the whole dashboard. Since writing happens locally and the dev server has to be running anyway, editing Markdown directly would work just as well — you might wonder why bother building a dashboard like this at all?

- astro-whono's users aren't necessarily familiar with frontend development. Editing source files directly means remembering frontmatter fields, directory structure, and writing conventions — the dashboard tucks all that into forms and buttons, lowering the barrier to entry.
- While writing, what matters most is the final rendered result. The edit page has a built-in server-side preview, so the body, cards, and the About page can all be seen close to their live appearance before saving, without switching back and forth to a browser to check.
- Common content formats (callouts, images, galleries, formulas, emoji, etc.) can be inserted directly from the toolbar, saving you from hand-writing markup and looking up docs.
- Fixed single pages like Memo and About used to require editing the source file directly; now you can edit the body in place in the dashboard and preview it, which is more convenient.

Content Console isn't meant to replace the command line or a code editor — the goal is to let people without a coding background comfortably maintain their own content. Of course, building an actual CMS would be the ideal solution, but that's a project of a whole different scale and isn't on the near-term roadmap.
:::

### 🔜 Current Progress and Roadmap

The features originally envisioned for Content Console are now largely implemented; going forward, the Admin dashboard will mostly focus on maintenance and detail polish, with no plans to keep stacking new features for now. If you have good ideas or suggestions while using it, feel free to share them.

:::tip[Roadmap]
Comments are on the roadmap — Waline is the current leading candidate for integration. Wiring it into Essay is relatively straightforward; Bits, being a short-update-style page, will need the comment system's styling and layout redesigned to fit. So while the comments module is already planned, it may still take some time before it officially ships.
:::

---

That covers Content Console's current content-management entry points and common operations. If you run into content issues, saving problems, or have ideas or suggestions, feel free to open an Issue.
