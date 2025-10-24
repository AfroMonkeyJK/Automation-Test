import { BasePage } from '../../util/base-page.js';
import { Selectors } from '../../util/selectors.js';
import { PageElementsHelper } from '../../util/page-elements-helper.js';
import { timeouts } from '../../util/timeout.js';
import uiConstants from '../../util/ui-constants.js';
import logger from '../../util/logger.js';

/**
 * BaseWorkflowPage
 * Common functionality that is IDENTICAL between Configuration and Parameter Study.
 *
 */
class BaseWorkflowPage extends BasePage {
  selectors;
  elements;

  constructor(page) {
    super(page);
    this.selectors = Selectors(page);
    this.elements = new PageElementsHelper(this.selectors, page);
  }

  /**
   * Verify user is in Configurations main page.
   */
  async configurationsMainPage() {
    await this.verifyElementVisibility(true, this.elements.heading(uiConstants.headings.configurationMainPageHeader));
    await this.verifyElementVisibility(true, this.elements.tab(uiConstants.tabs.configurations));
    await this.verifyElementVisibility(true, this.elements.tab(uiConstants.tabs.parameterStudy));
  }

  /**
   * Wait for calculation to complete
   */
  async waitForCalculationComplete() {
    try {
      const resultsButton = this.elements.button(uiConstants.buttons.results);
      await this.waitForClickable(resultsButton, timeouts.extraLong);
      logger.info('✅ Calculation completed - Results available');
    } catch (error) {
      logger.error('Error waiting for calculation:', error.message);
      throw error;
    }
  }

  /**
   * Navigate to Configurations main page
   */
  async goToConfigurationsMainPage() {
    try {
      const configurationsButton = this.elements.button(uiConstants.buttons.configurationMainPage);
      await this.verifyElementVisibility(true, configurationsButton, timeouts.short);
      await this.click(configurationsButton);
      await this.verifyElementVisibility(true, this.elements.heading(uiConstants.headings.configurationMainPageHeader));
      logger.info('✅ Navigated to Configurations main page');
    } catch (error) {
      logger.error('Error navigating to Configurations main page:', error.message);
      throw error;
    }
  }

  /**
   * Navigate to Grid Connections tab.
   */
  async goToGridConnectionsTab() {
    const gridTab = this.elements.tab(uiConstants.tabs.gridConnection);
    await this.click(gridTab);
    logger.info('✅ Grid tab displayed');
  }

  /**
   * Handle the "Discard Changes" popup that appears when navigating away with unsaved changes.
   * @param {boolean} shouldDiscard - If true, clicks "Discard", if false clicks "Cancel" (default: false)
   * @returns {Promise<boolean>} - Returns true if popup appeared, false if it didn't
   */
  async handleDiscardChangesPopup(shouldDiscard = false) {
    try {
      const discardChangesDialog = this.elements.dialog(uiConstants.dialogs.discardChanges);
      const isPopupVisible = await discardChangesDialog.isVisible({ timeout: timeouts.short }).catch(() => false);
      if (!isPopupVisible) {
        return false;
      }
      if (shouldDiscard) {
        const discardButton = this.elements.button(uiConstants.buttons.discard);
        await this.click(discardButton);
        logger.info('✅ Clicked "Discard" button');
      } else {
        const cancelButton = this.elements.button(uiConstants.buttons.cancel);
        await this.click(cancelButton);
        await this.waitForElementToDisappear(discardChangesDialog, timeouts.short);
        logger.info('✅ Clicked "Cancel" - popup dismissed');
      }
      return true;
    } catch (error) {
      logger.warn(`⚠️ Error handling discard changes popup: ${error.message}`);
      return false;
    }
  }

  /**
   * Save with retry - handles "Discard Changes" popup if it appears.
   * @param {import('@playwright/test').Locator} saveButton - The save button locator
   * @param {import('@playwright/test').Locator} successAlert - The success alert to verify after save
   */
  async saveWithRetry(saveButton, successAlert) {
    let popupCount = 0;
    const maxAttempts = 3;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        logger.debug(`Save attempt ${attempt}/${maxAttempts}`);
        await this.waitForClickable(saveButton, timeouts.default);
        await this.click(saveButton);
        const popupAppeared = await this.handleDiscardChangesPopup(false);
        if (popupAppeared) {
          popupCount++;
          logger.warn(`⚠️ WORKAROUND(GNS-5599): Popup appeared (count: ${popupCount}) - retrying save...`);
          // small delay before retrying, avoid issues with rapid clicks.
          await new Promise(resolve => setTimeout(resolve, 500));
          continue;
        }
        await this.verifyElementVisibility(true, successAlert, timeouts.default);
        if (popupCount > 0) {
          logger.info(`✅ Save successful after ${attempt} attempt(s) (${popupCount} popup(s) handled)`);
        } else {
          logger.info('✅ Save successful');
        }
        return;
      } catch (error) {
        if (attempt === maxAttempts) {
          logger.error(`❌ Save failed after ${maxAttempts} attempts (${popupCount} popup(s) appeared)`);
          throw error;
        }
        logger.warn(`⚠️ Attempt ${attempt} failed: ${error.message}`);
      }
    }
  }
}

export { BaseWorkflowPage };
