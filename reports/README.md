# Reports Directory

This directory contains generated test reports from the NASH automation framework.

## Structure

```
reports/
├── json/           # JSON test results (raw data)
│   └── .gitkeep   # Ensures directory is tracked by git
└── html/           # HTML test reports (formatted)
    └── .gitkeep   # Ensures directory is tracked by git
```

## Generated Files

### JSON Reports
- **Location**: `reports/json/`
- **Format**: `E2E-Report-ENV-DD-MM-YYYY_HH-MM-SS.json`
- **Purpose**: Raw test data used to generate HTML reports
- **Example**: `E2E-Report-PREPROD-29-07-2025_14-30-15.json`

### HTML Reports
- **Location**: `reports/html/`
- **Format**: `E2E-Report-ENV-DD-MM-YYYY_HH-MM-SS/index.html`
- **Purpose**: Beautiful, interactive test reports with charts and graphs
- **Example**: `E2E-Report-PREPROD-29-07-2025_14-30-15/index.html`

## Usage

Reports are automatically generated when running tests with the `report` parameter:

```bash
# Generate reports for different environments
npm run dev report      # Development environment
npm run qa report       # QA environment  
npm run preprod report  # Pre-production environment
npm run prod report     # Production environment
npm run ci              # CI/CD pipeline (preprod + report)
```

## Cleanup

Remove generated reports while preserving folder structure:

```bash
npm run clean           # Clean all reports
npm run clean:json      # Clean only JSON reports
npm run clean:html      # Clean only HTML reports
```

## Note

- Generated report files are excluded from git via `.gitignore`
- Folder structure is preserved using `.gitkeep` files
- Reports are automatically uploaded as artifacts in CI/CD pipelines
