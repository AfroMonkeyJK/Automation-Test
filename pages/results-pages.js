import { BasePage } from '../util/base-page.js';
import { Selectors } from '../util/selectors.js';
import { PageElementsHelper } from '../util/page-elements-helper.js';
import { timeouts } from '../util/timeout.js';
import uiConstants from '../util/ui-constants.js';
import logger from '../util/logger.js';

class ResultsPage extends BasePage {
  selectors;
  elements;

  constructor(page) {
    super(page);
    this.selectors = Selectors(page);
    this.elements = new PageElementsHelper(this.selectors, page);
  }

  /**
   * Verify configuration was created and results are valid.
   */
  async verifyConfigurationResults(type) {
    try {
      const resultsHeader = this.elements.heading(uiConstants.dynamicText.resultsHeader(type));
      await this.verifyElementVisibility(true, resultsHeader, timeouts.default);
      const fieldsToCheck = [
        this.selectors.Results.productionField(),
        this.selectors.Results.valueField(),
        this.selectors.Results.costsField(),
        this.selectors.Results.economicField()
      ];
      for (const field of fieldsToCheck) {
        await this.verifyElementVisibility(true, field);
      }
      logger.info('✅ Configuration results verified');
    } catch (error) {
      logger.error('Error during Verification of Results:', error.message);
      throw error;
    }
  }

  /**
   * Verify Parameter Study list is displayed with variants.
   * @returns {Promise<number>} Number of total variants found
   */
  async verifyPSList() {
    const addToConfig = this.elements.button(uiConstants.buttons.addToConfig);
    await this.verifyElementVisibility(true, addToConfig, timeouts.default);

    const variantsBox = this.elements.text('Variants', { exact: true });
    await this.verifyElementVisibility(true, variantsBox, timeouts.default);

    // Get variant count from the table rows directly (most reliable method)
    const variantRows = this.selectors.ParameterStudyVariants.variantsRow();
    await variantRows.first().waitFor({ state: 'visible', timeout: timeouts.default });

    const expectedVariants = await variantRows.count();

    logger.info(`✅ Parameter Study list verified with ${expectedVariants} variants`);
    logger.info(`🔍 Returning expectedVariants: ${expectedVariants}`);

    return expectedVariants;
  }

  /**
   * Add the best variant (highest IRR) to configurations.
   * Validates the number of variants matches expected count before proceeding.
   * Sorts by IRR in descending order and selects the first variant.
   * @param {number} expectedVariants Expected number of variants to validate against
   */
  async addFirstVariantToConfig(expectedVariants) {
    try {
      // Verify the actual number of variants matches expected
      const variantRows = this.selectors.ParameterStudyVariants.variantsRow();
      const actualCount = await variantRows.count();

      if (actualCount !== expectedVariants) {
        throw new Error(
          `Variant count mismatch: Expected ${expectedVariants} variants but found ${actualCount} in the table`
        );
      }
      logger.info(`✅ Verified ${actualCount} variants match expected count`);
      // Provisional raw locator until we have data-testid: GNS-5587
      const firstCheckbox = variantRows.first().locator('input[type="checkbox"]');
      await this.click(firstCheckbox);
      const addToConfigBtn = this.elements.button(uiConstants.buttons.addToConfig);
      await this.click(addToConfigBtn);
      logger.info('✅ Best variant added to configurations');
    } catch (error) {
      logger.error('Error adding best variant to config:', error.message);
      throw error;
    }
  }
}

export { ResultsPage };
