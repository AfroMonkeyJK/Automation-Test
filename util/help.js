#!/usr/bin/env node

/**
 * Display available commands and their usage
 */
function showCommands() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🚀 Test Automation - Available Commands');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');

  console.log('📋 BASIC TEST COMMANDS (No Reports):');
  console.log('  npm run dev      🟢 Run tests on DEV environment');
  console.log('  npm run qa       🟡 Run tests on QA environment');
  console.log('  npm run preprod  🟠 Run tests on PREPROD environment');
  console.log('  npm run prod     🔴 Run tests on PRODUCTION environment');
  console.log('');

  console.log('📊 TEST COMMANDS WITH REPORTS:');
  console.log('  npm run dev-report      🟢📊 DEV tests + HTML report');
  console.log('  npm run qa-report       🟡📊 QA tests + HTML report');
  console.log('  npm run preprod-report  🟠📊 PREPROD tests + HTML report');
  console.log('  npm run prod-report     🔴📊 PRODUCTION tests + HTML report');
  console.log('');

  console.log('🏷️  TAGGED TEST COMMANDS (No Reports):');
  console.log('');
  console.log('  🔥 Smoke Tests (Critical path, ~10-15 min):');
  console.log('    npm run smoke             🟠 @smoke on PREPROD (default)');
  console.log('    npm run smoke-dev         🟢 @smoke on DEV');
  console.log('    npm run smoke-qa          🟡 @smoke on QA');
  console.log('    npm run smoke-prod        🔴 @smoke on PROD');
  console.log('');
  console.log('  ⭐ Critical Tests (Important flows, ~20-30 min):');
  console.log('    npm run critical          🟠 @critical on PREPROD (default)');
  console.log('    npm run critical-qa       🟡 @critical on QA');
  console.log('');
  console.log('  🔄 Regression Tests (Full suite, ~30-60 min):');
  console.log('    npm run regression        🟠 @regression on PREPROD (default)');
  console.log('    npm run regression-qa     🟡 @regression on QA');
  console.log('');
  console.log('  🧪 WIP Tests (Work in progress, variable):');
  console.log('    npm run wip               🟡 @wip on QA (default)');
  console.log('    npm run wip-dev           🟢 @wip on DEV');
  console.log('    npm run wip-preprod       🟠 @wip on PREPROD');
  console.log('    npm run wip-prod          🔴 @wip on PROD');
  console.log('');

  console.log('📊 TAGGED TESTS WITH REPORTS:');
  console.log('');
  console.log('  🔥📊 Smoke Tests + Reports:');
  console.log('    npm run smoke-report          🟠📊 @smoke + report (PREPROD)');
  console.log('    npm run smoke-dev-report      🟢📊 @smoke + report (DEV)');
  console.log('    npm run smoke-qa-report       🟡📊 @smoke + report (QA)');
  console.log('    npm run smoke-prod-report     🔴📊 @smoke + report (PROD)');
  console.log('');
  console.log('  ⭐📊 Critical Tests + Reports:');
  console.log('    npm run critical-report       🟠📊 @critical + report (PREPROD)');
  console.log('    npm run critical-qa-report    🟡📊 @critical + report (QA)');
  console.log('');
  console.log('  🔄📊 Regression Tests + Reports:');
  console.log('    npm run regression-report     🟠📊 @regression + report (PREPROD)');
  console.log('    npm run regression-qa-report  🟡📊 @regression + report (QA)');
  console.log('');
  console.log('  🧪📊 WIP Tests + Reports:');
  console.log('    npm run wip-report            🟡📊 @wip + report (QA)');
  console.log('    npm run wip-dev-report        🟢📊 @wip + report (DEV)');
  console.log('    npm run wip-preprod-report    🟠📊 @wip + report (PREPROD)');
  console.log('    npm run wip-prod-report       🔴📊 @wip + report (PROD)');
  console.log('');

  console.log('🤖 CI/CD COMMANDS:');
  console.log('  npm run ci              🟠📊 PREPROD tests + report (for pipelines)');
  console.log('');

  console.log('🧹 CLEANUP COMMANDS:');
  console.log('  npm run clean                 🧹 Clean all reports (preserves folders)');
  console.log('  npm run clean-artifacts       🗑️  Clean videos, screenshots, and reports');
  console.log('  npm run clean-videos          🎥 Clean only videos');
  console.log('  npm run clean-screenshots     📸 Clean only screenshots');
  console.log('  npm run clean-reports         📊 Clean only reports');
  console.log('  npm run clean-all             🗑️  Clean everything including cache');
  console.log('');

  console.log('📊 REPORT COMMANDS:');
  console.log('  npm run report          📊 Generate report from last execution');
  console.log('');

  console.log('🔧 CODE QUALITY:');
  console.log('  npm run lint            🔍 Check code for style issues');
  console.log('  npm run lint:fix        🔧 Auto-fix style issues');
  console.log('');

  console.log('❓ HELP:');
  console.log('  npm run help            ❓ Show this help menu');
  console.log('');

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📁 ARTIFACT LOCATIONS');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  📄 HTML Reports:   ./reports/html/E2E-Report-ENV-TAG-DATE_TIME/');
  console.log('  📊 JSON Data:      ./reports/json/E2E-Report-ENV-TAG-DATE_TIME.json');
  console.log('  🎥 Videos:         ./test-results/videos/ (failures only)');
  console.log('  📸 Screenshots:    ./test-results/screenshots/ (failures only)');
  console.log('  📝 Logs:           ./test-results/*.log');
  console.log('');

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🌍 ENVIRONMENTS & 🏷️  TAGS');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('  Environments:');
  console.log('    🟢 DEV      - Development environment');
  console.log('    🟡 QA       - QA environment');
  console.log('    🟠 PREPROD  - Pre-production environment');
  console.log('    🔴 PROD     - Production environment');
  console.log('');
  console.log('  Tags:');
  console.log('    🔥 @smoke      - Critical path tests (~10-15 min, 4 scenarios)');
  console.log('    ⭐ @critical   - Important flows (~20-30 min, ~25 scenarios)');
  console.log('    🔄 @regression - Full test suite (~30-60 min, all scenarios)');
  console.log('    🧪 @wip        - Work in progress (variable, development only)');
  console.log('');

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('💡 COMMON USE CASES');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('  🚀 Quick validation before PR:');
  console.log('     npm run smoke-preprod-report');
  console.log('');
  console.log('  🔍 Debug specific scenarios:');
  console.log('     npm run wip-dev');
  console.log('');
  console.log('  ✅ Pre-deployment validation:');
  console.log('     npm run critical-report');
  console.log('');
  console.log('  🔄 Complete regression:');
  console.log('     npm run regression-report');
  console.log('');
  console.log('  🧹 Fresh start:');
  console.log('     npm run clean && npm run smoke-report');
  console.log('');
  console.log('  🎯 Full CI pipeline:');
  console.log('     npm run clean-all && npm run ci');
  console.log('');

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔄 CI/CD PIPELINE BEHAVIOR');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('  📌 Pull Request:');
  console.log('     Trigger: Automatic on PR');
  console.log('     Tests:   @smoke on PREPROD');
  console.log('     Time:    ~10-15 minutes');
  console.log('');
  console.log('  📌 Push to main/master:');
  console.log('     Trigger: Automatic on merge');
  console.log('     Tests:   ALL tests on PREPROD');
  console.log('     Time:    ~30-60 minutes');
  console.log('');
  console.log('  📌 Manual Workflow:');
  console.log('     Trigger: GitHub UI "Run workflow"');
  console.log('     Tests:   Choose environment + tags');
  console.log('     Time:    Variable');
  console.log('');
  console.log('  💡 Re-run failed tests:');
  console.log('     Navigate to failed run → Click "Re-run failed jobs"');
  console.log('');

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📚 MORE INFORMATION');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('  📖 Full documentation:     See README.md');
  console.log('  🌐 Playwright docs:        https://playwright.dev/docs/intro');
  console.log('  🥒 Cucumber docs:          https://cucumber.io/docs/cucumber/');
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

// Run if called directly (always run when this file is executed)
showCommands();

export { showCommands };
