/**
 * Ashiga AI Solution - Main JavaScript
 * Handles Hero Background Slider, Mobile Menu, and Navigation Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------------------
    // 1. Mobile Menu Toggle
    // -------------------------------------------------------------------------
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            const isActive = mobileToggle.classList.toggle('is-active');
            navMenu.classList.toggle('is-active');
            mobileToggle.setAttribute('aria-expanded', String(isActive));
            document.body.style.overflow = isActive ? 'hidden' : '';
        });

        // Close menu when clicking any nav link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('is-active');
                navMenu.classList.remove('is-active');
                mobileToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (event) => {
            if (
                navMenu.classList.contains('is-active') &&
                !navMenu.contains(event.target) &&
                !mobileToggle.contains(event.target)
            ) {
                mobileToggle.classList.remove('is-active');
                navMenu.classList.remove('is-active');
                mobileToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    }

    // -------------------------------------------------------------------------
    // 2. Header Scroll Effect
    // -------------------------------------------------------------------------
    const header = document.querySelector('.site-header');
    if (header) {
        const handleScroll = () => {
            if (window.scrollY > 25) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    }

    // -------------------------------------------------------------------------
    // 3. Hero Section Smooth Auto-Slider (3 Slides)
    // -------------------------------------------------------------------------
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.slider-dot');
    const heroSlider = document.getElementById('heroSlider');
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    const slideIntervalDuration = 2500; // 5 seconds per slide
    let slideTimer = null;

    function goToSlide(index) {
        if (totalSlides === 0) return;

        // Wrap index within bounds
        const targetIndex = (index + totalSlides) % totalSlides;

        // Remove active class from previous
        slides[currentSlide].classList.remove('active');
        if (dots[currentSlide]) {
            dots[currentSlide].classList.remove('active');
        }

        // Add active class to target
        currentSlide = targetIndex;
        slides[currentSlide].classList.add('active');
        if (dots[currentSlide]) {
            dots[currentSlide].classList.add('active');
        }
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function startSlideTimer() {
        stopSlideTimer();
        slideTimer = setInterval(nextSlide, slideIntervalDuration);
    }

    function stopSlideTimer() {
        if (slideTimer) {
            clearInterval(slideTimer);
            slideTimer = null;
        }
    }

    // Initialize dots click listeners
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
            startSlideTimer(); // Reset auto timer after user click
        });
    });

    // Pause on hover over slider/hero container so user can read peacefully
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroSection.addEventListener('mouseenter', stopSlideTimer);
        heroSection.addEventListener('mouseleave', startSlideTimer);
    }

    // Start auto sliding
    startSlideTimer();

    // Touch Swipe Support for Mobile / Tablets
    if (heroSection) {
        let touchStartX = 0;
        let touchEndX = 0;

        heroSection.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        heroSection.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 50;
            if (touchEndX < touchStartX - swipeThreshold) {
                // Swipe left -> Next slide
                nextSlide();
                startSlideTimer();
            } else if (touchEndX > touchStartX + swipeThreshold) {
                // Swipe right -> Prev slide
                goToSlide(currentSlide - 1);
                startSlideTimer();
            }
        }
    }

    // -------------------------------------------------------------------------
    // 4. Fullscreen Slider Section (with Left-Side Boxes)
    // -------------------------------------------------------------------------
    const fsSlides = document.querySelectorAll('.fs-slide');
    const fsDots = document.querySelectorAll('.fs-dot');
    const fsPrevBtn = document.getElementById('fsPrevBtn');
    const fsNextBtn = document.getElementById('fsNextBtn');
    const fsSlider = document.getElementById('fullscreenSlider');

    if (fsSlides.length > 0) {
        let currentFsSlide = 0;
        let fsSlideTimer = null;
        const fsSlideDuration = 5500;

        function goToFsSlide(index) {
            const target = (index + fsSlides.length) % fsSlides.length;
            fsSlides[currentFsSlide].classList.remove('active');
            if (fsDots[currentFsSlide]) fsDots[currentFsSlide].classList.remove('active');

            currentFsSlide = target;
            fsSlides[currentFsSlide].classList.add('active');
            if (fsDots[currentFsSlide]) fsDots[currentFsSlide].classList.add('active');
        }

        function startFsTimer() {
            stopFsTimer();
            fsSlideTimer = setInterval(() => goToFsSlide(currentFsSlide + 1), fsSlideDuration);
        }

        function stopFsTimer() {
            if (fsSlideTimer) {
                clearInterval(fsSlideTimer);
                fsSlideTimer = null;
            }
        }

        if (fsNextBtn) {
            fsNextBtn.addEventListener('click', () => {
                goToFsSlide(currentFsSlide + 1);
                startFsTimer();
            });
        }

        if (fsPrevBtn) {
            fsPrevBtn.addEventListener('click', () => {
                goToFsSlide(currentFsSlide - 1);
                startFsTimer();
            });
        }

        fsDots.forEach((dot, idx) => {
            dot.addEventListener('click', () => {
                goToFsSlide(idx);
                startFsTimer();
            });
        });

        if (fsSlider) {
            fsSlider.addEventListener('mouseenter', stopFsTimer);
            fsSlider.addEventListener('mouseleave', startFsTimer);
        }

        startFsTimer();
    }

    // -------------------------------------------------------------------------
    // 5. World Map Location Pins Animation on Scroll
    // -------------------------------------------------------------------------
    const mapWrapper = document.getElementById('worldMapWrapper');
    if (mapWrapper) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    mapWrapper.classList.add('pins-animated');
                    observer.unobserve(mapWrapper);
                }
            });
        }, { threshold: 0.25 });

        observer.observe(mapWrapper);
    }

    // -------------------------------------------------------------------------
    // 6. Scroll-Triggered animate__fadeInUp on Section Elements (animate.style)
    // -------------------------------------------------------------------------
    const sectionElements = document.querySelectorAll(
        '.hero-tag, .hero-title, .hero-description, .hero-actions, .hero-stats, ' +
        '.hero-grid-header, .hero-images-grid .grid-card, ' +
        '.page-hero-breadcrumbs, .page-hero-title, .page-hero-subtitle, ' +
        '.banner-col, ' +
        '.services-header, .service-item, ' +
        '.about-visual, .about-content, ' +
        '.stat-card, ' +
        '.global-header, .map-wrapper, .global-cities-strip, ' +
        '.cta-card, ' +
        '.footer-col, ' +
        '.editorial-header, .editorial-lead, .editorial-highlight, .about-two-images, .editorial-bullets, .editorial-cta-bar, ' +
        '.contact-info-panel, .contact-form-panel, .contact-map-wrapper'
    );

    if (sectionElements.length > 0 && 'IntersectionObserver' in window) {
        sectionElements.forEach(el => {
            el.classList.add('animate-on-scroll');
        });

        const sectionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate__animated', 'animate__fadeInUp');
                    entry.target.classList.remove('animate-on-scroll');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.05,
            rootMargin: '0px 0px -20px 0px'
        });

        sectionElements.forEach(el => {
            sectionObserver.observe(el);
        });
    }
});

