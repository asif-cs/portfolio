/*
 * File: portfolio/js/main.js
 * Description: Main entry point for the portfolio application. Orchestrates 
 * initialization by coordinating renderers and UI interactions.
 */

import { populateHeader, populateProfileHeader, populateSections, populateFooter } from './renderers.js';
import { 
    setupThemeToggle, setupMobileMenu, setupScrollAnimations, setupProjectCarousels,
    setupNavHighlighting, setupFullscreenViewer, setupBackToTop, setupScrollIndicator,
    setupContactForm, setupReadMoreButtons, displayCurrentTime
} from './ui-interactions.js';

/**
 * Main entry point for initializing the entire portfolio application.
 * @param {object} data The full portfolio data from the JSON file.
 */
export function initializePortfolio(data) {
    window.portfolioData = data;

    // Set document title
    document.title = data.metadata.siteName || `Portfolio | ${data.personalInfo.name}`;

    // [SEO] Set Meta Description dynamically from JSON
    if (data.metadata.siteDescription) {
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.name = "description";
            document.head.appendChild(metaDesc);
        }
        metaDesc.content = data.metadata.siteDescription;
    }

    // Populate all dynamic sections of the website
    populateHeader(data.personalInfo, data.sections);
    populateProfileHeader(data.personalInfo, data);
    populateSections(data.sections, data.personalInfo);
    populateFooter(data.personalInfo, data);
    
    // Initialize UI interactions
    setupEventListeners(data.personalInfo.email);
}

function setupEventListeners(email) {
    setupThemeToggle();
    setupMobileMenu();
    setupScrollAnimations();
    setupProjectCarousels();
    setupNavHighlighting();
    setupFullscreenViewer();
    setupContactForm(email);
    setupReadMoreButtons();
    setupBackToTop(); 
    setupScrollIndicator(); 
    displayCurrentTime();
}