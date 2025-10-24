Feature: E2E flow to create a New Project for different Bidding Zones and create/validate New Configurations

  @smoke
  Scenario Outline: Create a new Configurations for <type> Project for single Bidding Zone
    Given user creates a "<type>" Project for "1 Bidding Zone (France)"
    When user creates a new "<type>" configuration
    Then configuration is successfully created and results are validated
    And user goes to the Project setup page
    And user deletes the current Project
    Examples:
      | type          |
      | Wind Offshore |
      | Wind Onshore  |
      | PV            |
      | Hybrid        |

  Scenario Outline: Create a new Configurations for <type> Project for multiple Bidding Zones
    Given user creates a "<type>" Project for "2 Bidding Zones (Andorra)"
    When user creates a new "<type>" configuration
    Then configuration is successfully created and results are validated
    And user goes to the Project setup page
    And user deletes the current Project
    Examples:
      | type          |
      | Wind Offshore |
      | Wind Onshore  |
      | PV            |
      | Hybrid        |

  Scenario Outline: Create a new Configurations for <type> Project for No Bidding Zone
    Given user creates a "<type>" Project for "No Bidding Zone (Austria)"
    When user creates a new "<type>" configuration
    Then configuration is successfully created and results are validated
    And user goes to the Project setup page
    And user deletes the current Project
    Examples:
      | type          |
      | Wind Offshore |
      | Wind Onshore  |
      | PV            |
      | Hybrid        |
