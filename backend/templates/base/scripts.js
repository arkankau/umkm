// Base JavaScript for UMKM Go Digital Templates

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Close mobile menu when clicking on a link
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.add('hidden');
        });
    });
});

// Smooth Scrolling for Anchor Links
document.addEventListener('DOMContentLoaded', function() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Contact Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('#contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            // Show loading state
            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="spinner"></span> Mengirim...';
            
            try {
                // Send form data to Edge Function
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: formData.get('name'),
                        email: formData.get('email'),
                        phone: formData.get('phone'),
                        message: formData.get('message'),
                        businessId: window.businessId || 'unknown'
                    })
                });
                
                if (response.ok) {
                    // Show success message
                    showNotification('Pesan berhasil dikirim! Kami akan segera menghubungi Anda.', 'success');
                    this.reset();
                } else {
                    throw new Error('Failed to send message');
                }
            } catch (error) {
                console.error('Error sending form:', error);
                showNotification('Maaf, terjadi kesalahan. Silakan coba lagi.', 'error');
            } finally {
                // Reset button state
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }
        });
    }
});

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 max-w-sm ${getNotificationClasses(type)}`;
    notification.innerHTML = `
        <div class="flex items-center">
            <span class="mr-2">${getNotificationIcon(type)}</span>
            <span>${message}</span>
            <button class="ml-auto text-gray-400 hover:text-gray-600" onclick="this.parentElement.parentElement.remove()">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function getNotificationClasses(type) {
    switch (type) {
        case 'success':
            return 'bg-green-100 text-green-800 border border-green-200';
        case 'error':
            return 'bg-red-100 text-red-800 border border-red-200';
        case 'warning':
            return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
        default:
            return 'bg-blue-100 text-blue-800 border border-blue-200';
    }
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success':
            return '✅';
        case 'error':
            return '❌';
        case 'warning':
            return '⚠️';
        default:
            return 'ℹ️';
    }
}

// Analytics Tracking
function trackEvent(eventName, eventData = {}) {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
            event_category: 'umkm_website',
            ...eventData
        });
    }
    
    // Send to our analytics endpoint
    fetch('/api/analytics', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            event: eventName,
            data: eventData,
            businessId: window.businessId || 'unknown',
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent
        })
    }).catch(error => {
        console.error('Analytics error:', error);
    });
}

// Track page views
document.addEventListener('DOMContentLoaded', function() {
    trackEvent('page_view', {
        page_title: document.title,
        page_location: window.location.href
    });
});

// Track form submissions
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function() {
            trackEvent('form_submit', {
                form_id: this.id || 'contact_form',
                form_action: this.action
            });
        });
    });
});

// Track link clicks
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="http"], a[href^="tel:"], a[href^="mailto:"]');
    links.forEach(link => {
        link.addEventListener('click', function() {
            trackEvent('link_click', {
                link_url: this.href,
                link_text: this.textContent.trim()
            });
        });
    });
});

// Track WhatsApp clicks
document.addEventListener('DOMContentLoaded', function() {
    const whatsappLinks = document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp"]');
    whatsappLinks.forEach(link => {
        link.addEventListener('click', function() {
            trackEvent('whatsapp_click', {
                phone_number: this.href.match(/\d+/)?.[0] || 'unknown'
            });
        });
    });
});

// Lazy Loading for Images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
});

// Intersection Observer for Animations
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.fade-in, .slide-up');
    
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        animationObserver.observe(element);
    });
});

// Gallery Lightbox (if needed)
function initLightbox() {
    const galleryImages = document.querySelectorAll('.gallery-image');
    
    galleryImages.forEach(image => {
        image.addEventListener('click', function() {
            const lightbox = document.createElement('div');
            lightbox.className = 'fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50';
            lightbox.innerHTML = `
                <div class="relative max-w-4xl max-h-full p-4">
                    <img src="${this.src}" alt="${this.alt}" class="max-w-full max-h-full object-contain">
                    <button class="absolute top-4 right-4 text-white text-2xl hover:text-gray-300" onclick="this.parentElement.parentElement.remove()">
                        ×
                    </button>
                </div>
            `;
            
            lightbox.addEventListener('click', function(e) {
                if (e.target === this) {
                    this.remove();
                }
            });
            
            document.body.appendChild(lightbox);
        });
    });
}

// Initialize lightbox if gallery exists
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.gallery-image')) {
        initLightbox();
    }
});

// Utility Functions
function formatPhoneNumber(phone) {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Format Indonesian phone number
    if (cleaned.startsWith('62')) {
        return cleaned.replace(/^62/, '0');
    }
    
    return cleaned;
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

// Export functions for use in templates
window.UMKMUtils = {
    showNotification,
    trackEvent,
    formatPhoneNumber,
    formatCurrency
}; 