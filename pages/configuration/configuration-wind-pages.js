import { BasePage } from '../../util/base-page.js';
import { Selectors } from '../../util/selectors.js';
import { PageElementsHelper } from '../../util/page-elements-helper.js';
import { timeouts } from '../../util/timeout.js';
import uiConstants from '../../util/ui-constants.js';
import logger from '../../util/logger.js';

class ConfigurationWindPage extends BasePage {
  selectors;
  elements;

  constructor(page) {
    super(page);
    this.selectors = Selectors(page);
    this.elements = new PageElementsHelper(this.selectors, page);
  }

  /**
   * Configure basic Wind settings.
   * @param {string} wtgNum - Number of Wind Turbine Generators (WTGs) by default (20).
   */
  async configureWind(wtgNum) {
    try {
      const windTabHeading = this.elements.heading(uiConstants.headings.windConfiguration);
      await this.verifyElementVisibility(true, windTabHeading, timeouts.default);
      const wtgDropdown = this.elements.placeholder(uiConstants.placeholders.selectWtg);
      await this.selectDropdownOptionByIndex(wtgDropdown, 1, 'WTG dropdown');
      const numberWTG = this.elements.placeholder(uiConstants.placeholders.enterWtgQuantity);
      await numberWTG.fill(wtgNum || '20');
      const saveButton = this.elements.button(uiConstants.buttons.save);
      await this.waitForClickable(saveButton, timeouts.default);
      await this.click(saveButton);
      await this.verifyElementVisibility(
        true,
        this.elements.alert(uiConstants.alerts.windConfigurationUpdated),
        timeouts.medium
      );
      logger.info('✅ Wind configuration completed');
    } catch (error) {
      logger.error('Error in configuring wind section:', error.message);
      throw error;
    }
  }
}

export { ConfigurationWindPage };
