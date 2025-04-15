// analytics.js - Event tracking for personal website

// Create tracking.js file in your repository and add this code

// Initialize tracking when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Track page view when the page loads
    logEvent('view', 'page', document.title);
    
    // Set up click tracking for the entire document
    setupClickTracking();
    
    // Set up intersection observer for view tracking
    setupViewTracking();
});

/**
 * Set up click tracking for all elements on the page
 */
function setupClickTracking() {
    // Listen for clicks anywhere in the document
    document.addEventListener('click', function(event) {
        // Get the clicked element
        const element = event.target;
        
        // Determine what type of element was clicked
        const elementInfo = getElementInfo(element);
        
        // Log the click event
        logEvent('click', elementInfo.type, elementInfo.details);
    });
}

/**
 * Set up view tracking for key elements using Intersection Observer
 */
function setupViewTracking() {
    // Create options for the observer
    const options = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.5 // element is considered viewed when 50% visible
    };
    
    // Create the observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Element is now visible
                const element = entry.target;
                const elementInfo = getElementInfo(element);
                
                // Log the view event
                logEvent('view', elementInfo.type, elementInfo.details);
                
                // Stop observing this element (only log first view)
                observer.unobserve(element);
            }
        });
    }, options);
    
    // Observe key sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => observer.observe(section));
    
    // Observe images
    const images = document.querySelectorAll('img');
    images.forEach(img => observer.observe(img));
    
    // Observe any other important elements
    const importantElements = document.querySelectorAll('nav a, .gallery-item, .timeline-item');
    importantElements.forEach(element => observer.observe(element));
}

/**
 * Get information about the element for tracking purposes
 * @param {HTMLElement} element - The DOM element to analyze
 * @returns {Object} Information about the element
 */
function getElementInfo(element) {
    // Default values
    let type = 'unknown';
    let details = '';
    
    // Check element tag
    const tagName = element.tagName.toLowerCase();
    
    // Determine element type based on tag and attributes
    if (tagName === 'a') {
        type = 'link';
        details = element.textContent || element.href;
        
        // Check if it's the CV link
        if (element.href.includes('.pdf')) {
            details = 'CV Download';
        }
    } 
    else if (tagName === 'img') {
        type = 'image';
        details = element.alt || element.src.split('/').pop();
        
        // Check if it's the profile picture
        if (element.classList.contains('profile-picture')) {
            details = 'Profile Picture';
        }
    }
    else if (tagName === 'button') {
        type = 'button';
        details = element.textContent;
    }
    else if (element.classList.contains('gallery-item')) {
        type = 'hometown-image';
        const img = element.querySelector('img');
        details = img ? (img.alt || img.src.split('/').pop()) : 'Hometown Image';
    }
    else if (element.classList.contains('timeline-item')) {
        type = 'education-item';
        const header = element.querySelector('h3');
        details = header ? header.textContent : 'Education Item';
    }
    else if (element.classList.contains('skill-item')) {
        type = 'skill-bar';
        const name = element.querySelector('.skill-name');
        details = name ? name.textContent : 'Skill Item';
    }
    // Find parent section if we couldn't identify the element specifically
    else {
        // Try to find a parent section to give context
        const parentSection = element.closest('section');
        if (parentSection) {
            const sectionTitle = parentSection.querySelector('h2');
            if (sectionTitle) {
                type = 'section-content';
                details = sectionTitle.textContent + ' section';
            }
        }
    }
    
    return { type, details };
}

/**
 * Log an event to the console with timestamp
 * @param {string} eventType - Type of event (click, view)
 * @param {string} objectType - Type of object interacted with
 * @param {string} details - Additional details about the event
 */
function logEvent(eventType, objectType, details) {
    // Get current timestamp
    const timestamp = new Date().toISOString();
    
    // Format the output
    const output = `${timestamp}, ${eventType}, ${objectType}: ${details}`;
    
    // Log to console
    console.log(output);
    
    // Optional: Store events in an array for later analysis
    if (!window.eventTracking) {
        window.eventTracking = [];
    }
    window.eventTracking.push({
        timestamp,
        eventType,
        objectType,
        details
    });
}

/**
 * Get tracking data as JSON (accessible from console)
 * @returns {string} JSON string of tracking data
 */
window.getTrackingData = function() {
    return JSON.stringify(window.eventTracking || [], null, 2);
};
