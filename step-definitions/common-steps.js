import { Given, Then } from '@cucumber/cucumber';
import { LoginPages } from '../pages/login-pages.js';
import { Project } from '../pages/project-pages.js';
import { timeouts } from '../util/timeout.js';

Given('user opens dev', { timeout: timeouts.long }, async function () {
  const loginPage = new LoginPages(this.page);
  await loginPage.login();
});

Given('user creates a {string} Project for {string}', { timeout: timeouts.long }, async function (projectType, biddingZone) {
  const project = new Project(this.page);
  const loginPage = new LoginPages(this.page);
  await loginPage.login();
  await project.clickNewProject();
  await project.enterProjectName(projectType);
  await project.enterExactCoordinates(biddingZone);
  await project.selectProjectType(projectType);
  await project.selectBusinessProcess('Tender Project');
  await project.selectProjectStatus('Test Project');
  await project.selectProjectPhase('Prospect');
  await project.saveNewProject(projectType);
  await project.handleOfftakeLogic(projectType);
});

Then('user creates a new {string} Project', { timeout: timeouts.long }, async function (projectType) {
  const project = new Project(this.page);
  await project.clickNewProject();
  await project.enterProjectName(projectType);
  await project.enterCoordinates('europe');
  await project.selectProjectType(projectType);
  await project.selectBusinessProcess('Tender Project');
  await project.selectProjectStatus('Test Project');
  await project.selectProjectPhase('Prospect');
  await project.saveNewProject(projectType);
});

Then('user goes to the Project setup page', { timeout: timeouts.long }, async function () {
  const project = new Project(this.page);
  await project.goToProjectSetupPage();
});

Then('user deletes the current Project', { timeout: timeouts.long }, async function () {
  const project = new Project(this.page);
  await project.deleteCurrentProject();
  await project.verifyMainPage();
});
