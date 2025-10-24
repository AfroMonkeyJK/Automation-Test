Feature: New Project creation

  Scenario Outline: Create a new <type> Project
    Given user opens main page
    Then user creates a new "<type>" Project
    And user deletes the current Project
    Examples:
      | type   |
      | Wind   |
      | PV     |
      | Hybrid |
