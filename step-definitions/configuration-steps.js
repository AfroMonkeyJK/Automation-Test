import { When, Then } from '@cucumber/cucumber';
import { BaseWorkflowPage } from '../pages/common/base-workflow-page.js';
import { ConfigurationCommonPage } from '../pages/configuration/configuration-common-pages.js';
import { ConfigurationGridPage } from '../pages/configuration/configuration-grid-pages.js';
import { ConfigurationOfftakePage } from '../pages/configuration/configuration-offtake-pages.js';
import { ResultsPage } from '../pages/results-pages.js';
import { timeouts } from '../util/timeout.js';

When('user creates a new {string} configuration', { timeout: timeouts.extended }, async function (type) {
  const commonSteps = new ConfigurationCommonPage(this.page);
  const gridSteps = new ConfigurationGridPage(this.page);
  const offtakeSteps = new ConfigurationOfftakePage(this.page);
  const baseWorkflow = new BaseWorkflowPage(this.page);
  this.projectType = type;
  await commonSteps.setupNewConfiguration(type);
  await commonSteps.setupTypeOfConfiguration(type);
  await baseWorkflow.goToGridConnectionsTab();
  await gridSteps.configureGridbyCustomCosts();
  await offtakeSteps.goToOfftakeTab();
  await offtakeSteps.configureOfftakeForType(type);
  await offtakeSteps.saveOfftakeTab();
  await commonSteps.calculateConfiguration();
});

Then(
  'configuration is successfully created and results are validated',
  { timeout: timeouts.extraLong },
  async function () {
    const resultsPage = new ResultsPage(this.page);
    const commonSteps = new ConfigurationCommonPage(this.page);
    await commonSteps.goToResults(this.projectType);
    await resultsPage.verifyConfigurationResults(this.projectType);
  }
);
