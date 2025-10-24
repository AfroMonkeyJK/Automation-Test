import { BasePage } from '../../util/base-page.js';
import { Selectors } from '../../util/selectors.js';
import { PageElementsHelper } from '../../util/page-elements-helper.js';
import { timeouts } from '../../util/timeout.js';
import uiConstants from '../../util/ui-constants.js';
import logger from '../../util/logger.js';

class ConfigurationOfftakePage extends BasePage {
  selectors;
  elements;

  constructor(page) {
    super(page);
    this.selectors = Selectors(page);
    this.elements = new PageElementsHelper(this.selectors, page);
  }

  /**
   * Navigate to Offtake tab.
   */
  async goToOfftakeTab() {
    await this.click(this.elements.tab(uiConstants.tabs.offtake));
    const offtakeHeading = this.elements.heading(uiConstants.headings.offtake);
    await this.verifyElementVisibility(true, offtakeHeading, timeouts.default);
    logger.info('✅ Offtake tab displayed');
  }

  /**
   * Selects an Offtake option from the PV offtake dropdown.
   */
  async configurePVOfftake() {
    try {
      const offtakeDropdown = this.selectors.Dropdown.pvOfftake();
      await this.verifyElementVisibility(true, offtakeDropdown, timeouts.default);
      await this.selectDropdownOptionByIndex(offtakeDropdown, 1, 'PV');
      logger.info('✅ Selected Offtake contract for PV');
    } catch (error) {
      logger.error('Error Configuring PV Offtake dropdown:', error.message);
    }
  }

  /**
   * Selects an Offtake option from the Wind offtake dropdown.
   */
  async configureWindOfftake() {
    try {
      const offtakeDropdown = this.selectors.Dropdown.windOfftake();
      await this.verifyElementVisibility(true, offtakeDropdown, timeouts.default);
      await this.selectDropdownOptionByIndex(offtakeDropdown, 1, 'Wind');
      logger.info('✅ Selected Offtake contract for Wind');
    } catch (error) {
      logger.error('Error Configuring Wind Offtake dropdown:', error.message);
    }
  }

  /**
   * Configure offtake settings based on project type.
   * @param {string} type - Project type.
   */
  async configureOfftakeForType(type) {
    try {
      const normalizedType = type.toLowerCase();
      if (uiConstants.projectTypeGroups.hasWind(normalizedType)) {
        await this.configureWindOfftake();
      }
      if (uiConstants.projectTypeGroups.hasPv(normalizedType)) {
        await this.configurePVOfftake();
      }
      logger.info(`✅ Offtake configuration completed for ${type}`);
    } catch (error) {
      logger.error('Error configuring offtake settings:', error.message);
    }
  }

  /**
   * Save the Offtake tab configuration.
   */
  async saveOfftakeTab() {
    const saveButton = this.elements.button(uiConstants.buttons.save);
    try {
      const isSaveVisible = await saveButton.isVisible();
      const isSaveEnabled = await saveButton.isEnabled();
      logger.info(`Save button state - Visible: ${isSaveVisible}, Enabled: ${isSaveEnabled}`);
      if (isSaveVisible && isSaveEnabled) {
        logger.info('💾 Save button is active - saving Offtake configuration first...');
        await this.click(saveButton);
        const confirmationOfftake = this.elements.alert(uiConstants.alerts.offtakeUpdated);
        await this.verifyElementVisibility(true, confirmationOfftake, timeouts.default);
        logger.info('✅ Offtake configuration saved successfully');
      } else {
        logger.info('⏭️ Save button not active - can proceed directly to calculation');
      }
    } catch (saveError) {
      logger.warn('Could not check/click Save button, proceeding to calculation:', saveError.message);
    }
  }
}

export { ConfigurationOfftakePage };
