import { BasePage } from '../../util/base-page.js';
import { Selectors } from '../../util/selectors.js';
import { PageElementsHelper } from '../../util/page-elements-helper.js';
import { timeouts } from '../../util/timeout.js';
import uiConstants from '../../util/ui-constants.js';
import logger from '../../util/logger.js';

class ParameterStudyWindPage extends BasePage {
  selectors;
  elements;

  constructor(page) {
    super(page);
    this.selectors = Selectors(page);
    this.elements = new PageElementsHelper(this.selectors, page);
  }

  /**
   * Add Wind Turbine Generators (WTGs) to the layout.
   * @param {string} wtgNumToPlace Number of WTGs to add (default is 2).
   */
  async addWtgsLayout(wtgNumToPlace) {
    try {
      const addWtg = this.elements.button(uiConstants.buttons.addWtg);
      const numberOfWtgs = parseInt(wtgNumToPlace, 10) || 1;
      for (let i = 0; i < numberOfWtgs; i++) {
        await this.click(addWtg);
      }
      const saveButton = this.elements.button(uiConstants.buttons.save);
      await this.waitForClickable(saveButton, timeouts.default);
      await this.click(saveButton);
      logger.info(`✅ Added ${numberOfWtgs} WTG(s) to layout`);
    } catch (error) {
      logger.error('Error in adding wind layout:', error.message);
      throw error;
    }
  }

  /**
   * Configure Wind settings adding only 1 WTG to the Layout.
   * @param {string} wtgNum - Number of different WTG types to select from dropdown (e.g., 3 means select options 1, 2, and 3).
   */
  async configurePSWindWithBasicLayout(wtgNum) {
    try {
      const wtgDropdown = this.selectors.Dropdown.selectWtgsPS();
      const addLayout = this.elements.button(uiConstants.buttons.addLayout);
      await this.verifyElementVisibility(true, addLayout, timeouts.short);
      const numberOfWtgTypes = parseInt(wtgNum, 10) || 3;
      logger.info(`Selecting ${numberOfWtgTypes} different WTG type(s) from dropdown`);
      await this.selectMultipleDropdownOptionsByIndex(wtgDropdown, numberOfWtgTypes, 'WTG dropdown');
      await this.click(addLayout);
      await this.addWtgsLayout(1);
      const saveButton = this.elements.button(uiConstants.buttons.save);
      await this.waitForClickable(saveButton, timeouts.default);
      await this.click(saveButton);
      await this.verifyElementVisibility(
        true,
        this.elements.alert(uiConstants.alerts.windPSUpdated),
        timeouts.short
      );
      logger.info(`✅ Wind configuration completed with ${numberOfWtgTypes} WTG type(s)`);
    } catch (error) {
      logger.error('Error in configuring wind section:', error.message);
      throw error;
    }
  }
}

export { ParameterStudyWindPage };
