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
});

