// Pinterest-style Gallery with Lightbox
document.addEventListener('DOMContentLoaded', function() {
    const gallery = document.querySelector('.masonry-gallery');
    const lightboxModal = document.querySelector('.lightbox-modal');
    const lightboxImage = document.querySelector('.lightbox-image');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    const currentCounter = document.querySelector('.lightbox-counter .current');
    const totalCounter = document.querySelector('.lightbox-counter .total');
    let currentImageIndex = 0;
    let images = [];
    
    // Initialize gallery
    function initGallery() {
        const galleryItems = document.querySelectorAll('.gallery-item img');
        images = Array.from(galleryItems);
        
        // Set total counter
        totalCounter.textContent = images.length;
        
        // Add click event to each image
        images.forEach((img, index) => {
            img.addEventListener('click', () => {
                openLightbox(index);
            });
        });
        
        // Add keyboard navigation
        document.addEventListener('keydown', handleKeyboard);
        
        // Add touch/swipe support for mobile
        addTouchSupport();
    }
    
    // Open lightbox
    function openLightbox(index) {
        currentImageIndex = index;
        const img = images[index];
        
        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt;
        currentCounter.textContent = index + 1;
        
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus management for accessibility
        lightboxClose.focus();
    }
    
    // Close lightbox
    function closeLightbox() {
        lightboxModal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Navigate to previous image
    function prevImage() {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        updateLightboxImage();
    }
    
    // Navigate to next image
    function nextImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateLightboxImage();
    }
    
    // Update lightbox image
    function updateLightboxImage() {
        const img = images[currentImageIndex];
        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt;
        currentCounter.textContent = currentImageIndex + 1;
    }
    
    // Handle keyboard navigation
    function handleKeyboard(e) {
        if (!lightboxModal.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                prevImage();
                break;
            case 'ArrowRight':
                nextImage();
                break;
        }
    }
    
    // Add touch/swipe support for mobile
    function addTouchSupport() {
        let startX = 0;
        let startY = 0;
        
        lightboxModal.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        lightboxModal.addEventListener('touchend', (e) => {
            if (!lightboxModal.classList.contains('active')) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            // Check if it's a horizontal swipe
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    nextImage(); // Swipe left
                } else {
                    prevImage(); // Swipe right
                }
            }
        });
    }
    
    // Event listeners
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', prevImage);
    lightboxNext.addEventListener('click', nextImage);
    
    // Close lightbox when clicking outside the image
    lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) {
            closeLightbox();
        }
    });
    
    // Add zoom functionality
    lightboxImage.addEventListener('click', () => {
        lightboxImage.classList.toggle('zoomed');
    });
    
    // Initialize gallery when DOM is loaded
    initGallery();
    
    // Add loading animation for images
    const galleryItems = document.querySelectorAll('.gallery-item img');
    galleryItems.forEach(img => {
        img.addEventListener('load', function() {
            this.parentElement.classList.add('loaded');
            this.parentElement.style.opacity = '1';
        });
        
        img.addEventListener('error', function() {
            this.parentElement.classList.add('loaded');
            this.parentElement.style.opacity = '1';
        });
    });
    
    // Add lazy loading for better performance
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });
        
        galleryItems.forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Add preloading for better UX
    function preloadImages() {
        const imageUrls = images.map(img => img.src);
        imageUrls.forEach(url => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = url;
            document.head.appendChild(link);
        });
    }
    
    // Preload images after a short delay
    setTimeout(preloadImages, 1000);
});

// Add smooth scrolling for gallery navigation
document.addEventListener('DOMContentLoaded', function() {
    const galleryLink = document.querySelector('a[href="#gallery"]');
    if (galleryLink) {
        galleryLink.addEventListener('click', function(e) {
            e.preventDefault();
            const gallerySection = document.querySelector('#gallery');
            if (gallerySection) {
                gallerySection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
}); 