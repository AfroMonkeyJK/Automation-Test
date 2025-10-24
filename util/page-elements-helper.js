import { LocatorUtil } from './locator.js';

/**
 * PageElementsHelper provides convenience methods for accessing common UI elements
 * across all page objects. This helper reduces code duplication and provides
 * a consistent API for element selection.
 */
class PageElementsHelper {
  /**
   * Creates an instance of PageElementsHelper
   * @param {Object} selectors - The selectors object from the page
   * @param {Object} page - The Playwright page object
   */
  constructor(selectors, page) {
    this.selectors = selectors;
    this.page = page;
    this.locatorUtil = new LocatorUtil(page);
  }

  /**
   * Get a button element by its name/text
   * @param {string} name - Button name/text
   * @returns {import('@playwright/test').Locator} Button locator
   */
  button(name) {
    return this.selectors.Button.byName(name);
  }

  /**
   * Get a heading element by its text
   * @param {string} text - Heading text
   * @returns {import('@playwright/test').Locator} Heading locator
   */
  heading(text) {
    return this.selectors.Common.headingByText(text);
  }

  /**
   * Get an alert element by its text
   * @param {string} text - Alert text
   * @returns {import('@playwright/test').Locator} Alert locator
   */
  alert(text) {
    return this.selectors.Alert.byText(text);
  }

  /**
   * Get a dialog element by its text
   * @param {string} text - Dialog text
   * @returns {import('@playwright/test').Locator} Dialog locator
   */
  dialog(text) {
    return this.selectors.Dialog.byText(text);
  }

  /**
   * Get an input element by its name attribute
   * @param {string} name - Input name attribute
   * @returns {import('@playwright/test').Locator} Input locator
   */
  input(name) {
    return this.selectors.Common.inputByName(name);
  }

  /**
   * Get an element by its placeholder text
   * @param {string} placeholder - Placeholder text
   * @returns {import('@playwright/test').Locator} Element locator
   */
  placeholder(placeholder) {
    return this.selectors.Common.elementByPlaceholder(placeholder);
  }

  /**
   * Get a checkbox element by its label
   * @param {string} label - Checkbox label text
   * @returns {import('@playwright/test').Locator} Checkbox locator
   */
  checkbox(label) {
    return this.selectors.Checkbox.byLabel(label);
  }

  /**
   * Get a dropdown element by type and identifier
   * @param {string} type - Dropdown type (e.g., 'projectStatus', 'projectPhase')
   * @returns {import('@playwright/test').Locator} Dropdown locator
   */
  dropdown(type) {
    if (this.selectors.Dropdown && this.selectors.Dropdown[type]) {
      return this.selectors.Dropdown[type]();
    }
    throw new Error(`Dropdown type '${type}' not found in selectors`);
  }

  /**
   * Get a span element by its text
   * @param {string} text - Span text
   * @returns {import('@playwright/test').Locator} Span locator
   */
  span(text) {
    return this.selectors.Common.spanByText(text);
  }

  /**
   * Get an element by a custom selector
   * @param {string} selector - CSS selector
   * @returns {import('@playwright/test').Locator} Element locator
   */
  selector(selector) {
    return this.selectors.Common.bySelector ? this.selectors.Common.bySelector(selector) : this.page.locator(selector);
  }

  /**
   * Get an element by its ID attribute
   * @param {string} id - Element ID (without the # prefix)
   * @param {Object} options - Additional filtering options
   * @returns {import('@playwright/test').Locator} Element locator
   */
  id(id, options = {}) {
    return this.locatorUtil.byId(id, options);
  }

  /**
   * Get an element by its attribute and value
   * @param {string} tag - Tag name of the element
   * @param {string} attribute - Attribute name of the element
   * @param {string} value - Value of the element's attribute
   * @param {Object} options - Additional options like exact match
   * @returns {import('@playwright/test').Locator} Element locator
   */
  byAttribute(tag, attribute, value, options = {}) {
    return this.locatorUtil.byAttribute(tag, attribute, value, options);
  }

  /**
   * Get an element by CSS selector with options
   * @param {string} selector - CSS selector string
   * @param {Object} options - Additional filtering options
   * @returns {import('@playwright/test').Locator} Element locator
   */
  bySelector(selector, options = {}) {
    return this.locatorUtil.bySelector(selector, options);
  }

  /**
   * Get a tab element by its text
   * @param {string} text - Tab text
   * @returns {import('@playwright/test').Locator} Tab locator
   */
  tab(text) {
    return this.page.getByRole('tab', { name: text });
  }

  /**
   * Get a text element by its content
   * @param {string} text - Text content to find
   * @param {Object} options - Additional filtering options
   * @returns {import('@playwright/test').Locator} Text locator
   */
  text(text, options = {}) {
    return this.locatorUtil.byText(text, options);
  }
}

export { PageElementsHelper };
