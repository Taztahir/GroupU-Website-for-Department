// Wait for DOM content to load
document.addEventListener('DOMContentLoaded', () => {
    // Intersection Observer for scroll animations
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    // Observe all elements with the .reveal class
    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });

    // Navigation and Mobile Menu
    const header = document.querySelector('.header');
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const navOverlay = document.getElementById('nav-overlay');
    
    // Toggle Mobile Menu
    function toggleMenu() {
        mainNav.classList.toggle('active');
        navOverlay.classList.toggle('active');
        document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
        
        const icon = menuToggle.querySelector('i');
        if (mainNav.classList.contains('active')) {
            icon.setAttribute('data-lucide', 'x');
        } else {
            icon.setAttribute('data-lucide', 'menu');
        }
        lucide.createIcons();
    }

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', toggleMenu);
    }

    if (navOverlay) {
        navOverlay.addEventListener('click', toggleMenu);
    }

    // Mobile Dropdown Toggle
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            if (window.innerWidth <= 991) {
                e.preventDefault();
                e.stopPropagation(); // Prevent closing the menu
                const parent = toggle.parentElement;
                parent.classList.toggle('active');
            }
        });
    });

    // Close menu when clicking on a link (mobile) - excluding dropdown toggles
    document.querySelectorAll('.nav-link:not(.dropdown-toggle)').forEach(link => {
        link.addEventListener('click', () => {
            if (mainNav.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // Header scroll effect & Back to Top visibility
    window.addEventListener('scroll', () => {
        // Header effect
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Back to Top button
        const backToTopBtn = document.getElementById('backToTop');
        if (backToTopBtn) {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('active');
            } else {
                backToTopBtn.classList.remove('active');
            }
        }
    });

    // Back to Top Button
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }



    // Initialize Lucide icons on page load
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Animated Number Counters
    const counterElements = document.querySelectorAll('.counter');
    if (counterElements.length > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    entry.target.classList.add('counted');
                    animateCounter(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counterElements.forEach(el => counterObserver.observe(el));

        function animateCounter(el) {
            const text = el.textContent.trim();
            // Parse the number and suffix (e.g., "10K+" → 10, "K+")
            const match = text.match(/^([\d,.]+)(.*)/);
            if (!match) return;

            let targetStr = match[1].replace(/,/g, '');
            const suffix = match[2] || '';
            const target = parseFloat(targetStr);
            const hasComma = match[1].includes(',');

            // Respect reduced motion
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (prefersReducedMotion) {
                el.textContent = match[1] + suffix;
                return;
            }

            // Skip if target is 0 or NaN
            if (!target || isNaN(target)) {
                el.textContent = text;
                return;
            }

            const duration = 2000;
            const startTime = performance.now();

            function update(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Ease-out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                let current = Math.floor(eased * target);

                if (hasComma) {
                    el.textContent = current.toLocaleString() + suffix;
                } else {
                    el.textContent = current + suffix;
                }

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    el.textContent = match[1] + suffix;
                }
            }

            el.textContent = '0' + suffix;
            requestAnimationFrame(update);
        }
    }
});
