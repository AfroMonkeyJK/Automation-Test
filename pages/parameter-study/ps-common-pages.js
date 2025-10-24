import { BasePage } from '../../util/base-page.js';
import { Selectors } from '../../util/selectors.js';
import { PageElementsHelper } from '../../util/page-elements-helper.js';
import { BaseWorkflowPage } from '../common/base-workflow-page.js';
import { ParameterStudyPVPage } from './ps-pv-pages.js';
import { ParameterStudyWindPage } from './ps-wind-pages.js';
import { timeouts } from '../../util/timeout.js';
import uiConstants from '../../util/ui-constants.js';
import logger from '../../util/logger.js';

class ParameterStudyCommonPage extends BasePage {
  selectors;
  elements;
  windPage;
  pvPage;

  constructor(page) {
    super(page);
    this.selectors = Selectors(page);
    this.elements = new PageElementsHelper(this.selectors, page);
    this.baseWorkflow = new BaseWorkflowPage(page);
    this.psWindPage = new ParameterStudyWindPage(page);
    this.psPVPage = new ParameterStudyPVPage(page);
  }

  /**new
   * Setup a new Parameter Study (PS).
   * @param {string} type - Type of parameter study (PV, Wind Offshore, Wind Onshore, Hybrid PV or Hybrid Wind).
   */
  async setupNewPS(type) {
    try {
      const newPSButton = this.elements.button(uiConstants.buttons.newPS);
      await this.click(newPSButton);
      await this.verifyElementVisibility(true, this.elements.heading(uiConstants.headings.psSetup));
      const PSName = this.elements.placeholder(uiConstants.placeholders.fieldNamePS);
      await PSName.fill(uiConstants.dynamicText.psName(type));
      const saveButton = this.elements.button(uiConstants.buttons.save);
      await this.verifyElementState(saveButton, true);
      await this.click(saveButton);
      await this.verifyElementVisibility(true, this.elements.alert(uiConstants.alerts.createdPS));
      logger.info(`✅ Parameter Study name set and saved for ${type}`);
    } catch (error) {
      logger.error(`Error Creating Parameter Study and adding name for ${type}:`, error.message);
      throw error;
    }
  }

  /**
   * Set up each type of configuration (PV, Wind Offshore, Wind Onshore, Hybrid).
   * @param {string} type - Project type.
   */
  async setupTypeOfPS(type) {
    try {
      const normalizedType = type.toLowerCase();
      if (uiConstants.projectTypeGroupsPS.hasWind(normalizedType)) {
        await this.goToWindPSTab();
        await this.psWindPage.configurePSWindWithBasicLayout();
      }
      if (uiConstants.projectTypeGroupsPS.hasPv(normalizedType)) {
        await this.goToPVPSTab();
        await this.psPVPage.configurePSPV();
      }
      logger.info(`✅ Selected ${normalizedType} parameter study`);
    } catch (error) {
      logger.error('Error configuring technology settings:', error.message);
      throw error;
    }
  }

  /**
   * Calculate the Parameter Study and wait until results are returned.
   */
  async calculatePS() {
    try {
      const calculateButton = this.elements.button(uiConstants.buttons.calculatePS);
      const computationStartedAlert = this.elements.alert(uiConstants.alerts.computationPSStarted);
      await this.click(calculateButton);
      await this.verifyElementVisibility(true, computationStartedAlert, timeouts.default);
      await this.waitForElementHidden(computationStartedAlert, timeouts.medium);
      const progressAlert = this.selectors.AlertBySelector.psCalculationStatus();
      await this.verifyElementVisibility(true, progressAlert, timeouts.long);
      await this.waitForElementHidden(progressAlert, timeouts.extraLong);
      await this.verifyElementVisibility(true, this.elements.alert(uiConstants.alerts.computedPS), timeouts.extended);
      await this.verifyElementVisibility(true, this.elements.button(uiConstants.buttons.addToConfig));
      logger.info('✅ Parameter Study has been computed');
    } catch (error) {
      logger.error('Error in calculating Configuration:', error.message);
      throw error;
    }
  }

  /**
   * Navigate to PV tab.
   */
  async goToPVPSTab() {
    const pvTab = this.elements.tab(uiConstants.tabs.pvPSTab);
    await this.click(pvTab);
    const pvTabHeading = this.elements.heading(uiConstants.headings.siteConditions);
    await this.verifyElementVisibility(true, pvTabHeading, timeouts.default);
    logger.info('✅ PV PS tab displayed');
  }

  /**
   * Navigate to Wind tab.
   */
  async goToWindPSTab() {
    const windTab = this.elements.tab(uiConstants.tabs.windPSTab);
    await this.click(windTab);
    const windTabHeading = this.elements.heading(uiConstants.headings.siteConditions);
    await this.verifyElementVisibility(true, windTabHeading, timeouts.default);
    logger.info('✅ Wind PS tab displayed');
  }
}

export { ParameterStudyCommonPage };
