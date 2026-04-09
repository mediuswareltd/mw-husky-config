<div align="center">
  <img src="https://github.com/mediuswareltd/mw-husky-config/blob/HEAD/arts/logo.png?raw=true" alt="alt text" height="250" width="250">
</div>


# MW Husky Config

A reusable Husky configuration package for maintaining consistent Git hooks across multiple projects with **automated setup**.

```bash
npm i --save-dev @mediusware/mw-husky-config
```

## Features

- **Automated Installation**: One command setup with dependency installation and configuration
- **Pre-commit Hook**: Runs code quality checks including:
  - Prettier formatting
  - ESLint code linting
  - Spelling checks (cspell)
  - Secret scanning (secretlint)
  - Security audit (npm audit)

- **Commit Message Hook**: Enforces conventional commit standards
  - Validates commit message format
  - Ensures proper commit types (feat, fix, chore, etc.)
  - Validates message length (10-100 characters)

## Installation

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

## What Gets Automated

The installer automatically handles (varies by mode):

**Dependency Installation**
- Installs only the dependencies needed for your chosen mode
- Prompts before installing (skip with `--yes`)

**Package.json Configuration**
- Adds required scripts based on mode
- Configures `lint-staged` with file patterns (if applicable)
- Adds `prepare` script for Husky initialization

**Git Hooks Setup**
- Copies appropriate hooks for your mode
- Makes hooks executable (Unix-based systems)
- Sets up commit message template

**Git Configuration**
- Configures commit.template to use `.gitmessage`

## Usage Examples

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

## Command Reference

```bash
# Simple options (recommended)
npx install-husky --javascript          # JS/Node: full pre-commit + commit-msg + security
npx install-husky --js --yes           # same, non-interactive
npx install-husky --php                # PHP/Laravel: commit-msg + Pint, PHPStan
npx install-husky --laravel --yes      # same, non-interactive

# Default full setup (interactive)
npx install-husky

# Full setup (non-interactive)
npx install-husky --full-setup --yes

# Style checks + commit message (interactive)
npx install-husky --only-style-commit-msg

# Style checks + commit message (non-interactive)
npx install-husky --only-style-commit-msg --yes

# Commit message only (interactive)
npx install-husky --only-commit-msg

# Commit message only (non-interactive)
npx install-husky --only-commit-msg --yes

# Laravel / PHP (commit-msg + PHP pre-commit)
npx install-husky --php
npx install-husky --laravel --yes
```

## Configuration Files

### Automatically Created Configurations

The installer creates default configuration files based on your selected mode:

#### CSpell Configuration (`.cspell.json`)

Created for: `--full-setup` and `--only-style-commit-msg` modes

Default configuration includes:
- Common dev tool names (husky, eslint, prettier, etc.)
- Ignored paths (node_modules, dist, build)
- Ignored patterns (hex codes, UUIDs, all-caps abbreviations)
- Compound word support

You can customize this file to:
- Add project-specific words to the `words` array
- Ignore additional paths or patterns
- Configure language settings

See [cspell documentation](https://cspell.org/configuration/) for all options.

#### Secretlint Configuration (`.secretlintrc.json`)

Created for: `--full-setup` mode only

Default configuration scans for:
- API keys and tokens
- Private keys and certificates
- AWS credentials
- Database connection strings
- Other sensitive data

You can customize this file to add or remove rules. See [secretlint documentation](https://github.com/secretlint/secretlint) for available rules.

### Additional Configurations (Optional)

You may also want to configure:
- `.prettierrc` - Prettier formatting rules
- `.eslintrc` - ESLint linting rules

## Customization

After installation, you can customize the hooks in your project's `.husky/` directory to match your specific requirements.

### Pre-commit Hook Customization

Edit `.husky/pre-commit` to:
- Add or remove quality checks
- Modify validation rules
- Change error messages

### Commit Message Hook Customization

Edit `.husky/commit-msg` to:
- Add or remove commit types
- Change message length limits
- Modify validation regex patterns

## Commit Message Format

This configuration enforces the following commit message format:

```
<type>: <description>
```

### Supported Types

- `feat`: New feature
- `fix`: Bug fix
- `chore`: Routine task
- `hotfix`: Urgent fix
- `refactor`: Code refactoring
- `docs`: Documentation changes
- `test`: Testing changes
- `ci`: CI/CD changes
- `perf`: Performance improvements

### Examples

```bash
git commit -m "feat: add user authentication system"
git commit -m "fix: resolve database connection timeout"
git commit -m "chore: update npm dependencies"
git commit -m "refactor: simplify payment processing logic"
```

## Requirements

- Node.js >= 14.0.0
- npm >= 6.0.0
- Git >= 2.9.0
- Husky >= 9.0.0

## Troubleshooting

### Hooks not running

1. Ensure Husky is properly initialized:
   ```bash
   npx husky install
   ```

2. Check that hooks are executable (Unix-based systems):
   ```bash
   chmod +x .husky/*
   ```

3. Verify the `prepare` script is in your `package.json`:
   ```json
   {
     "scripts": {
       "prepare": "husky"
     }
   }
   ```

### Permission errors on Windows

Hooks should work on Windows via Git Bash or WSL. If you encounter issues:
- Use Git Bash instead of PowerShell/CMD
- Or install Windows Subsystem for Linux (WSL)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Author

Mediusware Engineering Team

## Links

- [Husky Documentation](https://typicode.github.io/husky/)
- [Conventional Commits](https://conventionalcommits.org/)
- [lint-staged](https://github.com/okonet/lint-staged)
