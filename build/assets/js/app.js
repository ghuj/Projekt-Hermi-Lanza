document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const hamburger = document.querySelector('.hamburger-menu');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav a');

    // Add index to each li element for staggered animation
    document.querySelectorAll('.nav li').forEach((li, index) => {
        li.style.setProperty('--i', index);
    });

    // Check if screen is small
    function isSmallScreen() {
        return window.innerWidth < 769;
    }

    // Menu state functions
    function closeMenu() {
        // Remove active classes
        nav.classList.remove('active');
        hamburger.classList.remove('active');
        
        // Hide menu with animation
        requestAnimationFrame(() => {
            nav.style.transform = 'translateY(-100%)';
        });
    }

    function openMenu() {
        // Add active classes
        nav.classList.add('active');
        hamburger.classList.add('active');
        
        // Show menu with animation
        requestAnimationFrame(() => {
            nav.style.transform = 'translateY(0)';
        });
    }

    // Toggle menu on hamburger click
    hamburger.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (nav.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Handle link clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (isSmallScreen()) {
                e.preventDefault();
                const targetUrl = this.getAttribute('href');
                
                // Close menu immediately
                closeMenu();
                
                // Navigate after menu is closed
                setTimeout(() => {
                    if (targetUrl) {
                        window.location.href = targetUrl;
                    }
                }, 300);
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (isSmallScreen() && nav.classList.contains('active') && 
            !nav.contains(e.target) && !hamburger.contains(e.target)) {
            closeMenu();
        }
    });

    // Reset menu on window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (!isSmallScreen()) {
                closeMenu();
            }
        }, 250);
    });
}); 