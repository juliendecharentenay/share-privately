# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Vue 3 + Vite web application using Tailwind CSS v4. The Vite root is `./src`, so `src/index.html` is the HTML entry point.

## Commands

```bash
npm run dev          # Start dev server (hot reload)
npm run build        # Production build (outputs to dist/)
npm run preview      # Preview production build
npm run test:unit    # Run unit tests with Vitest
```

## Architecture

- **Entry point:** `src/pages/index/main.js` — creates and mounts the Vue app to `#app`
- **Root component:** `src/pages/index/App.vue`
- **Global styles:** `src/styles.css` — imports Tailwind CSS
- **Path alias:** `@` maps to `./src` (configured in `vite.config.js` and `jsconfig.json`)
- **Test environment:** jsdom (configured in `vitest.config.js`)

Pages are organized under `src/pages/<page-name>/` with their own `main.js` entry and `App.vue` root component.
