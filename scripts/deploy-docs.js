#!/usr/bin/env node
/**
 * Build VitePress docs and publish to gh-pages (GitHub Pages).
 * Usage: npm run docs:deploy
 */
const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const root = path.join(__dirname, "..");
const docsPkg = path.join(root, "docs", "package.json");
const cwd = fs.existsSync(docsPkg) ? path.join(root, "docs") : root;

console.log("Building docs…");
execSync("npm run docs:build", { cwd, stdio: "inherit", shell: true });

const outDir = fs.existsSync(docsPkg)
  ? path.join(root, "docs", ".vitepress", "dist")
  : path.join(root, "docs", ".vitepress", "dist");

if (!fs.existsSync(outDir)) {
  console.error("Build output missing:", outDir);
  process.exit(1);
}

console.log("Publishing to gh-pages…");
execSync(`npx --yes gh-pages -d "${outDir}" -b gh-pages`, {
  cwd: root,
  stdio: "inherit",
  shell: true,
});
console.log("Done. Enable GitHub Pages → Deploy from branch → gh-pages / (root)");
