# Digi Web Pro — UI Assets

A small, consistent asset pack for the Digi Web Pro Video Store Management System.

## Structure

- `brand/` — logo, mark, favicon
- `loaders/` — page loader, spinner, upload progress, skeleton
- `placeholders/` — video and empty-state artwork
- `avatars/` — neutral profile/avatar placeholders
- `icons/` — reusable navigation/action icons
- `docs/loaders.css` — CSS loading primitives

## Recommended usage

### Logo
Use `brand/digi-web-pro-logo.svg` in the desktop sidebar/header.
Use `brand/digi-web-pro-mark.svg` when the sidebar is collapsed.
Use `brand/favicon.svg` as the browser favicon.

### Loading
- Route/page fetch: `loaders/page-loader.svg` or CSS `.dwp-page-loader`
- Button/API action: CSS `.dwp-spinner`
- Video upload: `loaders/upload-progress.svg` or `.dwp-progress`
- List/card fetch: `loaders/skeleton-card.svg`

## Design tokens

Primary: #5B3DF5
Primary dark: #4327D9
Text: #101936
Muted text: #69748F
Background: #F8F9FC
Surface: #FFFFFF
Border: #E5E7EB
Success: #12B76A
Warning: #F79009
Danger: #F04438

Use the same tokens across every page. Do not create a separate visual language per screen.
