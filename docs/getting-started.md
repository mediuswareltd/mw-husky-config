# Getting started

Run **MW Husky Config** on your machine.

## 1. Install

### 1. Install the package

```bash
npm i --save-dev @mediusware/mw-husky-config
```

### 2. Choose Your Installation Mode

**Simple options (recommended):**

```bash
# JavaScript / Node project (pre-commit + commit-msg + security)
npx install-husky --javascript
# or: npx install-husky --js

# PHP / Laravel project (commit-msg + Pint, PHPStan)
npx install-husky --php
# or: npx install-husky --laravel
```

**Other modes:** `--full-setup`, `--only-style-commit-msg`, `--only-commit-msg` (see below).

---

#### Full Setup (Default)
Complete setup with all features (same as `--javascript`):

```bash
npx install-husky
# or explicitly:
npx install-husky --full-setup
npx install-husky --javascript
```

**Includes:**
- Pre-commit hooks (formatting, linting, spelling)
- Security checks (secret scanning, npm audit)
- Commit message validation
- Commit message template

**Dependencies:** `husky`, `lint-staged`, `prettier`, `eslint`, `cspell`, `secretlint`, `@secretlint/secretlint-rule-preset-recommend`

---

#### Style & Commit Message Only
For projects that want code quality checks without security scanning:

```bash
npx install-husky --only-style-commit-msg
```

**Includes:**
- Pre-commit hooks (formatting, linting, spelling)
- Commit message validation
- Commit message template
- No security checks

**Dependencies:** `husky`, `lint-staged`, `prettier`, `eslint`, `cspell`

---

#### Commit Message Only
Minimal setup - only enforces commit message standards:

```bash
npx install-husky --only-commit-msg
```

**Includes:**
- Commit message validation
- Commit message template
- No pre-commit style checks
- No security checks

**Dependencies:** `husky` only

---

#### Laravel / PHP
For Laravel projects: commit message validation + PHP pre-commit (Pint, PHPStan). No JS spelling/lint/secret checks.

```bash
npx install-husky --php
# or: npx install-husky --laravel
```

**Includes:**
- Commit message validation (conventional commits)
- Pre-commit: Laravel Pint, PHPStan (via Composer)
- Commit message template
- No cspell, ESLint, Prettier, or secretlint

**Dependencies:** `husky` only (npm). PHP tools via Composer: `laravel/pint`, `phpstan/phpstan`.

**Composer scripts** (added automatically if missing):
- `lint` – `vendor/bin/pint`
- `analyse` – `vendor/bin/phpstan`

---

### 3. Non-interactive mode

For CI/CD or automated setups, use the `--yes` flag with any mode:

```bash
npx install-husky --javascript --yes   # or --php --yes, --only-commit-msg --yes, etc.
```

This will automatically accept all prompts and complete the setup.

### 4. Mode Comparison

| Feature | Full Setup | Style & Commit Msg | Commit Msg Only | Laravel |
|---------|------------|-------------------|-----------------|---------|
| Commit message validation | Yes | Yes | Yes | Yes |
| Pre-commit (JS: prettier, eslint, cspell) | Yes | Yes | No | No |
| Pre-commit (PHP: pint, phpstan) | No | No | No | Yes |
| Secret scanning | Yes | No | No | No |
| npm audit | Yes | No | No | No |
| Dependencies (npm) | 7 packages | 5 packages | 1 package | 1 package |

### SOC 2 and compliance

Full-setup mode supports SOC 2–relevant controls: **secret scanning** (confidentiality), **traceable commits** (change management), **code quality checks**, and **dependency audit**. Use **full-setup** for strongest coverage. See **[docs/SOC2-COMPLIANCE.md](docs/SOC2-COMPLIANCE.md)** for a control mapping and optional hardening (e.g. failing on npm audit, signed commits).

## 2. Installation

### 1. Install the package

```bash
npm i --save-dev @mediusware/mw-husky-config
```

### 2. Choose Your Installation Mode

**Simple options (recommended):**

```bash
# JavaScript / Node project (pre-commit + commit-msg + security)
npx install-husky --javascript
# or: npx install-husky --js

# PHP / Laravel project (commit-msg + Pint, PHPStan)
npx install-husky --php
# or: npx install-husky --laravel
```

**Other modes:** `--full-setup`, `--only-style-commit-msg`, `--only-commit-msg` (see below).

---

#### Full Setup (Default)
Complete setup with all features (same as `--javascript`):

```bash
npx install-husky
# or explicitly:
npx install-husky --full-setup
npx install-husky --javascript
```

**Includes:**
- Pre-commit hooks (formatting, linting, spelling)
- Security checks (secret scanning, npm audit)
- Commit message validation
- Commit message template

**Dependencies:** `husky`, `lint-staged`, `prettier`, `eslint`, `cspell`, `secretlint`, `@secretlint/secretlint-rule-preset-recommend`

---

#### Style & Commit Message Only
For projects that want code quality checks without security scanning:

```bash
npx install-husky --only-style-commit-msg
```

**Includes:**
- Pre-commit hooks (formatting, linting, spelling)
- Commit message validation
- Commit message template
- No security checks

**Dependencies:** `husky`, `lint-staged`, `prettier`, `eslint`, `cspell`

---

#### Commit Message Only
Minimal setup - only enforces commit message standards:

```bash
npx install-husky --only-commit-msg
```

**Includes:**
- Commit message validation
- Commit message template
- No pre-commit style checks
- No security checks

**Dependencies:** `husky` only

---

#### Laravel / PHP
For Laravel projects: commit message validation + PHP pre-commit (Pint, PHPStan). No JS spelling/lint/secret checks.

```bash
npx install-husky --php
# or: npx install-husky --laravel
```

**Includes:**
- Commit message validation (conventional commits)
- Pre-commit: Laravel Pint, PHPStan (via Composer)
- Commit message template
- No cspell, ESLint, Prettier, or secretlint

**Dependencies:** `husky` only (npm). PHP tools via Composer: `laravel/pint`, `phpstan/phpstan`.

**Composer scripts** (added automatically if missing):
- `lint` – `vendor/bin/pint`
- `analyse` – `vendor/bin/phpstan`

---

### 3. Non-interactive mode

For CI/CD or automated setups, use the `--yes` flag with any mode:

```bash
npx install-husky --javascript --yes   # or --php --yes, --only-commit-msg --yes, etc.
```

This will automatically accept all prompts and complete the setup.

### 4. Mode Comparison

| Feature | Full Setup | Style & Commit Msg | Commit Msg Only | Laravel |
|---------|------------|-------------------|-----------------|---------|
| Commit message validation | Yes | Yes | Yes | Yes |
| Pre-commit (JS: prettier, eslint, cspell) | Yes | Yes | No | No |
| Pre-commit (PHP: pint, phpstan) | No | No | No | Yes |
| Secret scanning | Yes | No | No | No |
| npm audit | Yes | No | No | No |
| Dependencies (npm) | 7 packages | 5 packages | 1 package | 1 package |

### SOC 2 and compliance

Full-setup mode supports SOC 2–relevant controls: **secret scanning** (confidentiality), **traceable commits** (change management), **code quality checks**, and **dependency audit**. Use **full-setup** for strongest coverage. See **[docs/SOC2-COMPLIANCE.md](docs/SOC2-COMPLIANCE.md)** for a control mapping and optional hardening (e.g. failing on npm audit, signed commits).

## 3. Usage

### Example 1: JavaScript / Full Setup (Enterprise)

```bash
cd my-enterprise-app
npm install --save-dev husky-config
npx install-husky --javascript --yes
```

Result: Complete setup with all security and quality checks.

### Example 2: Open Source Project (No Security Scanning)

```bash
cd my-open-source-lib
npm install --save-dev husky-config
npx install-husky --only-style-commit-msg
```

Result: Code quality checks without secret scanning (good for public repos).

### Example 3: Simple Documentation Repo

```bash
cd my-docs-repo
npm install --save-dev husky-config
npx install-husky --only-commit-msg --yes
```

Result: Only commit message validation, no code checks.

### Example 4: Laravel / PHP Project

```bash
cd my-laravel-app
npm install --save-dev husky-config
npx install-husky --php --yes
```

Result: Commit message validation + pre-commit running Pint and PHPStan. Install PHP tools if needed: `composer require --dev laravel/pint phpstan/phpstan`.

---

### Manual Configuration (Optional)

If you skip the automated setup, you can manually add to your `package.json`:

```json
{
  "scripts": {
    "format": "prettier --write \"**/*.{js,jsx,ts,tsx,json,css,md}\"",
    "lint:fix": "eslint --fix",
    "spell": "cspell \"**/*.{js,jsx,ts,tsx,md,json}\" --no-progress",
    "security:secrets": "secretlint \"**/*\"",
    "security": "npm audit --audit-level=moderate",
    "prepare": "husky"
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "prettier --write",
      "eslint --fix",
      "cspell --no-must-find-files"
    ],
    "*.{json,css,md}": [
      "prettier --write",
      "cspell --no-must-find-files"
    ]
  }
}
```

## 4. Requirements

- Node.js >= 14.0.0
- npm >= 6.0.0
- Git >= 2.9.0
- Husky >= 9.0.0

## Next

- Full detail: [Guide](/guide)
- Source: [github.com/mediuswareltd/mw-husky-config](https://github.com/mediuswareltd/mw-husky-config)
