// Main JavaScript file for custom functionality

/**
 * Initialize all custom JavaScript functionality
 */
function initApp() {
    // Add custom initialization here
    setupScrollEffects();
    setupContactForm();
}

/**
 * Setup smooth scroll effects for navigation
 */
function setupScrollEffects() {
    // Example of smooth scrolling to anchors
    const smoothScrollLinks = document.querySelectorAll('a.smooth-scroll');
    
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

/**
 * Setup contact form validation and submission
 */
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic form validation
            let isValid = true;
            const requiredFields = contactForm.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('is-invalid');
                } else {
                    field.classList.remove('is-invalid');
                }
            });
            
            // If form is valid, you would typically submit it via AJAX
            if (isValid) {
                // For demo purposes, just log the form data
                const formData = new FormData(contactForm);
                console.log('Form submitted with data:');
                for (let [key, value] of formData.entries()) {
                    console.log(`${key}: ${value}`);
                }
                
                // Show success message
                const successAlert = document.createElement('div');
                successAlert.className = 'alert alert-success mt-3';
                successAlert.innerText = 'Mensagem enviada com sucesso!';
                contactForm.appendChild(successAlert);
                
                // Reset form
                contactForm.reset();
                
                // Remove success message after 3 seconds
                setTimeout(() => {
                    successAlert.remove();
                }, 3000);
            }
        });
    }
}

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initApp);

// Export functions for potential use in other modules
export { initApp, setupScrollEffects, setupContactForm };
