/*
 * File: portfolio/js/network-background.js
 * Description: Creates an animated network background with moving particles and connecting lines.
 * Updated: Optimized to pause animation when tab is inactive to save battery and debounced resize.
 */

// Get the canvas element and its 2D rendering context
const canvas = document.getElementById('networkBackground');
const ctx = canvas.getContext('2d');

// Array to hold the particles (nodes)
const particles = [];

// Configuration for the network animation
const config = {
    particleCount: 150, // Default number of particles for large screens
    particleSize: 2,  // Radius of each particle
    lineDistance: 160,  // Maximum distance for particles to connect with a line
    particleSpeed: 0.5, // Speed of particle movement
    particleColor: 'rgba(114, 200, 229, 0.9)', // Color of particles (light blue with opacity)
    lineColor: 'rgba(173, 216, 230, 0.4)'    // Base color of connecting lines (light blue with opacity)
};

// Variable to store the animation frame ID
let animationId;

/**
 * Adjusts canvas size to fill the window and dynamically sets particle count
 * and speed based on screen width for responsiveness.
 */
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Adjust particle count and speed based on screen width for performance and aesthetics
    if (window.innerWidth < 768) { // For smaller screens (e.g., smartphones)
        config.particleCount = 60;
        config.particleSpeed = 0.3;
        config.particleSize = 1.5;
    } else { // For larger screens (tablets and desktops)
        config.particleCount = 150;
        config.particleSpeed = 0.5;
        config.particleSize = 2;
    }

    // Recreate particles to fit new dimensions after resize
    createParticles();
}

/**
 * Represents a single particle in the network background.
 */
class Particle {
    constructor() {
        // Random initial position within the canvas
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        // Random velocity for subtle movement, scaled by particleSpeed
        this.vx = (Math.random() - 0.5) * config.particleSpeed * 2;
        this.vy = (Math.random() - 0.5) * config.particleSpeed * 2;
        this.radius = config.particleSize; // Set particle size
    }

    /**
     * Draws the particle on the canvas.
     */
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); // Draw a circle
        ctx.fillStyle = config.particleColor; // Set particle color
        ctx.fill();
    }

    /**
     * Updates the particle's position and handles boundary collisions.
     */
    update() {
        this.x += this.vx; // Move particle horizontally
        this.y += this.vy; // Move particle vertically

        // Reverse velocity if particle hits canvas boundaries (bounces off walls)
        if (this.x < 0 || this.x > canvas.width) {
            this.vx *= -1;
        }
        if (this.y < 0 || this.y > canvas.height) {
            this.vy *= -1;
        }
    }
}

/**
 * Creates a new set of particles based on the current configuration.
 * Clears existing particles before creating new ones.
 */
function createParticles() {
    particles.length = 0; // Clear the array of existing particles
    for (let i = 0; i < config.particleCount; i++) {
        particles.push(new Particle()); // Add new particles
    }
}

/**
 * Draws lines between particles that are within a certain distance of each other.
 * Line opacity is adjusted based on distance.
 */
function drawLines() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const p1 = particles[i];
            const p2 = particles[j];

            // Calculate the Euclidean distance between two particles
            const distance = Math.sqrt(
                Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)
            );

            // If particles are within the lineDistance, draw a connecting line
            if (distance < config.lineDistance) {
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y); // Start line at p1
                ctx.lineTo(p2.x, p2.y); // End line at p2
                // Adjust line opacity: closer particles have higher opacity (up to 0.5)
                const opacity = (1 - distance / config.lineDistance) * 0.5;
                ctx.strokeStyle = config.lineColor.replace('0.4', opacity.toFixed(2)); // Apply dynamic opacity
                ctx.lineWidth = 0.5; // Set line thickness
                ctx.stroke(); // Draw the line
            }
        }
    }
}

/**
 * The main animation loop that continuously updates and draws the network background.
 */
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the entire canvas for the next frame

    // Update position and redraw each particle
    particles.forEach(p => {
        p.update();
        p.draw();
    });

    drawLines(); // Draw connecting lines between particles

    // Request the next animation frame and store the ID
    animationId = requestAnimationFrame(animate);
}

// Handle visibility changes to save battery
// If the user switches tabs, the animation pauses.
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        cancelAnimationFrame(animationId);
    } else {
        animate();
    }
});

// Event listeners for initializing and resizing the canvas
window.addEventListener('load', () => {
    resizeCanvas();     // Set initial canvas size and particle count
    createParticles();  // Create initial particles
    animate();          // Start the animation loop
});

// [UPDATED] Debounce resize event to improve performance
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        resizeCanvas();
    }, 200);
});