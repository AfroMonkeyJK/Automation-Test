import { BasePage } from '../../util/base-page.js';
import { Selectors } from '../../util/selectors.js';
import { PageElementsHelper } from '../../util/page-elements-helper.js';
import { timeouts } from '../../util/timeout.js';
import uiConstants from '../../util/ui-constants.js';
import logger from '../../util/logger.js';

class ConfigurationPVPage extends BasePage {
  selectors;
  elements;

  constructor(page) {
    super(page);
    this.selectors = Selectors(page);
    this.elements = new PageElementsHelper(this.selectors, page);
  }

  /**
   * Configure basic PV settings after waiting for SolarGIS popup.
   * @param {string} areaSize - Optional site area size (default is '300').
   */
  async configurePV(areaSize) {
    try {
      const pvTabHeading = this.elements.heading(uiConstants.headings.pvConfiguration);
      await this.verifyElementVisibility(true, pvTabHeading, timeouts.default);
      const siteAreaInput = this.selectors.ProjectConfig.siteArea();
      await siteAreaInput.fill(areaSize || '300');
      await this.verifyElementState(siteAreaInput, true);
      const saveButton = this.elements.button(uiConstants.buttons.save);
      await this.waitForClickable(saveButton, timeouts.long);
      await this.click(saveButton);
      await this.verifyElementVisibility(
        true,
        this.elements.alert(uiConstants.alerts.pvConfigurationUpdated),
        timeouts.medium
      );
      logger.info('✅ PV configuration completed');
    } catch (error) {
      logger.error('Error in configuring PV section:', error.message);
      throw error;
    }
  }
}

export { ConfigurationPVPage };
