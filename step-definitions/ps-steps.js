import { When, Then } from '@cucumber/cucumber';
import { BaseWorkflowPage } from '../pages/common/base-workflow-page.js';
import { ParameterStudyCommonPage } from '../pages/parameter-study/ps-common-pages.js';
import { ParameterStudyGridPage } from '../pages/parameter-study/ps-grid-pages.js';
import { ParameterStudyOfftakePage } from '../pages/parameter-study/ps-offtake-pages.js';
import { ResultsPage } from '../pages/results-pages.js';
import { timeouts } from '../util/timeout.js';

When('user creates a new {string} Parameter Study', { timeout: timeouts.extended }, async function (type) {
  const commonSteps = new ParameterStudyCommonPage(this.page);
  const gridSteps = new ParameterStudyGridPage(this.page);
  const offtakeSteps = new ParameterStudyOfftakePage(this.page);
  const baseWorkflow = new BaseWorkflowPage(this.page);
  this.projectType = type;
  const normalizedType = this.projectType.toLowerCase();
  await baseWorkflow.goToConfigurationsMainPage();
  await commonSteps.setupNewPS(type);
  await commonSteps.setupTypeOfPS(type);
  await baseWorkflow.goToGridConnectionsTab();
  await gridSteps.configureGridbyCustomCosts();
  await offtakeSteps.goToOfftakeTab();
  if (normalizedType.includes('wind')) {
    await offtakeSteps.configureWindOfftake();
  } else if (normalizedType.includes('pv')) {
    await offtakeSteps.configurePVOfftake();
  }
  await offtakeSteps.saveOfftakeTab();
  await commonSteps.calculatePS();
});

Then(
  'the PS with better IRR is added to configurations',
  { timeout: timeouts.extraLong },
  async function () {
    const resultsPage = new ResultsPage(this.page);
    const baseWorkflow= new BaseWorkflowPage(this.page);
    const expectedVariants = await resultsPage.verifyPSList();
    await resultsPage.addFirstVariantToConfig(expectedVariants);
    await baseWorkflow.configurationsMainPage();
  }
);
