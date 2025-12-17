/*
 * File: portfolio/js/renderers.js
 * Description: Contains functions that generate and populate HTML content based on data.
 */

import { getIconPath } from './utils.js';
import { setupProfileTitleAnimation } from './ui-interactions.js';

export function populateHeader(personalInfo, sections) {
    document.getElementById('header-name-link').textContent = personalInfo.name;
    const createNavLink = (section) => {
        const link = document.createElement('a');
        link.href = `#${section.id}`;
        link.textContent = section.title;
        return link;
    };
    const mainNav = document.getElementById('main-nav');
    const mobileNav = document.getElementById('mobile-nav');
    mainNav.innerHTML = '';
    mobileNav.innerHTML = '';
    sections.forEach(s => {
        mainNav.appendChild(createNavLink(s));
        mobileNav.appendChild(createNavLink(s).cloneNode(true));
    });
}

export function populateProfileHeader(personalInfo, data) {
    const profileHeader = document.getElementById('profile-header');
    profileHeader.id = 'home';
    const socialLinksHTML = personalInfo.socials.map(s => `
        <a href="${s.url}" target="_blank" rel="noopener noreferrer" class="btn-icon" aria-label="${s.name}">
            <svg viewBox="0 0 24 24"><path d="${getIconPath(s.icon)}"/></svg>
        </a>`).join('');
        
    profileHeader.innerHTML = `
        <img src="${personalInfo.imageUrl}" alt="Profile picture of ${personalInfo.name}" class="user-image" onerror="this.onerror=null;this.src='https://placehold.co/200x200/4f46e5/ffffff?text=RR';">
        <h1>${personalInfo.name}</h1>
        <p class="main-title-static">${personalInfo.title}</p>
        <p class="title" id="animated-title"></p>
        <div class="social-links">${socialLinksHTML}</div>
        
        <a href="#about" class="scroll-down-indicator" aria-label="Scroll down">
            <span class="mouse">
                <span class="wheel"></span>
            </span>
            <span class="arrow"></span>
        </a>`;
        
    const skillsSection = data.sections.find(s => s.type === 'skills');
    if (skillsSection) {
        const skillsList = Object.values(skillsSection.content).flat();
        setupProfileTitleAnimation(skillsList);
    }
}

export function populateSections(sections, personalInfo) {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = '';
    sections.forEach(sectionData => {
        const sectionEl = document.createElement('section');
        sectionEl.id = sectionData.id;
        const titleEl = document.createElement('h2');
        titleEl.className = 'section-title';
        titleEl.textContent = sectionData.title;
        sectionEl.appendChild(titleEl);
        let contentEl;
        switch (sectionData.type) {
            case 'bio': contentEl = renderBioSection(sectionData.content); break;
            case 'timeline': contentEl = renderTimelineSection(sectionData.content, 'experience'); break;
            case 'projects': contentEl = renderProjectsSection(sectionData.content); break;
            case 'skills': contentEl = renderSkillsSection(sectionData.content); break;
            case 'education': contentEl = renderTimelineSection(sectionData.content.items, 'education'); break;
            case 'contact': contentEl = renderContactSection(sectionData.content, personalInfo); break;
        }
        if (contentEl) sectionEl.appendChild(contentEl);
        mainContent.appendChild(sectionEl);
    });
}

export function populateFooter(personalInfo, data) {
    const footerElement = document.querySelector('.main-footer');
    if (!footerElement) return;
    const lastUpdatedDate = new Date(data.metadata.lastUpdated).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    const socialLinks = personalInfo.socials.map(s => `
        <a href="${s.url}" target="_blank" rel="noopener noreferrer" class="btn-icon" aria-label="${s.name}">
            <svg viewBox="0 0 24 24"><path d="${getIconPath(s.icon)}"/></svg>
        </a>`).join('');
    footerElement.innerHTML = `
        <div class="footer-columns">
            <div class="footer-col footer-info">
                <h3>${personalInfo.name}</h3>
                <p>&copy; ${new Date().getFullYear()} All Rights Reserved.</p>
                <p>Last updated: ${lastUpdatedDate}</p>
            </div>
            <div class="footer-col footer-links">
                <h3>Quick Links</h3>
                <ul>${data.sections.map(s => `<li><a href="#${s.id}" class="link-underline">${s.title}</a></li>`).join('')}</ul>
            </div>
            <div class="footer-col footer-socials">
                <h3>Connect</h3>
                <div class="social-links-footer">${socialLinks}</div>
            </div>
        </div>`;
}

// Internal Render Helpers

function renderBioSection(content) {
    const container = document.createElement('div');
    container.className = 'card bio-card';
    const textDiv = document.createElement('div');
    textDiv.className = 'bio-text';
    textDiv.innerHTML = content.text.map(p => `<p>${p}</p>`).join('');
    container.appendChild(textDiv);
    
    if (content.media && content.media.length > 0) {
        container.classList.add('has-media');
        container.appendChild(renderMediaContainer(content.media));
    }
    return container;
}

function renderTimelineSection(content, type) {
    const container = document.createElement('div');
    container.className = 'card';
    content.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = type === 'education' ? 'education-item' : 'timeline-item';
        const title = type === 'education' ? item.degree : item.role;
        const subtitle = type === 'education' ? `${item.university} | ${item.year}` : item.company;
        const period = type === 'education' ? '' : `<div class="period">${item.period}</div>`;
        const detailsList = type === 'education' ? item.notes : item.responsibilities;
        itemEl.innerHTML = `
            <h3>${title}</h3>
            <div class="detail-subtitle">${subtitle}</div>
            ${period}
            <ul class="detail-notes">${detailsList.map(note => `<li>${note}</li>`).join('')}</ul>`;
        container.appendChild(itemEl);
    });
    return container;
}

// [UPDATED] Render Projects with Expandable Filter Menu
function renderProjectsSection(content) {
    const container = document.createElement('div');
    
    // 1. Collect all unique tags for the filter (excluding 'All' initially)
    const uniqueTags = [...new Set(content.flatMap(p => p.tags))];
    const activeTags = new Set(); 
    
    // 2. Create Layout Structure
    const filterContainer = document.createElement('div');
    filterContainer.className = 'project-filters';
    
    // 2a. Top Bar: "All" Button + "Filter" Toggle
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'filter-controls';

    // "All" Button
    const allBtn = document.createElement('button');
    allBtn.className = 'filter-btn active'; // Active by default
    allBtn.textContent = 'All';
    
    // "Filter" Toggle Button
    const filterToggleBtn = document.createElement('button');
    filterToggleBtn.className = 'filter-btn';
    filterToggleBtn.innerHTML = `
        <span>Filter</span>
        <svg viewBox="0 0 24 24"><path d="M4 6h16M7 12h10M10 18h4" stroke-linecap="round" stroke-linejoin="round"/></svg>
    `;

    controlsDiv.appendChild(allBtn);
    controlsDiv.appendChild(filterToggleBtn);
    filterContainer.appendChild(controlsDiv);

    // 2b. Expandable Tags Wrapper
    const tagsWrapper = document.createElement('div');
    tagsWrapper.className = 'filter-tags-wrapper';

    // 2c. Render Tag Buttons
    uniqueTags.forEach(tag => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.textContent = tag;
        
        btn.addEventListener('click', () => {
            // Logic for selecting specific tags
            if (activeTags.has(tag)) {
                activeTags.delete(tag);
                btn.classList.remove('active');
            } else {
                activeTags.add(tag);
                btn.classList.add('active');
            }

            // Update "All" button state
            if (activeTags.size > 0) {
                allBtn.classList.remove('active');
            } else {
                allBtn.classList.add('active');
            }

            // Filter the cards
            filterCards();
        });
        tagsWrapper.appendChild(btn);
    });
    filterContainer.appendChild(tagsWrapper);
    container.appendChild(filterContainer);

    // 2d. Projects Grid
    const projectsGrid = document.createElement('div');
    projectsGrid.className = 'projects-grid'; 

    content.forEach(project => {
        const card = renderProjectCard(project);
        card.dataset.tags = JSON.stringify(project.tags);
        projectsGrid.appendChild(card);
    });
    container.appendChild(projectsGrid);

    // 3. Interactions
    
    // "All" Click Handler
    allBtn.addEventListener('click', () => {
        activeTags.clear();
        // Remove active class from all specific tag buttons
        tagsWrapper.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        allBtn.classList.add('active');
        filterCards();
        
        // Optional: Close menu on reset? 
        // tagsWrapper.classList.remove('expanded'); 
        // filterToggleBtn.classList.remove('active');
    });

    // "Filter" Toggle Handler
    filterToggleBtn.addEventListener('click', () => {
        const isExpanded = tagsWrapper.classList.toggle('expanded');
        filterToggleBtn.classList.toggle('active', isExpanded);
    });

    // Helper: Filter Logic
    function filterCards() {
        const cards = projectsGrid.querySelectorAll('.project-card');
        cards.forEach(card => {
            const projectTags = JSON.parse(card.dataset.tags || '[]');
            // Show if 'All' is active (size 0) OR if project has ANY of the active tags
            const isVisible = activeTags.size === 0 || projectTags.some(t => activeTags.has(t));
            
            if (isVisible) {
                card.style.display = ''; 
                card.classList.add('fade-in'); 
                setTimeout(() => card.classList.remove('fade-in'), 500);
            } else {
                card.style.display = 'none';
            }
        });
    }

    return container;
}

function renderProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'card project-card';
    
    const hasMedia = project.media && project.media.length > 0;
    if (hasMedia) {
        card.classList.add('has-media');
    } else {
        card.classList.add('no-media');
    }

    const detailsDiv = document.createElement('div');
    detailsDiv.className = 'project-details';
    
    const descriptionHTML = project.description.map(p => `<p>${p}</p>`).join('');
    
    detailsDiv.innerHTML = `
        <h3>${project.title}</h3>
        <div class="project-description-wrapper">
            <div class="project-description">${descriptionHTML}</div>
            <button class="read-more-btn">See More</button>
        </div>
        <div class="project-meta">
            <div class="tags">${project.tags.map(t => `<span class="tech-tag">${t}</span>`).join('')}</div>
            <div class="project-links">${project.links.map(link => `<a href="${link.url}" target="_blank" rel="noopener noreferrer" class="link-underline">${link.name}</a>`).join('')}</div>
        </div>
    `;
    card.appendChild(detailsDiv);

    if (hasMedia) {
        card.appendChild(renderMediaContainer(project.media));
    }

    return card;
}

function renderMediaContainer(media) {
    const mediaContainer = document.createElement('div');
    mediaContainer.className = 'media-container';
    
    if (media.length === 1) {
        const item = media[0];
        const mediaElementHTML = item.type === 'video'
            ? `<video class="media-item active" src="${item.src}" controls playsinline muted loop></video>`
            : `<img src="${item.src}" alt="${item.alt}" loading="lazy">`;
        
        const captionHTML = (item.caption && item.caption.trim() !== '') 
            ? `<p class="media-caption">${item.caption}</p>` 
            : '';

        mediaContainer.innerHTML = `
            <div class="media-single media-clickable" data-media-type="${item.type}" data-media-src="${item.src}" data-full-caption="${item.caption || ''}">
                ${mediaElementHTML}
                ${captionHTML}
            </div>`;
    } else {
        const mediaItemsHTML = media.map((item, i) => {
             if (item.type === 'video') {
                return `<video class="media-item ${i === 0 ? 'active' : ''}" src="${item.src}" data-index="${i}" playsinline muted loop></video>`;
            }
            return `<img src="${item.src}" alt="${item.alt}" class="media-item ${i === 0 ? 'active' : ''}" data-index="${i}" loading="lazy">`;
        }).join('');

        mediaContainer.innerHTML = `
            <div class="media-carousel">
                <div class="media-carousel-display media-clickable" data-media-src="" data-full-caption="">
                    ${mediaItemsHTML}
                </div>
                <p class="media-caption"></p>
                <div class="media-controls">
                    <button class="carousel-nav-btn prev" aria-label="Previous"><svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" stroke="currentColor" stroke-width="2" fill="none"/></svg></button>
                    <div class="media-thumbnails">${media.map((item, i) => `<img src="${item.thumb || item.src}" class="thumb-item ${i === 0 ? 'active' : ''}" data-index="${i}" alt="Thumbnail of ${item.alt}" loading="lazy">`).join('')}</div>
                    <button class="carousel-nav-btn next" aria-label="Next"><svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" stroke="currentColor" stroke-width="2" fill="none"/></svg></button>
                </div>
            </div>`;
    }
    return mediaContainer;
}

function renderSkillsSection(content) {
    const container = document.createElement('div');
    container.className = 'card';
    container.innerHTML = `<div class="skills-grid">
        ${Object.entries(content).map(([category, skills]) => `
            <div class="skill-category">
                <h3>${category}</h3>
                <div class="skill-tags">${skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}</div>
            </div>`).join('')}
    </div>`;
    return container;
}

function renderContactSection(content, personalInfo) {
    const container = document.createElement('div');
    container.className = 'card chat-window';
    container.innerHTML = `
        <div class="chat-header">
            <img src="${personalInfo.imageUrl}" class="chat-avatar" alt="${personalInfo.name}" onerror="this.onerror=null;this.src='https://placehold.co/36x36/4f46e5/ffffff?text=RR';">
            <span class="chat-name">${personalInfo.name}</span>
        </div>
        <div class="chat-body">
            <div class="message-container">
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <p class="contact-intro">${content}</p>
            </div>
            <span class="message-timestamp" id="message-timestamp"></span>
        </div>
        <form class="contact-form" id="contact-form">
            <textarea id="message" name="message" class="form-textarea" placeholder="Your message..." required></textarea>
            <button type="submit" class="btn-icon contact-button" aria-label="Send Email">
                <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
            </button>
        </form>`;
    return container;
}