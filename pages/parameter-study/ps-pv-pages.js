import { BasePage } from '../../util/base-page.js';
import { Selectors } from '../../util/selectors.js';
import { PageElementsHelper } from '../../util/page-elements-helper.js';
import { timeouts } from '../../util/timeout.js';
import { BaseWorkflowPage } from '../common/base-workflow-page.js';
import uiConstants from '../../util/ui-constants.js';
import logger from '../../util/logger.js';

class ParameterStudyPVPage extends BasePage {
  selectors;
  elements;

  constructor(page) {
    super(page);
    this.selectors = Selectors(page);
    this.elements = new PageElementsHelper(this.selectors, page);
    this.baseWorkflow = new BaseWorkflowPage(this.page);
  }

  /**
   * Configure basic PV settings in PS.
   * @param {string} areaSize - Optional site area size (default is '300').
   * @param {string} stepsNum - Optional number of steps (default is '2').
   */
  async configurePSPV(areaSize, stepsNum) {
    try {
      const siteAreaInput = this.selectors.ProjectConfig.psSiteArea();
      await siteAreaInput.fill(areaSize || '300');
      await this.verifyElementState(siteAreaInput, true);
      const dcCapacitySwitchLabel = this.selectors.ParameterStudyPV.dcCapacityField().first();
      await this.verifyElementVisibility(true, dcCapacitySwitchLabel, timeouts.default);
      await dcCapacitySwitchLabel.click();
      const numSteps = this.selectors.tabConfiguration.numSteps();
      await numSteps.fill(stepsNum || '2');
      const saveButton = this.elements.button(uiConstants.buttons.save);
      const successAlert = this.elements.alert(uiConstants.alerts.pvPSUpdated);
      await this.baseWorkflow.saveWithRetry(saveButton, successAlert);
      logger.info('✅ PV configuration completed');
    } catch (error) {
      logger.error('Error in configuring PV section:', error.message);
      throw error;
    }
  }
}

export { ParameterStudyPVPage };
