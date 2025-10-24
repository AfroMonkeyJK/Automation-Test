import { expect } from '@playwright/test';
import logger from '../util/logger.js';
import { LocatorUtil } from '../util/locator.js';
import { Selectors } from '../util/selectors.js';
import { timeouts } from '../util/timeout.js';
import { technicalConstants } from '../util/technical-constants.js';
import uiConstants from './ui-constants.js';

class BasePage extends LocatorUtil {
  constructor(page) {
    super(page);
    this.selectors = Selectors(page);
  }

  /**
   * Remove the value from an input element.
   * @param {import('@playwright/test').Locator} locator Selector for the input element.
   */
  async clear(locator) {
    await this.verifyElementVisibility(true, locator);
    await this.page.keyboard.press(technicalConstants.keyboard.ctrlA);
    await this.page.keyboard.press(technicalConstants.keyboard.backspace);
    logger.info(`Value is removed from the input element: ${locator.toString()}`);
  }

  /**
   * Click on an element.
   * @param {import('@playwright/test').Locator} locator Selector for the element to click.
   */
  async click(locator) {
    await this.waitForClickable(locator);
    await locator.click();
    logger.info(`Element ${locator.toString()} clicked.`);
  }

  /**
   * Input text into an element.
   * @param {import('@playwright/test').Locator} locator Selector for the element.
   * @param {string} text Text to input into the element.
   */
  async inputText(locator, text) {
    await this.verifyElementVisibility(true, locator);
    await locator.fill(text);
    logger.info(`Text: "${text}" entered into input element: ${locator.toString()}`);
  }

  /**
   * Checks if a field is sensitive based on its attributes.
   * @param {import('@playwright/test').Locator} locator
   * @returns {Promise<boolean>}
   */
  async isSensitiveField(locator) {
    try {
      const type = await locator.getAttribute(uiConstants.attributes.type).catch(() => '');
      if (type === uiConstants.attributes.password) return true;

      const attrs = await Promise.all([
        locator.getAttribute(uiConstants.attributes.name).catch(() => ''),
        locator.getAttribute(uiConstants.attributes.id).catch(() => ''),
        locator.getAttribute(uiConstants.attributes.placeholder).catch(() => ''),
        locator.getAttribute(uiConstants.attributes.ariaLabel).catch(() => '')
      ]);

      const combined = attrs.join(' ').toLowerCase();
      return technicalConstants.sensitivePatterns.some(pattern => combined.includes(pattern));
    } catch {
      return true;
    }
  }

  /**
   * Fill an input field with automatic sensitive data detection.
   * @param {import('@playwright/test').Locator} locator Selector for the input field.
   * @param {string} text Text to enter into the input field.
   * @param {Object} options Options object.
   * @param {number} options.timeout Timeout in milliseconds (default: timeouts.medium).
   * @param {boolean} options.sensitive Force treat as sensitive data.
   */
  async fillSensitiveInput(locator, text, options = {}) {
    const { timeout = timeouts.medium, sensitive = false } = options;
    await locator.fill(text, { timeout });
    const isSensitive = sensitive || (await this.isSensitiveField(locator));
    const displayValue = isSensitive ? '[MASKED]' : text;
    logger.info(`Text: "${displayValue}" entered into input element: ${locator.toString()}`);
  }

  /**
   * Select an option from a dropdown.
   * @param {import('@playwright/test').Locator} dropdownLocator Selector for the dropdown element.
   * @param {string} optionToSelect option to select from the dropdown.
   */
  async selectDropdownOption(dropdownLocator, optionToSelect) {
    await this.waitForClickable(dropdownLocator);
    await dropdownLocator.click();
    logger.info(`Dropdown opened: ${dropdownLocator}`);
    const option = this.selectors.Dropdown.options().filter({ hasText: optionToSelect });
    await option.waitFor({ state: 'visible', timeout: timeouts.default });
    await option.click();
    logger.info(`Option selected: ${optionToSelect}`);
  }

  /**
   * Select dropdown option by index position.
   * @param {import('@playwright/test').Locator} dropdownLocator Selector for the dropdown element.
   * @param {number} index Index of option to select (Example: 1, 2, 3, etc.).
   * @param {string} context Optional context for logging (default: 'dropdown').
   */
  async selectDropdownOptionByIndex(dropdownLocator, index, context = 'dropdown') {
    await this.waitForClickable(dropdownLocator);
    await dropdownLocator.click();
    const options = this.selectors.Dropdown.options();
    await options.first().waitFor({ state: 'visible', timeout: timeouts.default });
    const targetOption = options.nth(index - 1);
    await targetOption.waitFor({ state: 'visible', timeout: timeouts.default });
    const optionText = await targetOption.textContent();
    await targetOption.click();
    logger.info(`Option selected by index ${index}: "${optionText?.trim()}" from ${context}`);
  }

  /**
   * Select multiple dropdown options by index (for dropdowns that stay open).
   * @param {import('@playwright/test').Locator} dropdownLocator Selector for the dropdown element.
   * @param {number} count Number of options to select from index 1 to count.
   * @param {string} context Optional context for logging (default: 'dropdown').
   */
  async selectMultipleDropdownOptionsByIndex(dropdownLocator, count, context = 'dropdown') {
    await this.waitForClickable(dropdownLocator);
    await dropdownLocator.click();
    const options = this.selectors.Dropdown.options();
    await this.verifyElementVisibility(true, options.first(), timeouts.default);
    // await options.first().waitFor({ state: 'visible', timeout: timeouts.default });
    const selectedOptions = [];
    for (let i = 0; i < count; i++) {
      const targetOption = options.nth(i);
      await this.verifyElementVisibility(true, targetOption, timeouts.default);
      const optionText = await targetOption.textContent();
      await targetOption.click();
      selectedOptions.push(optionText?.trim());
    }
    logger.info(`📋 Total selected from ${context}: ${selectedOptions.join(', ')}`);
    // Close dropdown by clicking outside or pressing Escape
    await this.page.keyboard.press(technicalConstants.keyboard.escape);
  }

  /**
   * Set the state of a checkbox.
   * @param {import('@playwright/test').Locator} locator Selector for the checkbox element.
   * @param {boolean} isChecked To be checked or unchecked.
   */
  async setCheckboxState(locator, isChecked = true) {
    await this.waitForClickable(locator);

    if (isChecked) {
      await locator.check();
      logger.info(`Element ${locator.toString()} checked.`);
    } else {
      await locator.uncheck();
      logger.info(`Element ${locator.toString()} unchecked.`);
    }
  }

  /**
   * Verify that the actual value is equal to the expected value.
   * @param {string} actual The actual value to verify.
   * @param {string} expected The expected value to compare against.
   */
  async verifyEqual(actual, expected) {
    expect(actual).toEqual(expected);
    logger.info(`Verified that actual value "${actual}" matches expected value "${expected}".`);
  }

  /**
   * Verify the state of a checkbox.
   * @param {import('@playwright/test').Locator} locator
   * @param {boolean} isChecked To be checked or unchecked.
   */
  async verifyCheckbox(locator, isChecked) {
    await expect(locator).toBeChecked(isChecked);
    logger.info(`Verified checkbox ${locator.toString()} is ${isChecked ? 'checked' : 'unchecked'}.`);
  }

  /**
   * Verify that the dropdown contains the expected values.
   * This method opens the dropdown, retrieves the options, and compares them with the expected values.
   * @param {import('@playwright/test').Locator} dropdownLocator Selector for the dropdown element.
   * @param {import('@playwright/test').Locator} optionLocator Selector for the dropdown options.
   * @param {string[]} expectedValues Array of expected options to verify in the dropdown.
   * @param {Object} options Additional verification options.
   * @param {boolean} options.exactOrder Whether the order of options must match exactly (default: true).
   * @param {boolean} options.caseSensitive Whether comparison is case-sensitive (default: false).
   * @param {boolean} options.subset Whether to check if expected values are a subset of actual values (default: false).
   * @param {number} options.timeout Timeout for waiting for dropdown options.
   */
  async verifyDropdownValues(dropdownLocator, optionLocator, expectedValues, options = {}) {
    const { exactOrder = true, caseSensitive = false, subset = false, timeout = timeouts.default } = options;
    try {
      await this.waitForClickable(dropdownLocator);
      await dropdownLocator.click();
      logger.info('Dropdown opened successfully');
      const optionCount = await optionLocator.count();
      if (optionCount === 0) {
        throw new Error('No dropdown options found after opening dropdown');
      }
      await optionLocator.first().waitFor({ state: 'visible', timeout });
      logger.debug(`Found ${optionCount} dropdown options`);
      const optionTexts = await optionLocator.allTextContents();
      const actualValues = optionTexts.map(text => text?.trim()).filter(text => text && text.length > 0);
      logger.info(`Dropdown values found: [${actualValues.join(', ')}]`);
      logger.info(`Expected values: [${expectedValues.join(', ')}]`);
      const normalizedActual = caseSensitive ? actualValues : actualValues.map(val => val.toLowerCase());
      const normalizedExpected = caseSensitive ? expectedValues : expectedValues.map(val => val.toLowerCase());
      if (subset) {
        this.verifySubset(normalizedExpected, normalizedActual, caseSensitive);
      } else if (exactOrder) {
        this.verifyExactMatch(normalizedExpected, normalizedActual, caseSensitive);
      } else {
        this.verifyContainsAll(normalizedExpected, normalizedActual, caseSensitive);
      }
      logger.info(
        `✅ Dropdown values verification passed (${subset ? 'subset' : exactOrder ? 'exact order' : 'contains all'})`
      );
    } catch (error) {
      logger.error(`❌ Dropdown verification failed: ${error.message}`);
      throw error;
    } finally {
      try {
        if (await dropdownLocator.isVisible()) {
          await this.page.keyboard.press(technicalConstants.keyboard.escape);
          logger.debug('Dropdown closed');
        }
      } catch {
        logger.debug('Could not close dropdown - it may have closed automatically');
      }
    }
  }

  /**
   * Helper method to verify exact match of dropdown values in order.
   */
  verifyExactMatch(expected, actual, caseSensitive) {
    if (actual.length !== expected.length) {
      throw new Error(
        `Dropdown values count mismatch: Found ${actual.length} options, Expected ${expected.length} options`
      );
    }

    for (let i = 0; i < expected.length; i++) {
      if (actual[i] !== expected[i]) {
        throw new Error(
          `Option mismatch at position ${i + 1}: Found "${actual[i]}", Expected "${expected[i]}"${caseSensitive ? '' : ' (case-insensitive)'}`
        );
      }
    }
  }

  /**
   * Helper method to verify dropdown contains all expected values.
   */
  verifyContainsAll(expected, actual, caseSensitive) {
    const missingValues = expected.filter(expectedVal => !actual.includes(expectedVal));

    if (missingValues.length > 0) {
      throw new Error(
        `Missing expected dropdown values: [${missingValues.join(', ')}]${caseSensitive ? '' : ' (case-insensitive)'}`
      );
    }
  }

  /**
   * Helper method to verify expected values are a subset of actual values.
   */
  verifySubset(expected, actual, caseSensitive) {
    const missingValues = expected.filter(expectedVal => !actual.includes(expectedVal));

    if (missingValues.length > 0) {
      throw new Error(
        `Expected values not found in dropdown: [${missingValues.join(', ')}]. Available options: [${actual.join(', ')}]${caseSensitive ? '' : ' (case-insensitive)'}`
      );
    }
  }

  /**
   * Verify the value of an input field.
   * @param {import('@playwright/test').Locator} inputFieldLocator Selector for the input field.
   * @param {string} expectedValue The expected value of the input field.
   * @param {number} timeout Expected timeout, default 10000ms.
   */
  async verifyInputValue(inputFieldLocator, expectedValue, timeout = timeouts.medium) {
    await expect(inputFieldLocator).toHaveValue(expectedValue, { timeout });
    logger.info(`Verified input value of ${inputFieldLocator}: "${expectedValue}"`);
  }

  /**
   * This method checks if the element is visible and then verifies its text content.
   * @param {import('@playwright/test').Locator} element Selector for the element to verify.
   * @param {string} expectedText The expected text to verify against the element's text.
   * @param {boolean} exactMatch True for exact match, false for partial match.
   */
  async verifyElementText(element, expectedText, exactMatch = true) {
    await expect(element).toBeVisible();

    if (exactMatch) {
      await expect(element).toHaveText(expectedText);
    } else {
      await expect(element).toContainText(expectedText);
    }
  }

  /**
   * This method checks if the element is visible or not based on the `isVisible` parameter.
   * @param {boolean} isVisible if is visible or not.
   * @param {import('@playwright/test').Locator} locator Selector for the element to verify visibility.
   * @param {number} timeout Expected timeout, default 60000ms.
   */
  async verifyElementVisibility(isVisible, locator, timeout = timeouts.long) {
    if (isVisible) {
      await expect(locator).toBeVisible({ timeout });
      logger.info(`Verified visibility of element: ${locator.toString()}.`);
    } else {
      await expect(locator).not.toBeVisible({ timeout });
      logger.info(`Verified that element is not visible: ${locator.toString()}.`);
    }
  }

  /**
   * Verify the state of an element (enabled/disabled).
   * @param {import('@playwright/test').Locator} locator Selector for the element to verify.
   * @param {boolean} isEnabled true or false.
   *
   */
  async verifyElementState(locator, isEnabled) {
    const toBeEnabled = await locator.isEnabled();
    expect(toBeEnabled).toBe(isEnabled);
    logger.info(`Verified element ${locator.toString()} is ${isEnabled ? 'enabled' : 'disabled'}.`);
  }

  /**
   * Wait for an element to be clickable.
   * This method checks if the element is visible and not disabled.
   * @param {import('@playwright/test').Locator} locator Selector for the element to wait for.
   * @param {number} timeout Expected timeout, default 60000ms.
   */
  async waitForClickable(locator, timeout = timeouts.long) {
    try {
      const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
      await element.waitFor({ state: 'visible', timeout });
      const startTime = Date.now();
      while (Date.now() - startTime < timeout) {
        try {
          const isEnabled = await element.isEnabled({ timeout: timeouts.default });
          const isVisible = await element.isVisible();
          if (isEnabled && isVisible) {
            logger.debug(`Element is clickable: ${locator.toString()}`);
            return 'SUCCESS';
          }
        } catch (checkError) {
          logger.debug(`Element clickability check failed: ${checkError.message}`);
        }
      }
      const isVisible = await element.isVisible().catch(() => false);
      const isEnabled = await element.isEnabled().catch(() => false);
      throw new Error(
        `Element is not clickable within ${timeout}ms. ` +
          `Visible: ${isVisible}, Enabled: ${isEnabled}. ` +
          `Locator: ${locator.toString()}`
      );
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new Error(`Element not found or not visible within ${timeout}ms. ` + `Locator: ${locator.toString()}`);
      }
      logger.error(`Error waiting for element to be clickable: ${error.message}`);
      throw error;
    }
  }

  /**
   *
   * @param {import('@playwright/test').Locator} locator Selector for the element to wait for.
   * @param {number} timeout Expected timeout, default 10000ms.
   */
  async waitForElementToDisappear(locator, timeout = timeouts.medium) {
    await expect(locator).toBeHidden({ timeout });
    logger.debug(`Element matching locator '${locator.toString()}' has disappeared.`);
  }

  /**
   * Wait for an element to be detached from the DOM.
   * @param {Locator} element - Playwright locator to wait for.
   * @param {number} timeout - Expected timeout, default 5000ms.
   */
  async waitForElementDetached(element, timeout = timeouts.default) {
    try {
      if (!element || typeof element.waitFor !== 'function') {
        logger.warn('Invalid element provided - considering it as detached');
        return;
      }

      logger.debug('Waiting for element to be detached from DOM...');
      await element.waitFor({
        state: 'detached',
        timeout: timeout
      });
      logger.debug('✅ Element successfully detached');
    } catch (error) {
      if (error.name === 'TimeoutError') {
        logger.warn(`Element did not detach within ${timeout}ms - proceeding anyway`);
      } else {
        logger.error('Error waiting for element to detach:', error.message);
        throw error;
      }
    }
  }

  /**
   * Wait for an element to be hidden (but not necessarily removed from DOM).
   * @param {Locator} element - Playwright locator to wait for.
   * @param {number} timeout - Expected timeout, default 5000ms.
   */
  async waitForElementHidden(element, timeout = timeouts.default) {
    try {
      if (!element || typeof element.waitFor !== 'function') {
        logger.warn('Invalid element provided - considering it as hidden');
        return;
      }

      logger.debug('Waiting for element to be hidden...');
      await element.waitFor({
        state: 'hidden',
        timeout: timeout
      });
      logger.debug('✅ Element successfully hidden');
    } catch (error) {
      if (error.name === 'TimeoutError') {
        logger.warn(`Element did not hide within ${timeout}ms - proceeding anyway`);
      } else {
        logger.error('Error waiting for element to hide:', error.message);
        throw error;
      }
    }
  }
}

export { BasePage };
