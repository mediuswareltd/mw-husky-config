# SOC 2 Compliance Mapping

This document maps how **husky-config** supports SOC 2 Trust Service Criteria (TSC) relevant to development and change management. It is intended for internal compliance and auditor reference.

---

## What This Husky Covers

### 1. **Confidentiality & Secrets (C1, CC6.1)**

| Control intent | How husky-config helps |
|----------------|-------------------------|
| Prevent sensitive data in source code | **Secret scanning (secretlint)** runs on every commit (full-setup). Commits containing API keys, passwords, tokens, or other detected secrets are **blocked**. |
| Keep env/secrets out of version control | **`.env` in `.gitignore`** is ensured by the installer; `.secretlintrc.json` and `.secretlintignore` ignore env files from scanning. |

**Relevant hooks:** Pre-commit (full-setup) runs `security:secrets` (secretlint). Installer adds/ensures `.env` in the project’s `.gitignore`.

---

### 2. **Change Management & Traceability (CC8.1)**

| Control intent | How husky-config helps |
|----------------|-------------------------|
| Consistent, traceable change history | **Commit message hook** enforces [Conventional Commits](https://conventionalcommits.org): type (feat, fix, chore, etc.), format, and length (10–100 chars). Supports audit trails and automated changelogs. |
| Commit message template | **`.gitmessage`** is copied so developers get guidance and a consistent structure. |

**Relevant hooks:** `commit-msg` validates format and length; installer copies `.gitmessage`.

---

### 3. **Security & Code Quality (CC6.1, Processing Integrity)**

| Control intent | How husky-config helps |
|----------------|-------------------------|
| Code quality and consistency | **Pre-commit (lint-staged)** runs Prettier (format), ESLint (lint), and cspell (spelling) on staged files. Failed checks **block** the commit. |
| Dependency vulnerabilities | **npm audit** runs on pre-commit (full-setup). By default it **warns** only (does not block). See “Gaps and optional hardening” below to fail on vulnerabilities. |

**Relevant hooks:** Pre-commit (full-setup) runs `lint-staged` and `security:secrets`; `npm run security` (npm audit) is run with `|| true`.

---

## Summary Table

| SOC 2–relevant area | Covered by husky-config | Notes |
|--------------------|-------------------------|--------|
| Secrets in code (Confidentiality) | Yes | secretlint blocks commit; .env in .gitignore |
| Traceable commits (Change management) | Yes | Conventional commits + commit-msg hook |
| Code quality / consistency | Yes | Prettier, ESLint, cspell via lint-staged |
| Dependency vulnerabilities | Partial | npm audit runs but does not fail commit by default |
| Signed commits (identity) | No | Not enforced; use platform or policy |
| Branch protection / PR review | No | Handled by GitHub/GitLab/etc., not git hooks |

---

## Gaps and Optional Hardening

These are **not** required for SOC 2 by default but are often requested or recommended:

1. **Fail on dependency vulnerabilities**  
   Pre-commit runs `npm run security` but by default does not block the commit on findings. For stricter SOC 2 posture, set **`HUSKY_FAIL_ON_AUDIT=1`** (e.g. in your environment or in a `.env` used by the team) so that dependency vulnerabilities **fail** the commit. No hook edit required.

2. **Signed commits**  
   SOC 2 auditors may expect proof of who made a change. Enforce signed commits (GPG or SSH) via:
   - A `commit-msg` or `pre-commit` check that verifies signature, or  
   - Branch protection rules that require signed commits (e.g. on GitHub).

3. **Branch protection and peer review**  
   These are enforced in the Git host (GitHub, GitLab, etc.), not in husky: require PR reviews, status checks, and branch protection for main/master.

4. **CI alignment**  
   Run the same checks (lint, secret scan, audit) in CI so that bypassing local hooks does not allow non-compliant code to be merged.

---


## References

- [SOC 2 – Trust Services Criteria (AICPA & CIMA)](https://www.aicpa.org/topic/audit-assurance/audit-and-assurance-greater-than-soc-2)
- [2017 Trust Services Criteria – PDF with revised points of focus (2022)](https://www.aicpa.org/resources/download/2017-trust-services-criteria-with-revised-points-of-focus-2022)
- [Conventional Commits](https://conventionalcommits.org)
- [secretlint](https://github.com/secretlint/secretlint)
- [npm audit](https://docs.npmjs.com/cli/v10/commands/npm-audit)
- [GitHub: Managing branch protection rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-branches-and-merges-in-your-repository/managing-a-branch-protection-rule)
- [GitHub: Signing commits](https://docs.github.com/en/authentication/managing-commit-signature-verification/signing-commits)
