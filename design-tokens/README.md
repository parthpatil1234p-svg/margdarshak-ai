# 🎨 3-Layer Design Token Architecture
### *MargDarshak AI Enterprise Design System*

This directory houses the single source of truth for all visual tokens across **MargDarshak AI**.

---

## 🏗️ 3-Layer Hierarchy

```
+-----------------------------------------------------------------------------+
| LAYER 1: PRIMITIVES (Raw Un-opinionated Values)                             |
| • Colors: slate-50..950, indigo-400..900, cyan-500, emerald-500, rose-500   |
| • Spacing: space-1 (4px) .. space-16 (64px)                                  |
| • Radius: xs (4px) .. xl (24px) .. full (9999px)                            |
| • Typography: Inter, Plus Jakarta Sans, JetBrains Mono                      |
| • Shadows & Glows: glass, glow-indigo, glow-cyan                            |
+--------------------------------------┬--------------------------------------+
                                       │ Inherits
                                       ▼
+-----------------------------------------------------------------------------+
| LAYER 2: SEMANTICS (Purpose & Theming Context)                              |
| • Surfaces: canvas, card, card-hover, sidebar, topbar, modal, input         |
| • Text: primary, body, secondary, muted, accent, inverse                    |
| • Borders: subtle, default, strong, glow                                    |
| • Feedback: success, warning, danger, info (bg & fg)                         |
| • Interactive: primary, hover, focus-ring                                   |
| • Theme Modes: 🌙 Dark OLED, ☀️ Light Mode, 🌌 Cyber Glow                   |
+--------------------------------------┬--------------------------------------+
                                       │ Scopes into
                                       ▼
+-----------------------------------------------------------------------------+
| LAYER 3: COMPONENTS (Component-Specific Styling)                            |
| • Button: --btn-primary-bg, --btn-radius, --btn-primary-shadow              |
| • Card / Bento: --card-bg, --card-border, --card-backdrop-blur              |
| • Sidebar: --sidebar-width, --sidebar-bg, --sidebar-link-active-bg          |
| • Topbar: --topbar-height, --topbar-bg, --topbar-backdrop-blur             |
| • Dialog: --dialog-bg, --dialog-radius, --dialog-shadow                    |
| • Input: --input-bg, --input-border, --input-focus-ring                     |
| • Badge: --badge-radius, --badge-padding-x, --badge-font-size               |
+-----------------------------------------------------------------------------+
```

---

## 📁 Token Artifacts

- **JSON Tokens (Figma & Tooling):** [`tokens.json`](tokens.json)
- **CSS Variables (Runtime Stylesheet):** [`tokens.css`](tokens.css)

---

## ⚡ Integration Examples

### 1. In Vanilla CSS:
```css
.my-card {
  background: var(--card-bg);
  border: var(--card-border);
  border-radius: var(--card-radius);
  box-shadow: var(--card-shadow);
  backdrop-filter: var(--card-backdrop-blur);
}

.my-button {
  background: var(--btn-primary-bg);
  color: var(--btn-primary-text);
  border-radius: var(--btn-radius);
  padding: var(--btn-padding-y) var(--btn-padding-x);
  box-shadow: var(--btn-primary-shadow);
  transition: var(--btn-transition);
}
```

### 2. In Tailwind CSS (`tailwind.config.js`):
```javascript
module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        canvas: 'var(--semantic-surface-canvas)',
        card: 'var(--semantic-surface-card)',
        sidebar: 'var(--semantic-surface-sidebar)',
        primary: {
          DEFAULT: 'var(--semantic-interactive-primary)',
          hover: 'var(--semantic-interactive-primary-hover)',
        },
        muted: 'var(--semantic-text-muted)',
      },
      borderRadius: {
        card: 'var(--card-radius)',
        dialog: 'var(--dialog-radius)',
      },
      boxShadow: {
        glass: 'var(--primitive-shadow-glass)',
        glow: 'var(--primitive-shadow-glow-indigo)',
      }
    }
  }
}
```
