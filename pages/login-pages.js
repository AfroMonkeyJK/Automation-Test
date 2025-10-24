import { Selectors } from '../util/selectors.js';
import { BasePage } from '../util/base-page.js';
import { envConfig } from '../util/environment-config.js';
import { PageElementsHelper } from '../util/page-elements-helper.js';
import uiConstants from '../util/ui-constants.js';
import logger from '../util/logger.js';
import dotenv from 'dotenv';
dotenv.config();

class LoginPages extends BasePage {
  selectors;
  elements;

  constructor(page) {
    super(page);
    this.selectors = Selectors(page);
    this.elements = new PageElementsHelper(this.selectors, page);
  }

  async open() {
    await this.page.goto(envConfig.baseUrl);
  }

  async setEmail() {
    const email = process.env.TESTUSER_EMAIL;
    const emailField = this.selectors.Input.email();
    await this.verifyElementVisibility(true, emailField);
    await this.inputText(emailField, email);
  }

  async setPassword() {
    const password = process.env.TESTUSER_PASSWORD;
    const passwordField = this.selectors.Input.password();
    await this.verifyElementVisibility(true, passwordField);
    await this.fillSensitiveInput(passwordField, password);
  }

  async clickNext() {
    await this.click(
      this.elements.byAttribute(
        uiConstants.attributes.input,
        uiConstants.inputAttributes.submitType.attribute,
        uiConstants.inputAttributes.submitType.value,
        { exact: true }
      )
    );
  }

  async clickSignIn() {
    await this.click(
      this.elements.byAttribute(
        uiConstants.attributes.input,
        uiConstants.inputAttributes.signInValue.attribute,
        uiConstants.inputAttributes.signInValue.value,
        { exact: true }
      )
    );
  }

  async verifyAndSkipCookiePopup() {
    await this.verifyElementVisibility(true, this.elements.heading(uiConstants.headings.manageCookieConsent));
    await this.click(this.elements.button(uiConstants.buttons.accept));
  }

  /**
   * Logs in the user application and closes any popups.
   */
  async login() {
    try {
      await this.open();
      await this.setEmail();
      await this.clickNext();
      await this.setPassword();
      await this.clickSignIn();
      await this.verifyAndSkipWelcomePopup();
      await this.verifyAndSkipCookiePopup();
      logger.info('✅ Login process completed successfully');
    } catch (error) {
      logger.error('❌ Login process failed:', error.message);
      throw error;
    }
  }
}

export { LoginPages };
