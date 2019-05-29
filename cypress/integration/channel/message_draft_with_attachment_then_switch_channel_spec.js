// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// ***************************************************************
// - [number] indicates a test step (e.g. 1. Go to a page)
// - [*] indicates an assertion (e.g. * Check the title)
// - Use element ID when selecting an element. Create one if none.
// ***************************************************************

/* eslint max-nested-callbacks: ["error", 5] */

describe('Message Draft with attachment and Switch Channels', () => {
    before(() => {
        // # Login and go to /
        cy.apiLogin('user-1');
        cy.visit('/');
    });
    const channelName1 = 'test-channel-1';
    const channelName2 = 'test-channel-2';
    let testChannel1;
    let testChannel2;
    it('M14126 Message Draft Pencil Icon - No text, only file attachment', () => {
        // # Create new test channel
        cy.getCurrentTeamId().then((teamId) => {
            cy.apiCreateChannel(teamId, channelName1, channelName1, 'O', 'Test channel').then((response) => {
                testChannel1 = response.body;
                cy.get(`#sidebarItem_${testChannel1.name}`).click({force: true});

                // # Validate if the channel has been opened
                cy.url().should('include', '/channels/' + testChannel1.name);

                // # Validate if the draft icon is not visible on the sidebar before making a draft
                cy.get(`#sidebarItem_${testChannel1.name} #draftIcon`, {force: true}).should('be.not.visible');

                // # Attach image in text area
                cy.fixture('mattermost-icon.png').then((fileContent) => {
                    cy.get('#fileUploadButton input').upload(
                        {fileContent, fileName: 'mattermost-icon.png', mimeType: 'image/png'},
                        {subjectType: 'drag-n-drop'},
                    );
                });
            });
            cy.apiCreateChannel(teamId, channelName2, channelName2, 'O', 'Test channel').then((response) => {
                testChannel2 = response.body;

                // # Go to test channel without submitting the draft in the previous channel
                cy.get(`#sidebarItem_${testChannel2.name}`, {force: true}).should('be.visible').click();

                // # Validate if the newly navigated channel is open
                cy.url().should('include', '/channels/' + testChannel2.name);

                // # Validate if the draft icon is visible in side bar for the previous channel
                cy.get(`#sidebarItem_${testChannel1.name} #draftIcon`).should('be.visible');
            });
        });
    });
});