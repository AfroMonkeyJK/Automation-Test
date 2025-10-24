/**
 * UI Constants - ONLY for user-facing text, labels, and attributes
 * Technical selectors and IDs should go in selectors.js
 */

export const buttons = {
  // Configuration and PS buttons
  configurationMainPage: 'Configurations',
  newConfiguration: 'New Configuration',
  newPS: 'New Parameter Study',
  calculate: 'Calculate',
  calculatePS: 'Calculate Parameter Study',
  results: 'Results',
  editProject: 'Edit Project',
  costs: 'Costs',
  addToConfig: 'Add to Configurations',
  addLayout: 'Add Layout',
  addWtg: 'Add WTG',
  // Project buttons
  newProject: 'New Project',
  delete: 'Delete',
  addCustomOfftakeScheme: 'Add Custom Offtake Scheme',
  // Login/General buttons
  ok: 'OK',
  accept: 'Accept',
  save: 'Save',
  discard: 'Discard',
  cancel: 'Cancel'
};

export const headings = {
  // Configuration headings
  configurationMainPageHeader: 'Configurations',
  configurationSetup: 'Configuration Setup',
  pvConfiguration: 'PV Configuration',
  windConfiguration: 'Wind Configuration',
  siteConditions: 'Site Conditions',
  gridConnectionOptions: 'Grid Connection Options',
  gridConnectionSubheader: 'Grid Connection Option',
  offtake: 'Offtake',
  offtakePS: 'Offtake Scheme',
  // Parameter Study headings
  psSetup: 'New Parameter Study Setup',
  // Project headings
  projectSetup: 'Project Setup',
  // Login headings
  manageCookieConsent: 'Manage Cookie Consent'
};

export const alerts = {
  // Configuration alerts
  configurationCreated: 'Configuration Created!',
  pvConfigurationUpdated: 'PV Configuration Updated!',
  windConfigurationUpdated: 'Wind Configuration Updated!',
  gridConnectionUpdated: 'Grid Connection Option Updated!',
  offtakeUpdated: 'Configuration Offtake Updated!',
  computationStarted: 'Computation has started!',
  //Parameter Study Alerts
  createdPS: 'Parameter Study Created!',
  updatedPS: 'Parameter Study Updated!',
  offtakePSUpdated: 'Parameter Study Offtake Updated!',
  windPSUpdated: 'Wind Parameter Study Updated!',
  pvPSUpdated: 'PV Parameter Study Updated!',
  computationPSStarted: 'Parameter Study Computation Started!',
  computedPS: 'Parameter Study Computed!',
  // Project alerts
  projectCreated: 'Project Created',
  projectDeleted: 'Project Deleted!',
  projectUpdated: 'Project Updated!',
  savingProject: 'Saving Project',
  noOfftakeScheme: 'No Offtake Scheme available',
  noBiddingZone: 'No Default Bidding Zone available',
  offtakeSchemeCreated: 'Offtake Scheme Created!'
};

export const tabs = {
  projectSetup: 'Project Setup',
  configurations: 'Configurations',
  pvConfiguration: 'PV Configuration',
  windConfiguration: 'Wind Configuration',
  gridConnection: 'Grid Connection',
  offtake: 'Offtake',
  // Parameter Study
  parameterStudy: 'Parameter Studies',
  pvPSTab: 'PV Parameter Study',
  windPSTab: 'Wind Parameter Study'
};

export const dialogs = {
  costsGridConnection: 'Costs - Grid Connection',
  deleteConfirmation: 'Are you sure you want to delete',
  discardChanges: 'Leave and Discard Changes'
};

export const placeholders = {
  // Configuration placeholders
  configurationName: 'Configuration Name',
  selectWtg: 'Select WTG',
  selectWtgPS: 'Please Select',
  enterWtgQuantity: 'Enter WTG Quantity',
  dcCapacity: 'DC Capacity (MWp)',
  costValue: '0.00',
  hubHeight: '150.00',
  // Project placeholders
  enterProjectName: 'Enter project name',
  selectBusinessProcess: 'Select business process',
  selectProjectType: 'Select project type',
  enterName: 'Enter Name',
  // Parameter Study
  fieldNamePS: 'Parameter Study Name'
};

export const checkboxes = {
  remindMeAgain: 'Remind me again',
  dontShowAgain: 'Don\'t show the message again'
};

export const attributes = {
  dataDisabled: 'data-disabled',
  input: 'input',
  name: 'name',
  id: 'id',
  role: 'role',
  placeholder: 'placeholder',
  ariaLabel: 'aria-label',
  password: 'password',
  type: 'type'
};

export const inputAttributes = {
  submitType: { attribute: 'type', value: 'submit' },
  signInValue: { attribute: 'value', value: 'Sign in' }
};

export const dropdownOptions = {
  contractedOfftake: 'Contracted Offtake'
};
export const testStatus = {
  passed: 'PASSED',
  failed: 'FAILED',
  skipped: 'SKIPPED',
  pending: 'PENDING',
  undefined: 'UNDEFINED',
  ambiguous: 'AMBIGUOUS'
};
export const projectTypes = {
  pv: 'pv',
  windOffshore: 'wind offshore',
  windOnshore: 'wind onshore',
  hybrid: 'hybrid',
  hybridPV: 'hybrid pv',
  hybridWind: 'hybrid wind'
};
export const projectTypeGroups = {
  windTypes: [projectTypes.windOffshore, projectTypes.windOnshore, projectTypes.hybrid],
  pvTypes: [projectTypes.pv, projectTypes.hybrid],
  hasWind: type => projectTypeGroups.windTypes.includes(type.toLowerCase()),
  hasPv: type => projectTypeGroups.pvTypes.includes(type.toLowerCase())
};

export const projectTypeGroupsPS = {
  windTypes: [projectTypes.windOffshore, projectTypes.windOnshore, projectTypes.hybridWind],
  pvTypes: [projectTypes.pv, projectTypes.hybridPV],
  hasWind: type => projectTypeGroupsPS.windTypes.includes(type.toLowerCase()),
  hasPv: type => projectTypeGroupsPS.pvTypes.includes(type.toLowerCase())
};

export const dynamicText = {
  configurationName: type => `E2E Automation ${type} Configuration`,
  psName: type => `E2E Automation ${type} Parameter Study`,
  resultsHeader: type => `Results E2E Automation ${type} Configuration`,
  projectName: type => `Automation E2E ${type}`,
  customOfftakeName: () => 'Automation E2E Contracted Offtake'
};
export const testHelpers = {
  isTestFailure: status => status === testStatus.failed,
  isTestSuccess: status => status === testStatus.passed,
  isTestSkipped: status => [testStatus.skipped, testStatus.pending, testStatus.undefined].includes(status)
};
export const uiConstants = {
  buttons,
  headings,
  alerts,
  tabs,
  dialogs,
  placeholders,
  checkboxes,
  attributes,
  inputAttributes,
  dropdownOptions,
  projectTypes,
  projectTypeGroups,
  projectTypeGroupsPS,
  testStatus,
  testHelpers,
  dynamicText
};

export default uiConstants;
