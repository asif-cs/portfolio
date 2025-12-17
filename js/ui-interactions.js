/*
 * File: portfolio/js/ui-interactions.js
 * Description: Handles interactive elements like the theme toggle, mobile menu, modals, and animations.
 */

export function displayCurrentTime() {
    const el = document.getElementById('message-timestamp');
    if(el) el.textContent = `Delivered Today at ${new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
}

export async function setupProfileTitleAnimation(titles) {
    const el = document.getElementById('animated-title');
    if (!el || !titles || titles.length === 0) return;
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    
    let titleIndex = 0;
    while (true) {
        const title = titles[titleIndex];
        for (let i = 0; i < title.length; i++) {
            el.textContent += title[i];
            await sleep(80);
        }
        await sleep(2000);
        for (let i = title.length; i > 0; i--) {
            el.textContent = el.textContent.slice(0, -1);
            await sleep(40);
        }
        await sleep(500);
        titleIndex = (titleIndex + 1) % titles.length;
    }
}

export function setupThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
    const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    const applyTheme = (theme) => {
        document.body.dataset.theme = theme;
        toggle.innerHTML = theme === 'dark' ? sunIcon : moonIcon;
        localStorage.setItem('theme', theme);
    };
    toggle.addEventListener('click', () => applyTheme(document.body.dataset.theme === 'dark' ? 'light' : 'dark'));
    applyTheme(localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
}

export function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger-menu');
    const overlay = document.getElementById('mobile-nav-overlay');
    const toggleMenu = (isOpen) => {
        hamburger.classList.toggle('is-active', isOpen);
        overlay.classList.toggle('is-open', isOpen);
        document.body.classList.toggle('no-scroll', isOpen);
        document.body.classList.toggle('menu-is-open', isOpen);
    };
    hamburger.addEventListener('click', () => toggleMenu(!hamburger.classList.contains('is-active')));
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay || e.target.tagName === 'A') {
            toggleMenu(false);
        }
    });
}

export function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.main-content section').forEach(section => {
        observer.observe(section);
    });
}

export function setupProjectCarousels() {
    document.querySelectorAll('.media-carousel').forEach(carousel => {
        const displayItems = carousel.querySelectorAll('.media-item');
        if (displayItems.length === 0) return;

        const display = carousel.querySelector('.media-carousel-display');
        const thumbItems = carousel.querySelectorAll('.thumb-item');
        const captionEl = carousel.querySelector('.media-caption');
        const firstMediaItem = displayItems[0];
        const firstSrc = firstMediaItem.tagName === 'IMG' ? firstMediaItem.src : firstMediaItem.querySelector('source')?.src;

        let mediaData = null;
        // Access global portfolioData to find matching media
        if (window.portfolioData && window.portfolioData.sections) {
            const projectsSection = window.portfolioData.sections.find(s => s.type === 'projects');
            if (projectsSection) {
                const project = projectsSection.content.find(p => p.media && p.media.some(m => m.src === firstSrc));
                if (project) mediaData = project.media;
            }
            if (!mediaData) {
                const aboutSection = window.portfolioData.sections.find(s => s.type === 'bio');
                if (aboutSection && aboutSection.content.media && aboutSection.content.media.some(m => m.src === firstSrc)) {
                    mediaData = aboutSection.content.media;
                }
            }
        }
        
        if (mediaData) {
            carousel.dataset.media = JSON.stringify(mediaData);
        }
        
        let currentIndex = 0;
        
        const showMedia = (index) => {
            if (index < 0 || index >= displayItems.length) return;
            currentIndex = index;
            carousel.dataset.currentIndex = currentIndex;

            displayItems.forEach((item, i) => {
                if(item.tagName === 'VIDEO') item.pause();
                item.classList.toggle('active', i === index);
            });
            thumbItems.forEach((thumb, i) => thumb.classList.toggle('active', i === currentIndex));
            
            const activeItem = displayItems[currentIndex];
            const currentMediaData = mediaData ? mediaData[currentIndex] : null;

            if (display) {
                display.dataset.mediaSrc = activeItem.src || activeItem.querySelector('source').src;
                display.dataset.mediaType = activeItem.tagName === 'VIDEO' ? 'video' : 'image';
                if (currentMediaData) {
                    display.dataset.fullCaption = currentMediaData.caption || '';
                }
            }
            if (captionEl) {
                if (currentMediaData && currentMediaData.caption && currentMediaData.caption.trim() !== '') {
                    captionEl.textContent = currentMediaData.caption;
                    captionEl.style.display = '';
                } else {
                    captionEl.textContent = '';
                    captionEl.style.display = 'none';
                }
            }
        };

        carousel.querySelector('.prev')?.addEventListener('click', () => showMedia((currentIndex - 1 + displayItems.length) % displayItems.length));
        carousel.querySelector('.next')?.addEventListener('click', () => showMedia((currentIndex + 1) % displayItems.length));
        thumbItems.forEach(thumb => thumb.addEventListener('click', () => showMedia(parseInt(thumb.dataset.index))));
        
        showMedia(0);
    });
}

export function setupNavHighlighting() {
    const navLinks = document.querySelectorAll('.main-nav a, .mobile-nav a');
    const sections = Array.from(document.querySelectorAll('.main-content section'));

    const visibleHeightMap = {};

    const observerOptions = {
      root: null, 
      rootMargin: '0px',
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0] 
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        visibleHeightMap[entry.target.id] = entry.intersectionRect.height;
      });

      let bestId = null;
      let maxVisibleHeight = 0;

      for (const id in visibleHeightMap) {
        if (visibleHeightMap[id] > maxVisibleHeight) {
          maxVisibleHeight = visibleHeightMap[id];
          bestId = id;
        }
      }

      if (bestId) {
        navLinks.forEach(link => {
          const linkId = link.getAttribute('href').substring(1);
          if (linkId === bestId) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    }, observerOptions);

    sections.forEach(section => {
      observer.observe(section);
      visibleHeightMap[section.id] = 0;
    });
}

export function setupFullscreenViewer() {
    const modal = document.getElementById('fullscreenModal');
    if (!modal) return;

    const modalContent = modal.querySelector('.modal-media-wrapper');
    const closeModalBtn = modal.querySelector('.modal-close');
    const prevBtn = modal.querySelector('.modal-nav.prev');
    const nextBtn = modal.querySelector('.modal-nav.next');

    let modalMedia = [];
    let modalCurrentIndex = -1;
    let lastFocusedElement; 

    const showModalMedia = () => {
        if (modalCurrentIndex < 0 || modalCurrentIndex >= modalMedia.length) return;

        const item = modalMedia[modalCurrentIndex];
        let mediaElementHTML = '';
        if (item.type === 'video') {
            mediaElementHTML = `<video src="${item.src}" controls autoplay playsinline loop></video>`;
        } else {
            mediaElementHTML = `<img src="${item.src}" alt="${item.alt || 'Fullscreen image'}">`;
        }
        
        modalContent.innerHTML = `
            ${mediaElementHTML}
            ${item.caption ? `<div class="modal-caption">${item.caption}</div>` : ''}
        `;
    };
    
    const openModal = (media, index) => {
        lastFocusedElement = document.activeElement; 
        modalMedia = media;
        modalCurrentIndex = index;
        
        showModalMedia();
        
        if (modalMedia.length > 1) {
            prevBtn.style.display = 'block';
            nextBtn.style.display = 'block';
        } else {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
        }
        
        modal.classList.add('is-open');
        document.body.classList.add('no-scroll');

        setTimeout(() => closeModalBtn.focus(), 100);
    };

    const closeModal = () => {
        const video = modal.querySelector('video');
        if (video) video.pause();
        modal.classList.remove('is-open');
        modalContent.innerHTML = ''; 
        document.body.classList.remove('no-scroll');
        modalMedia = [];
        modalCurrentIndex = -1;

        if (lastFocusedElement) lastFocusedElement.focus();
    };
    
    const showNext = () => {
        modalCurrentIndex = (modalCurrentIndex + 1) % modalMedia.length;
        showModalMedia();
    };

    const showPrev = () => {
        modalCurrentIndex = (modalCurrentIndex - 1 + modalMedia.length) % modalMedia.length;
        showModalMedia();
    };

    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { 
        if (e.target === modal) closeModal(); 
    });
    document.addEventListener('keydown', (e) => {
        if (modal.classList.contains('is-open')) {
            if (e.key === 'Escape') closeModal();
            if (modalMedia.length > 1) {
                if (e.key === 'ArrowRight') showNext();
                if (e.key === 'ArrowLeft') showPrev();
            }
        }
    });
    
    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);
    
    document.body.addEventListener('click', (e) => {
        const clickable = e.target.closest('.media-clickable');
        if (clickable) {
            const carousel = clickable.closest('.media-carousel');
            
            if (carousel && carousel.dataset.media && carousel.dataset.currentIndex !== undefined) {
                const mediaItems = JSON.parse(carousel.dataset.media);
                const currentIndex = parseInt(carousel.dataset.currentIndex, 10);
                openModal(mediaItems, currentIndex);
            } else if (clickable.dataset.mediaSrc) {
                const item = {
                    src: clickable.dataset.mediaSrc,
                    caption: clickable.dataset.fullCaption,
                    type: clickable.dataset.mediaType,
                    alt: clickable.querySelector('img')?.alt || ''
                };
                openModal([item], 0);
            }
        }
    });
}

export function setupBackToTop() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.ariaLabel = 'Back to top';
    backToTopBtn.innerHTML = `<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>`;
    
    document.body.appendChild(backToTopBtn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

export function setupScrollIndicator() {
    // This element is dynamic, so we delegate or use a closure.
    // However, it's simplest to just check on scroll if we haven't found it yet.
    let indicator = null;
    
    window.addEventListener('scroll', () => {
        if (!indicator) indicator = document.querySelector('.scroll-down-indicator');
        if (indicator) {
            if (window.scrollY > 50) {
                indicator.classList.add('hidden');
            } else {
                indicator.classList.remove('hidden');
            }
        }
    });
}

export function setupContactForm(recipientEmail) {
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const message = e.target.message.value;
            window.location.href = `mailto:${recipientEmail}?subject=Inquiry from Portfolio&body=${encodeURIComponent(message)}`;
            e.target.message.value = '';
        });
    }
}

export function setupReadMoreButtons() {
    // Initial check for truncation
    setTimeout(() => {
        document.querySelectorAll('.project-description-wrapper').forEach(wrapper => {
            const description = wrapper.querySelector('.project-description');
            const button = wrapper.querySelector('.read-more-btn');
            if (description && button) {
                if (description.scrollHeight > description.clientHeight) {
                    button.style.display = 'inline-block';
                } else {
                    button.style.display = 'none';
                }
            }
        });
    }, 500);

    // Delegate click event
    document.addEventListener('click', (e) => {
        if (e.target.matches('.read-more-btn')) {
            const wrapper = e.target.closest('.project-description-wrapper');
            if (wrapper) {
                const description = wrapper.querySelector('.project-description');
                const isExpanded = description.classList.toggle('expanded');
                e.target.textContent = isExpanded ? 'See Less' : 'See More';
            }
        }
    });
}