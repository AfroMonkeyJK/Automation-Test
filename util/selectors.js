import { LocatorUtil } from '../util/locator.js';

const Selectors = page => {
  const locator = new LocatorUtil(page);

  return {
    Alert: {
      byText: alertText => locator.byRoleAlert(alertText).filter({ hasText: alertText })
    },
    Button: {
      byName: buttonName => locator.byRoleButton(buttonName, true).filter({ hasText: buttonName })
    },
    Common: {
      dialogLocatorByText: locatorByText => locator.bySelector(`//*[@role='dialog']//p[text()="${locatorByText}"]`),
      elementByPlaceholder: placeholder => locator.byPlaceholder(placeholder),
      headingByText: headingText => locator.byRoleHeading(headingText),
      inputByLabel: label => locator.bySelector(`//label[text()="${label}"]/following-sibling::div//input`),
      inputByName: inputName => locator.byAttribute('input', 'name', `${inputName}`),
      inputByValue: value => locator.bySelector(`//input[contains(@value, "${value}")]`),
      menuSelected: value => locator.bySelector(`//*[contains(@class,"Selected")][text()="${value}"]`),
      spanByText: spanText => locator.bySelector(`//span[text()="${spanText}"]`)
    },
    Checkbox: {
      byLabel: labelText => locator.byRoleCheckbox(labelText).filter({ name: labelText }),
      bySelector: selector => locator.bySelector(selector)
    },
    Dialog: {
      byText: dialogText => locator.byRoleDialog(dialogText).filter({ hasText: dialogText })
    },
    MainPage: {
      projectList: () => locator.bySelector('[test-id="projects"]')
    },
    ProjectConfig: {
      offtakePriceInput: () => locator.bySelector('[test-id="price-(eurmod/mwh)"]'),
      siteArea: () => locator.bySelector('[test-id="site-area"]'),
      psSiteArea: () => locator.bySelector('[test-id="usable-land-(ha)"]'),
      hubHeight: () => locator.bySelector('[test-id="hub-height-(m)"]')
    },
    ParameterStudyPV: {
      dcCapacityField: () => locator.bySelector('.mantine-Switch-track')
    },
    ParameterStudyVariants: {
      variantsRow: () => locator.bySelector('table tbody tr')
    },
    Dropdown: {
      pvOfftake: () => locator.bySelector('[id="select-pv"]'),
      windOfftake: () => locator.bySelector('[id="select-wind"]'),
      projectStatus: () => locator.bySelector('input[test-id="project-status"]'),
      projectPhase: () => locator.bySelector('input[test-id="project-phase"]'),
      biddingZones: () => locator.bySelector('[role="combobox"]'),
      biddingZonesDisabled: () => locator.bySelector('[role="combobox"] > div > input'),
      options: () => locator.bySelector('div[role="option"]'),
      selectWtgsPS: () => locator.bySelector('[test-id="wtg-types"]')
    },
    AlertBySelector: {
      psCalculationStatus: () => locator.bySelector('[id="parameter-study-status"]')
    },
    tabConfiguration: {
      numSteps: () => locator.bySelector('[test-id="no.-of-steps"]')
    },
    Results: {
      productionField: () => locator.bySelector('[test-id="production"]'),
      valueField: () => locator.bySelector('[test-id="value-of-energy"]'),
      costsField: () => locator.bySelector('[test-id="expand-cost-of-energy"]'),
      economicField: () => locator.bySelector('[test-id="expand-economics-(without-financing)"]')
    },
    Input: {
      email: () => locator.byAttribute('input', 'name', 'loginfmt'),
      password: () => locator.byAttribute('input', 'name', 'passwd'),
      latitude: () => locator.byAttribute('input', 'name', 'latitude'),
      longitude: () => locator.byAttribute('input', 'name', 'longitude')
    }
  };
};

export { Selectors };
