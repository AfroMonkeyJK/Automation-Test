import { BasePage } from '../../util/base-page.js';
import { Selectors } from '../../util/selectors.js';
import { PageElementsHelper } from '../../util/page-elements-helper.js';
import { timeouts } from '../../util/timeout.js';
import uiConstants from '../../util/ui-constants.js';
import logger from '../../util/logger.js';

class ParameterStudyGridPage extends BasePage {
  selectors;
  elements;

  constructor(page) {
    super(page);
    this.selectors = Selectors(page);
    this.elements = new PageElementsHelper(this.selectors, page);
  }

  /**
   * Configure Grid Connection by adding Custom Costs.
   */
  async configureGridbyCustomCosts(customCosts) {
    try {
      const gridHeading = this.elements.heading(uiConstants.headings.gridConnectionSubheader);
      await this.verifyElementVisibility(true, gridHeading, timeouts.default);
      const gridCosts = this.elements.button(uiConstants.buttons.costs);
      await this.click(gridCosts);
      const gridCostsDialog = this.elements.dialog(uiConstants.dialogs.costsGridConnection);
      const valueInput = this.elements.placeholder(uiConstants.placeholders.costValue);
      await this.verifyElementVisibility(true, gridCostsDialog, timeouts.short);
      await this.verifyElementVisibility(true, valueInput, timeouts.short);
      await valueInput.fill(customCosts || '95000');
      const saveButton = this.elements.button(uiConstants.buttons.save);
      await this.waitForClickable(saveButton, timeouts.short);
      await this.click(saveButton);
      await this.waitForElementDetached(gridCostsDialog, timeouts.default);
      await this.waitForClickable(saveButton, timeouts.short);
      await this.click(saveButton);
      await this.verifyElementVisibility(true, this.elements.alert(uiConstants.alerts.updatedPS));
      logger.info('✅ Grid configuration completed');
    } catch (error) {
      logger.error('Error in configureGridbyCosts:', error.message);
      throw error;
    }
  }
}

export { ParameterStudyGridPage };
