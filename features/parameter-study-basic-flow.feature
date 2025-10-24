Feature: E2E flow to create a Parameter Study for a New single Bidding Zone Project

  @smoke
  Scenario Outline: Create a new Parameter Study for <type> Project for single Bidding Zone
    Given user creates a "<type>" Project for "1 Bidding Zone (France)"
    When user creates a new "<type>" Parameter Study
    Then the PS with better IRR is added to configurations
    And user goes to the Project setup page
    And user deletes the current Project
    Examples:
      | type          |
      | Wind Onshore  |
      | PV            |
      | Hybrid Wind   |
      | Hybrid PV     |
