# Automation Testing Repository with Playwright

This repository contains automated tests using **Playwright**, following good development practices and a clear structure.
Check documentation at: (https://playwright.dev/docs/intro)

## Installation & Requirements

### Recommended VSCode Extensions

Make sure to install the following extensions:

- ✅ [Cucumber (Gherkin) Full Support](https://marketplace.visualstudio.com/items?itemName=alexkrechik.cucumberautocomplete)
- ✅ [ESLint (JavaScript)](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- ✅ [Playwright Test for VSCode](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright)
- ✅ [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

**Note:** It is recommended to configure indentation padding to **2 spaces** in VSCode.

### Automation repository connection

To be able to connect with automation repository install Github CLI:

```bash
npm install gh
gh auth login
git config --global user.email "you@example.com"
git config --global user.name "Your Name"
```

---

## Dependencies

Install the necessary dependencies:

```bash
npm install
npm init playwright@latest
npm install --save-dev @eslint/js
npm install dotenv
npm install cross-env
npm install multiple-cucumber-html-reporter
npm install rimraf
```

---

## Environment Variables

To run the tests locally, you must create a `.env` file at the root of the project (excluded from version control):

```
TESTUSER_EMAIL={user_mail}
TESTUSER_PASSWORD={user_password}
```

> ⚠️ This file is **excluded from version control**. Verify that file .gitignore has this exception.

---

## 🚀 Execution

### Quick Start

To execute tests in your local environment, use the default command:

```bash
npm test    # Runs tests in Preprod environment (default)
```

> 📝 **Note:** Pipeline is automatically triggered after every push to the repository.

---

### 🎯 Environment-Specific Test Execution

Run tests on different environments without generating reports:

```bash
npm run dev      # 🔧 Development environment
npm run qa       # 🧪 QA environment  
npm run preprod  # 🚧 Pre-production environment
npm run prod     # 🌐 Production environment
```

---

### 🏷️ Tag-Based Test Execution

Execute specific test scenarios using tags for targeted testing.

#### Available Tags

| Tag          | Purpose                           | Default Env | Duration  |
|--------------|-----------------------------------|-------------|-----------|
| `@smoke`     | Critical path tests               | preprod     | ~10-15min |
| `@critical`  | Important business flows          | preprod     | ~20-30min |
| `@regression`| Full test suite                   | preprod     | ~30-60min |
| `@wip`       | Work in progress / debugging      | qa          | Variable  |

#### Basic Tag Execution (No Reports)

```bash
npm run smoke            # 🔥 @smoke tests on Preprod (default)
npm run critical         # ⭐ @critical tests on Preprod (default)
npm run regression       # 🔄 @regression tests on Preprod (default)
npm run wip              # 🧪 @wip tests on QA (default)
```

#### Tag Execution with Specific Environments

```bash
# Smoke tests
npm run smoke-dev        # 🔥 @smoke on Dev
npm run smoke-qa         # 🔥 @smoke on QA
npm run smoke-preprod    # 🔥 @smoke on Preprod
npm run smoke-prod       # 🔥 @smoke on Prod

# Critical tests
npm run critical         # ⭐ @critical on Preprod (default)
npm run critical-qa      # ⭐ @critical on QA

# Regression tests
npm run regression       # 🔄 @regression on Preprod (default)
npm run regression-qa    # 🔄 @regression on QA

# WIP tests
npm run wip-dev          # 🧪 @wip on Dev
npm run wip-qa           # 🧪 @wip on QA (default)
npm run wip-preprod      # 🧪 @wip on Preprod
npm run wip-prod         # 🧪 @wip on Prod
```

---

### 📊 HTML Report Generation

Generate beautiful HTML reports with charts and detailed test results:

#### Option 1: Generate Reports from Existing Results
```bash
npm run report   # 📈 Creates HTML report from latest test results
```

#### Option 2: Run Tests + Generate Reports (Recommended)

**Standard Environment Reports:**
```bash
npm run dev-report       # 🔧📊 Dev environment + HTML report
npm run qa-report        # 🧪📊 QA environment + HTML report  
npm run preprod-report   # 🚧📊 Preprod environment + HTML report
npm run prod-report      # 🌐📊 Production environment + HTML report
```

**Tagged Tests with Reports:**
```bash
# Smoke tests with reports
npm run smoke-report            # 🔥📊 @smoke + report (Preprod)
npm run smoke-dev-report        # 🔥📊 @smoke + report (Dev)
npm run smoke-qa-report         # 🔥📊 @smoke + report (QA)
npm run smoke-prod-report       # 🔥📊 @smoke + report (Prod)

# Critical tests with reports
npm run critical-report         # ⭐📊 @critical + report (Preprod)
npm run critical-qa-report      # ⭐📊 @critical + report (QA)

# Regression tests with reports
npm run regression-report       # 🔄📊 @regression + report (Preprod)
npm run regression-qa-report    # 🔄📊 @regression + report (QA)

# WIP tests with reports
npm run wip-report              # 🧪📊 @wip + report (QA)
npm run wip-dev-report          # 🧪📊 @wip + report (Dev)
npm run wip-preprod-report      # 🧪📊 @wip + report (Preprod)
npm run wip-prod-report         # 🧪📊 @wip + report (Prod)
```

---

### 🧹 Cleanup & Maintenance

Keep your workspace clean and organized:

```bash
npm run clean                # 🗑️ Remove all reports (preserves folders)
npm run clean-artifacts      # 🧹 Clean videos, screenshots, and reports
npm run clean-videos         # 🎥 Clean only videos
npm run clean-screenshots    # 📸 Clean only screenshots
npm run clean-reports        # 📊 Clean only reports
npm run clean-all            # 🗑️ Clean everything including cache
```

---

### 🔧 Code Quality

Maintain clean, consistent code with our linting tools:

```bash
npm run lint          # 🔍 Check code for style issues
npm run lint:fix      # 🔧 Auto-fix style issues where possible
```

---

### 📋 CI/CD Pipeline

The project uses GitHub Actions for automated testing:

#### Automatic Triggers

- **Pull Requests**: Runs `@smoke` tests on Preprod
- **Push to main/master**: Runs **all tests** on Preprod
- **Manual trigger**: Run any environment/tag combination via GitHub UI

#### Re-running Failed Tests

If tests fail due to environment instability:

1. Navigate to the failed workflow run
2. Click **"Re-run failed jobs"** (top right)
3. Tests will re-execute with the same configuration

---

### 💡 Common Use Cases

```bash
# Quick smoke test before PR
npm run smoke-preprod-report

# Full validation before release
npm run preprod-report

# Debug specific scenarios
npm run wip-dev

# Complete regression suite
npm run regression-report

# Clean start for fresh reports
npm run clean && npm run smoke-report
```

---

### 📂 Artifact Locations

| Artifact Type | Location | Description |
|---------------|----------|-------------|
| HTML Reports | `reports/html/` | Interactive test reports |
| JSON Reports | `reports/json/` | Raw test data |
| Videos | `test-results/videos/` | Failure recordings only |
| Screenshots | `test-results/screenshots/` | Failure captures only |
| Logs | `test-results/*.log` | Execution logs |

> 💡 **Note:** Videos and screenshots are only saved for **failed tests** to save storage space.

---

### 🔧 Advanced Usage

For additional help and command information:
```bash
npm run help        # 📚 Display all available commands and usage
```

---

## Conventions

### Branch Naming

Use one of the following formats to name your branches:

- `feature/<jira-ticket>-<branch-name>`
- `bugfix/<jira-ticket>-<branch-name>`
- `refactor/<jira-ticket>-<branch-name>` (changes related with refactor, cleaning, etc.)

### Commit Messages

- Commit message has to include details of the changes made.

---
