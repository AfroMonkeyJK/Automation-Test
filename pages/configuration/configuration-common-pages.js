import { BasePage } from '../../util/base-page.js';
import { Selectors } from '../../util/selectors.js';
import { PageElementsHelper } from '../../util/page-elements-helper.js';
import { BaseWorkflowPage } from '../common/base-workflow-page.js';
import { timeouts } from '../../util/timeout.js';
import { ConfigurationWindPage } from '../configuration/configuration-wind-pages.js';
import { ConfigurationPVPage } from '../configuration/configuration-pv-pages.js';
import uiConstants from '../../util/ui-constants.js';
import logger from '../../util/logger.js';

class ConfigurationCommonPage extends BasePage {
  selectors;
  elements;
  windPage;
  pvPage;

  constructor(page) {
    super(page);
    this.selectors = Selectors(page);
    this.elements = new PageElementsHelper(this.selectors, page);
    this.windPage = new ConfigurationWindPage(page);
    this.pvPage = new ConfigurationPVPage(page);
    this.baseWorkflow = new BaseWorkflowPage(page);
  }

  /**
   * Setup a new configuration.
   * @param {string} type - Type of configuration (PV, Wind Offshore, Wind Onshore, Hybrid).
   */
  async setupNewConfiguration(type) {
    try {
      const newConfigButton = this.elements.button(uiConstants.buttons.newConfiguration);
      await this.click(newConfigButton);
      await this.verifyElementVisibility(true, this.elements.heading(uiConstants.headings.configurationSetup));
      const configurationName = this.elements.placeholder(uiConstants.placeholders.configurationName);
      await configurationName.fill(uiConstants.dynamicText.configurationName(type));
      const saveButton = this.elements.button(uiConstants.buttons.save);
      await this.verifyElementState(saveButton, true);
      await this.click(saveButton);
      await this.verifyElementVisibility(true, this.elements.alert(uiConstants.alerts.configurationCreated));
      logger.info(`✅ Configuration name set and saved for ${type}`);
    } catch (error) {
      logger.error(`Error Creating configuration and adding name for ${type}:`, error.message);
      throw error;
    }
  }

  /**
   * Set up each type of configuration (PV, Wind Offshore, Wind Onshore, Hybrid).
   * @param {string} type - Project type.
   */
  async setupTypeOfConfiguration(type) {
    try {
      const normalizedType = type.toLowerCase();
      if (uiConstants.projectTypeGroups.hasWind(normalizedType)) {
        await this.goToWindTab();
        await this.windPage.configureWind();
      }
      if (uiConstants.projectTypeGroups.hasPv(normalizedType)) {
        await this.goToPVTab();
        await this.pvPage.configurePV();
      }
      logger.info(`✅ Selected ${normalizedType} configuration`);
    } catch (error) {
      logger.error('Error configuring technology settings:', error.message);
      throw error;
    }
  }

  /**
   * Click on calculate configuration and wait until results are returned.
   */
  async calculateConfiguration() {
    try {
      const calculateButton = this.elements.button(uiConstants.buttons.calculate);
      await this.click(calculateButton);
      await this.verifyElementVisibility(true, this.elements.alert(uiConstants.alerts.computationStarted));
      const resultsButton = this.elements.button(uiConstants.buttons.results);
      await this.waitForClickable(resultsButton, timeouts.extraLong);
    } catch (error) {
      logger.error('Error in calculating Configuration:', error.message);
      throw error;
    }
  }
  /**
   * Navigate to PV tab.
   */
  async goToPVTab() {
    const pvTab = this.elements.tab(uiConstants.tabs.pvConfiguration);
    await this.click(pvTab);
    const pvTabHeading = this.elements.heading(uiConstants.headings.pvConfiguration);
    await this.verifyElementVisibility(true, pvTabHeading, timeouts.default);
    logger.info('✅ PV tab displayed');
  }

  /**
   * Navigate to Wind tab.
   */
  async goToWindTab() {
    const windTab = this.elements.tab(uiConstants.tabs.windConfiguration);
    await this.click(windTab);
    const windTabHeading = this.elements.heading(uiConstants.headings.windConfiguration);
    await this.verifyElementVisibility(true, windTabHeading, timeouts.default);
    logger.info('✅ Wind tab displayed');
  }

  /**
   * Navigate to Results page
   */
  async goToResults() {
    try {
      const resultsButton = this.elements.button(uiConstants.buttons.results);
      await this.waitForClickable(resultsButton, timeouts.long);
      await this.click(resultsButton);
      logger.info('✅ Navigated to Results page');
    } catch (error) {
      logger.error('Error navigating to Results:', error.message);
      throw error;
    }
  }
}

export { ConfigurationCommonPage };
