# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pathfinder Rewards is a Jekyll-powered static website for a loyalty program serving EV drivers. Hosted on GitHub Pages at pathfinderrewards.com.

## Development Commands

```bash
# Install dependencies
bundle install --path vendor/bundle

# Build the site
bundle exec jekyll build

# Serve locally with live reload (http://localhost:4000)
bundle exec jekyll serve
```

**Deployment:** Automatic via GitHub Pages on push to `main` branch.

## Architecture

### Layout System
- `_layouts/default.html` - Base template wrapping all pages
- `_includes/header.html` - Navigation, meta tags, Font Awesome, analytics (Tinylytics)
- `_includes/footer.html` - Footer content and scripts

### Page-Specific Assets
Pages can include custom stylesheets and scripts via front matter:
```yaml
---
layout: default
title: Page Title
stylesheet: /assets/css/custom.css
script: /assets/js/custom.js
---
```

### Key Pages
- `index.html` - Landing page with hero, tier showcase, benefits
- `playbook.html` - Internal documentation with dual-pane layout (sticky sidebar + content)

### Styling Architecture
- **No CSS framework** - Pure CSS with CSS variables
- **Theme support** via CSS custom properties in `main.css`:
  - Brand colors: `--charcoal`, `--warm`, `--cream`
  - Theme vars: `--bg-primary`, `--text-primary`, etc.
  - Tier colors: `--tier-explorer`, `--tier-voyager`, `--tier-pioneer`, `--tier-trailblazer`
- **Dark mode** automatically via `prefers-color-scheme` media queries
- **Mobile-first** responsive design with `@media (min-width: 768px)` breakpoints

### JavaScript
- `main.js` - Mobile menu toggle, smooth scrolling, click-outside handling
- `playbook.js` - Sidebar section highlighting on scroll, mobile sidebar toggle

## Brand Assets

Located in `pathfinder-assets/`:
- Logo variants (mark, lockup horizontal/stacked) in dark/white, multiple sizes
- Favicons (16px, 32px, 128px)
- Brand guidelines (HTML + PDF)

## Configuration

`_config.yml` contains site metadata, SEO settings, and organization info. The `jekyll-seo-tag` plugin handles meta tags automatically.
