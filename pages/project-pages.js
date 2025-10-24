import { Selectors } from '../util/selectors.js';
import { BasePage } from '../util/base-page.js';
import { getRandomCoordinates, getBiddingZoneCoordinates } from '../util/geo-utils.js';
import { PageElementsHelper } from '../util/page-elements-helper.js';
import { timeouts } from '../util/timeout.js';
import uiConstants from '../util/ui-constants.js';
import logger from '../util/logger.js';

class Project extends BasePage {
  selectors;
  elements;

  constructor(page) {
    super(page);
    this.selectors = Selectors(page);
    this.elements = new PageElementsHelper(this.selectors, page);
  }

  /**
   * Save a new project.
   */
  async saveNewProject(type) {
    await this.click(this.elements.button(uiConstants.buttons.save));
    const savingProjectPopUp = this.elements.alert(uiConstants.alerts.savingProject);
    await this.verifyElementVisibility(true, savingProjectPopUp, timeouts.default);
    await this.waitForElementDetached(savingProjectPopUp, timeouts.long);
    const successNotification = this.elements.alert(uiConstants.alerts.projectCreated);
    await this.verifyElementVisibility(true, successNotification, timeouts.default);
    const projectName = uiConstants.dynamicText.projectName(type);
    await this.verifyElementVisibility(true, this.elements.heading(projectName), timeouts.default);
  }

  /**
   * Delete the current project from Project Setup page.
   */
  async deleteCurrentProject() {
    await this.click(this.elements.button(uiConstants.buttons.delete));
    const deleteConfirmation = this.elements.dialog(uiConstants.dialogs.deleteConfirmation);
    await this.verifyElementVisibility(true, deleteConfirmation, timeouts.default);
    await this.click(this.elements.button(uiConstants.buttons.delete));
    const deletionSuccessNotification = this.elements.alert(uiConstants.alerts.projectDeleted);
    await this.verifyElementVisibility(true, deletionSuccessNotification, timeouts.default);
  }

  /**
   * Click the "New Project" button to initiate project creation.
   */
  async clickNewProject() {
    await this.verifyElementVisibility(true, this.elements.button(uiConstants.buttons.newProject));
    await this.click(this.elements.button(uiConstants.buttons.newProject));
    await this.verifyElementVisibility(true, this.elements.heading(uiConstants.headings.projectSetup));
  }

  /**
   * Enter coordinates for the specified region in the project setup.
   * @param {string} region - The region for which to generate coordinates (e.g., "europe", "asia").
   */
  async enterCoordinates(region) {
    const { latitude, longitude } = getRandomCoordinates(region);
    await this.inputText(this.selectors.Input.latitude(), latitude);
    await this.inputText(this.selectors.Input.longitude(), longitude);
  }

  /**
   * Enter exact coordinates based on bidding zone configuration.
   * @param {string} biddingZone - The bidding zone type (can include descriptive text in parentheses).
   */
  async enterExactCoordinates(biddingZone) {
    try {
      const coordinates = getBiddingZoneCoordinates(biddingZone);
      await this.inputText(this.selectors.Input.latitude(), coordinates.latitude);
      await this.inputText(this.selectors.Input.longitude(), coordinates.longitude);
      logger.info(`Coordinates set successfully for ${biddingZone}`);
    } catch (error) {
      logger.info(`Failed to set coordinates for ${biddingZone}`, {
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Enter a project name in the project setup form.
   * @param {string} projectType - The type of project (e.g., "Solar", "Wind").
   */
  async enterProjectName(projectType) {
    const selector = this.elements.placeholder(uiConstants.placeholders.enterProjectName);
    await selector.fill(uiConstants.dynamicText.projectName(projectType));
  }

  /**
   * Set the business process for the project.
   * @param {string} businessProcess - The business process to select.
   */
  async selectBusinessProcess(businessProcess) {
    const dropdown = this.elements.placeholder(uiConstants.placeholders.selectBusinessProcess);
    await this.selectDropdownOption(dropdown, businessProcess);
  }

  /**
   * Set the project phase for the project.
   * @param {string} projectPhase - The project phase to select.
   */
  async selectProjectPhase(projectPhase) {
    const dropdown = this.selectors.Dropdown.projectPhase();
    await this.selectDropdownOption(dropdown, projectPhase);
  }

  /**
   * Set the project status for the project.
   * @param {string} projectStatus - The project status to select.
   */
  async selectProjectStatus(projectStatus) {
    const dropdown = this.selectors.Dropdown.projectStatus();
    await this.selectDropdownOption(dropdown, projectStatus);
  }

  /**
   * Set the project type for the project.
   * @param {string} projectType - The project type to select.
   */
  async selectProjectType(projectType) {
    const dropdown = this.elements.placeholder(uiConstants.placeholders.selectProjectType);
    const normalizedType = projectType.toLowerCase();
    let typeToSelect = projectType;
    if (normalizedType.includes('hybrid')) {
      typeToSelect = 'Hybrid';
    }
    await this.selectDropdownOption(dropdown, typeToSelect);
  }

  /**
   * Verify that the main page is displayed.
   */
  async verifyMainPage() {
    await this.verifyElementVisibility(true, this.selectors.MainPage.projectList());
    await this.verifyElementVisibility(true, this.elements.button(uiConstants.buttons.newProject));
  }

  /**
   * Handle Offtake logic based on project type.
   * @param {string} type - The type of project (e.g., "Solar", "Wind").
   * @returns {Promise<boolean>} - Returns true if any popup was handled.
   */
  async handleOfftakeLogic(type) {
    try {
      const projectName = uiConstants.dynamicText.projectName(type);
      await this.verifyElementVisibility(true, this.elements.heading(projectName), timeouts.medium);
      // This is a work around, waiting https://tdf.atlassian.net/browse/GNS-5231 to be fixed.
      await this.page.waitForTimeout(2000);
      const noOfftakePopUp = this.elements.alert(uiConstants.alerts.noOfftakeScheme);
      const isNoOfftakePopupVisible = await noOfftakePopUp.isVisible();
      const noBiddingZonePopUp = this.elements.alert(uiConstants.alerts.noBiddingZone);
      const isNoBiddingZonePopupVisible = await noBiddingZonePopUp.isVisible();
      if (isNoOfftakePopupVisible) {
        await this.setupOfftakeScheme();
        return true;
      } else if (isNoBiddingZonePopupVisible) {
        await this.setupBiddingZone();
        return true;
      } else {
        logger.info('🔍 No Offtake Scheme popups detected');
        return false;
      }
    } catch (error) {
      logger.error('Error handling project popups:', error.message);
      throw error;
    }
  }

  /**
   * Setup the "No Offtake Scheme available" popup flow.
   */
  async setupOfftakeScheme(offtakePrice) {
    try {
      const offtakeTab = this.elements.tab(uiConstants.tabs.offtake);
      await this.click(offtakeTab);
      const addOfftake = this.elements.button(uiConstants.buttons.addCustomOfftakeScheme);
      await this.verifyElementVisibility(true, addOfftake, timeouts.default);
      await this.click(addOfftake);
      const nameInput = this.elements.placeholder(uiConstants.placeholders.enterName);
      await nameInput.fill(uiConstants.dynamicText.customOfftakeName());
      const priceInput = this.selectors.ProjectConfig.offtakePriceInput();
      await priceInput.fill(offtakePrice || '185');
      const saveOfftake = this.elements.button(uiConstants.buttons.save);
      await this.click(saveOfftake);
      const confirmationMessage = this.elements.alert(uiConstants.alerts.offtakeSchemeCreated);
      await this.verifyElementVisibility(true, confirmationMessage, timeouts.default);
      logger.info('✅ Offtake scheme setup completed');
    } catch (error) {
      logger.error('Error in Adding Custom Offtake Scheme:', error.message);
      throw error;
    }
  }

  /**
   * Setup the "No Default Bidding Zone available" flow.
   */
  async setupBiddingZone() {
    try {
      const offtakeTab = this.elements.tab(uiConstants.tabs.offtake);
      await this.click(offtakeTab);
      const biddingZoneDropdown = this.selectors.Dropdown.biddingZones();
      await this.verifyElementVisibility(true, biddingZoneDropdown, timeouts.default);
      const biddingZonesDisabled = this.selectors.Dropdown.biddingZonesDisabled();
      const dataDisabled = await biddingZonesDisabled.getAttribute(uiConstants.attributes.dataDisabled);
      if (dataDisabled === 'true') {
        logger.warn('🔄 No Bidding zone available - Creating Offtake Scheme');
        await this.setupOfftakeScheme();
        return;
      }
      await this.selectDropdownOptionByIndex(biddingZoneDropdown, 1);
      logger.info('✅ Selected first bidding zone area');
      const saveButton = this.elements.button(uiConstants.buttons.save);
      await this.click(saveButton);
      const confirmationMessage = this.elements.alert(uiConstants.alerts.projectUpdated);
      await this.verifyElementVisibility(true, confirmationMessage, timeouts.default);
      logger.info('✅ Bidding zone setup completed');
    } catch (error) {
      logger.error('Error in setupBiddingZone:', error.message);
    }
  }

  /**
   * Navigate to the Project Setup Page through Edit Project button.
   */
  async goToProjectSetupPage() {
    try {
      const editProjectButton = this.elements.button(uiConstants.buttons.editProject);
      await this.click(editProjectButton);
      const projectSetupHeader = this.elements.tab(uiConstants.tabs.projectSetup);
      await this.verifyElementVisibility(true, projectSetupHeader, timeouts.default);
      logger.info('✅ Navigated to Project Setup Page');
    } catch (error) {
      logger.error('Edit Project button or Project Setup page was not found:', error.message);
      throw error;
    }
  }
}

export { Project };
