# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-02-03

### Added
- Initial release of husky-config
- Pre-commit hook with quality checks:
  - lint-staged for code formatting and linting
  - Spelling checks with cspell
  - Security scanning with secretlint
  - Dependency vulnerability checking with npm audit
- Commit message validation hook:
  - Conventional commits format enforcement
  - Commit type validation (feat, fix, chore, etc.)
  - Message length constraints (10-100 characters)
- Automated installer script (`install-husky.js`):
  - Initializes Husky in target project
  - Copies all hooks to project
  - Sets executable permissions
  - Provides setup guidance
- Comprehensive documentation:
  - README.md with setup instructions
  - USAGE.md with detailed usage examples
  - TEST-LOCAL.md for local testing guide
- Support for multiple project types
- Cross-platform compatibility (Windows, macOS, Linux)

### Features
- Simple installation via `npx install-husky`
- Customizable hooks for project-specific needs
- Colorful CLI output for better user experience
- Dependency checking and guidance
- npm package ready for publishing

## [2.0.0] - 2026-02-03

### Added
- **Multiple Installation Modes:**
  - `--full-setup`: Complete setup with all features (default)
  - `--only-style-commit-msg`: Style checks + commit validation (no security)
  - `--only-commit-msg`: Commit message validation only
- **Automated Setup:**
  - Auto-detects and installs missing dependencies
  - Auto-configures package.json scripts
  - Auto-configures lint-staged settings
  - Interactive prompts with smart defaults
- **Non-interactive Mode:**
  - `--yes` flag for CI/CD and automated setups
  - Skips all prompts and installs with defaults
- Mode comparison table in README
- Detailed usage examples for different project types
- New `pre-commit-style` hook (without security checks)
- Default `.secretlintrc.json` configuration file
- Automatic secretlint config setup for full-setup mode

### Changed
- Enhanced installer with modular dependency installation
- Improved CLI output with mode descriptions
- Updated README with comprehensive mode documentation
- Package.json now explicitly lists hook files

### Improved
- More flexible dependency management
- Better user experience with clear mode selection
- Reduced overhead for simple projects (commit-msg only mode)
- Clearer success messages based on selected mode
- Removed all emojis from documentation and CLI output (using text labels instead)

## [Unreleased]

### Planned
- Additional hooks (pre-push, post-commit)
- Configuration file support (.huskyrc)
- TypeScript support
- Integration with popular CI/CD platforms
- Hook skip functionality for emergency commits
- Auto-update mechanism for hooks

---

## Version History

- **1.0.0** - Initial release with core functionality
