---
title: Markdown Formatting Guide
description: Demonstrates all Markdown formatting effects, including headings, lists, code, tables, blockquotes, and more
date: 2026-01-15
badge: Example
tags: [ "Markdown", "Formatting"]
draft: false
---

This post demonstrates all the Markdown formatting effects supported by this theme.

First paragraph… (used for the list preview)
<!-- more -->
The rest of the body…

## Text Formatting

This is a plain paragraph. **This is bold text**, *this is italic text*, ***this is bold italic***. You can also use ~~strikethrough~~ to mark deprecated content.

Inline code is wrapped in backticks: `const hello = 'world'`, which works well for marking variable names or commands.

## Blockquotes

> The value of design goes beyond completion. Good design should withstand the test of time, retaining its distinct charm and usefulness as the years pass.

You can also use multi-paragraph quotes:

> First paragraph of the quote.
>
> Second paragraph of the quote, showing the multi-paragraph effect.

Source attribution (put `<cite>` on the last line inside the blockquote):

> The value of design goes beyond completion.
>
> <cite>— Dieter Rams</cite>

Pullquote (using the `blockquote.pullquote` variant):

<blockquote class="pullquote">
  You hated those people so fiercely, fought them for so long, only to become just like them in the end. No ideal in this world is worth that kind of ruin as its price.
  <cite>— One Hundred Years of Solitude</cite>
</blockquote>

## Callouts

Supports four shorthand types: `note / tip / info / warning`. Here's the minimal syntax first; for finer control, you can also write raw HTML.

~~~md
:::note[Title]
This is the body text.
:::
~~~

If you need raw HTML for more precise control:

~~~html
<div class="callout note">
  <p class="callout-title" data-icon="none">Title</p>
  <p>This is the body text.</p>
</div>
~~~

Notes:
- The default icon is determined by the type; no need for `<span class="callout-icon">`.
- To hide the icon, use `data-icon="none"` on `.callout-title`.
- A custom icon can be set with `data-icon="✨"` (optional).

### Shorthand Variant Examples (Callout)

This set of examples mainly shows how different types, title forms, and content structures render on the frontend.

:::note
This is an example with no title.
:::

:::note[With a title]
This is a normal paragraph of body text.
:::

:::tip[Tip]
Can include inline code `npm run dev`, emphasized text, and [links](https://astro.build).
:::

:::info[Info]
```ts
const hello = 'world';
```
:::

:::warning[Warning]
> Can also include a blockquote.
>
> Can also span multiple paragraphs.
:::

The basic syntax is as follows:

~~~text
:::type[optional title]
body content
:::
~~~

Only `note / tip / info / warning` are supported; unsupported types (like `:::foo[...]`) currently fall back to `note`.

## Lists

### Unordered List

- First item
- Second item
  - Nested item A
  - Nested item B
- Third item

### Ordered List

1. Preparation
2. Install dependencies
3. Run the project
   1. Development mode
   2. Production build

### Task List

- [x] Finish the design draft
- [x] Build the homepage
- [ ] Write the docs
- [ ] Ship to production

## Code Blocks

The code blocks below demonstrate the toolbar (language / line count / copy button) and line numbers (on by default).

### JavaScript

```javascript
// A simple Astro component example
const greeting = 'Hello, World!';

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10)); // 55
```

### Python

```python
def quick_sort(arr):
    """Quick sort implementation"""
    if len(arr) <= 1:
        return arr
    
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    
    return quick_sort(left) + middle + quick_sort(right)

# Example usage
numbers = [3, 6, 8, 10, 1, 2, 1]
print(quick_sort(numbers))
```

### CSS

```css
.card {
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
}
```

### Shell

```bash
# Install dependencies and start the dev server
npm install
npm run dev

# Build for production
npm run build
```

## Tables

| Feature | Status | Notes |
|:----:|:----:|:----:|
| Responsive layout | ✅ | Fully adapts to mobile |
| Dark mode | 🚧 | In progress |
| RSS feed | ✅ | Supports multiple feeds |
| i18n | ❌ | Planned |

## Links and Images

This is an [external link](https://astro.build) that opens in a new tab.

### Figure / Caption

**Case A: img + figcaption**

<figure class="figure">
  <img src="/images/archive/demo-archive-01.webp" alt="Caption example image 1" />
  <figcaption class="figure-caption">Caption example: this is the image's caption text.</figcaption>
</figure>

**Case B: no figcaption**

<figure class="figure">
  <img src="/images/archive/demo-archive-02.webp" alt="No-caption example" />
</figure>

**Case C: picture + figcaption (optional)**

<figure class="figure">
  <picture>
    <source srcset="/images/archive/demo-archive-03.webp" type="image/webp" />
    <img src="/images/archive/demo-archive-02.webp" alt="Caption example image 2" />
  </picture>
  <figcaption class="figure-caption">Caption example: caption text for the picture element.</figcaption>
</figure>

> Note: under the current styles, `img` and `picture` look visually identical. `picture` is mainly for providing multiple "fallback versions" of the same image — the browser automatically picks the best match (e.g. a small image for mobile, a large one for desktop, or preferring WebP/AVIF). If you don't need automatic version selection, `img` is fine.

### Gallery

**Case: two-image layout (with optional figcaption)**

<ul class="gallery">
  <li>
    <figure>
      <img src="/images/archive/demo-archive-01.webp" alt="Gallery example 1" />
      <figcaption>First caption (optional)</figcaption>
    </figure>
  </li>
  <li>
    <figure>
      <img src="/images/archive/demo-archive-02.webp" alt="Gallery example 2" />
      <figcaption>Second caption (optional)</figcaption>
    </figure>
  </li>
</ul>

## Horizontal Rule

Some content above.

---

Some other content below.

## Math and Special Characters

Common math symbols: π ≈ 3.14159, e ≈ 2.71828

Special characters: © 2026 · ™ · ® · € · £ · ¥ · → · ← · ↑ · ↓

## English Paragraph

> The best way to predict the future is to invent it. — Alan Kay

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.

## Mixed Formatting

This is a paragraph mixing **bold**, *italic*, `code`, and [links](/). You can freely combine these elements within a single paragraph to create a richer reading experience.

---

That covers all the Markdown formats supported by this theme. If you spot any rendering issues, feel free to open an Issue!
