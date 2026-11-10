# MW Husky Config documentation

VitePress site for [MW Husky Config](https://github.com/mediuswareltd/mw-husky-config).

## Local

```bash
cd docs
npm install
npm run docs:dev
```

## Build

```bash
cd docs
npm run docs:build
```

## Deploy (GitHub Pages)

```bash
# from repo root (after docs deps installed)
node scripts/deploy-docs.js
```

Or push to `main` / `master` and let `.github/workflows/docs.yml` publish to the `gh-pages` branch.

Live site (after Pages is enabled on `gh-pages`):  
https://mediuswareltd.github.io/mw-husky-config/
