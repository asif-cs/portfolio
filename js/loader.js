/*
 * File: portfolio/js/loader.js
 * Description: Handles initial data loading from portfolio.json and initializes the portfolio application.
 * Also manages the visibility of the main content and handles scrolling to a URL hash on page load.
 */

import { initializePortfolio } from './main.js';

/**
 * Fetches portfolio data from 'portfolio.json' and initializes the application.
 * Displays an error message if data loading fails, otherwise, makes the main content visible.
 */
async function loadData() {
    const jsEnabledContent = document.getElementById('js-enabled-content');

    try {
        const response = await fetch('portfolio.json');
        // Check if the HTTP response was successful
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json(); // Parse the JSON data

        // Once data is loaded, initialize the main application with the fetched data
        initializePortfolio(data);

        // If JavaScript runs and data loads, show the main content
        if (jsEnabledContent) {
            jsEnabledContent.style.display = 'block';
        }

        // --- NEW: Handle scrolling to hash on page load/refresh ---
        const hash = window.location.hash;
        if (hash) {
            // We use a small timeout to ensure the browser has finished painting
            // the new content before we try to scroll.
            setTimeout(() => {
                const targetElement = document.querySelector(hash);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'auto' });
                }
            }, 100);
        }
        // --- End of new code ---

    } catch (error) {
        // Log any errors that occur during data loading
        console.error("Could not load portfolio data:", error);
        // Display a user-friendly error message on the page instead of the content
        if (jsEnabledContent) {
            jsEnabledContent.innerHTML = ''; // Clear any pre-rendered content
            jsEnabledContent.style.display = 'block'; // Make sure the container is visible to show error
            jsEnabledContent.innerHTML = '<h1 style="color: red; text-align: center; margin-top: 50px;">Error: Could not load portfolio data. Please try again later.</h1>';
        } else {
             document.body.innerHTML = '<h1 style="color: red; text-align: center; margin-top: 50px;">Error: Could not load portfolio data. Please try again later.</h1>';
        }
    }
}

// Event listener to load data once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', loadData);