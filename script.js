/**
 * SNT Demo Site — JavaScript
 * 1) Smooth page loading (fade-in)
 * 2) Interactive tabs with animation
 * 3) Scroll-triggered section reveal
 * 4) Mobile menu
 * 5) Slider nav, accordion, Yandex map
 */

document.addEventListener('DOMContentLoaded', function () {

    // ======================
    // 1. SMOOTH PAGE LOADING
    // ======================
    // Small delay so CSS transitions kick in
    requestAnimationFrame(function () {
        document.body.classList.add('loaded');
    });

    // ======================
    // 2. SCROLL-TRIGGERED ANIMATIONS
    // ======================
    // Add .animate-on-scroll to major sections
    var sections = document.querySelectorAll(
        '.block, section.tabs, .bg-yellow, .footer__top, .footer__bottom'
    );
    sections.forEach(function (sec) {
        sec.classList.add('animate-on-scroll');
    });

    // IntersectionObserver for reveal on scroll
    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target); // only once
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        document.querySelectorAll('.animate-on-scroll').forEach(function (el) {
            observer.observe(el);
        });
    } else {
        // Fallback: just show everything
        document.querySelectorAll('.animate-on-scroll').forEach(function (el) {
            el.classList.add('is-visible');
        });
    }


    // ======================
    // 3. INTERACTIVE TABS
    // ======================
    var tabLinks = document.querySelectorAll('#tabs-nav a');
    var tabPanels = document.querySelectorAll('.tabs__panel');

    tabLinks.forEach(function (link) {
        // --- Hover: ripple/glow feedback ---
        link.addEventListener('mouseenter', function () {
            this.style.willChange = 'transform, background, box-shadow';
        });
        link.addEventListener('mouseleave', function () {
            this.style.willChange = 'auto';
        });

        // --- Click: switch tabs with animation ---
        link.addEventListener('click', function (e) {
            e.preventDefault();

            // Skip if already active
            if (this.getAttribute('aria-selected') === 'true') return;

            // Deactivate all
            tabLinks.forEach(function (l) {
                l.setAttribute('aria-selected', 'false');
                l.classList.remove('active');
            });

            // Hide all panels with a quick fade
            tabPanels.forEach(function (p) {
                p.style.display = 'none';
                p.style.opacity = '0';
            });

            // Activate clicked tab
            this.setAttribute('aria-selected', 'true');
            this.classList.add('active');

            // Show target panel with fade-in
            var targetId = this.getAttribute('data-tab');
            var targetPanel = document.getElementById(targetId);
            if (targetPanel) {
                targetPanel.style.display = 'block';
                // Force reflow before animating
                void targetPanel.offsetWidth;
                targetPanel.style.opacity = '1';
                targetPanel.style.transition = 'opacity 0.35s ease';
            }

            // Click animation: quick pulse
            var btn = this;
            btn.style.transform = 'translateY(2px) scale(0.96)';
            setTimeout(function () {
                btn.style.transform = '';
            }, 120);
        });

        // --- Keyboard: Enter & Space ---
        link.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // Set first tab visually active on load
    if (tabLinks.length > 0) {
        tabLinks[0].classList.add('active');
        // Ensure first panel is visible with opacity
        var firstPanel = document.getElementById(tabLinks[0].getAttribute('data-tab'));
        if (firstPanel) {
            firstPanel.style.opacity = '1';
        }
    }


    // ======================
    // 4. MOBILE MENU TOGGLE
    // ======================
    var menuBtn = document.querySelector('.header__btn-menu');
    var nav = document.querySelector('.header .nav');
    var body = document.body;

    // Create overlay
    var overlay = document.createElement('div');
    overlay.className = 'nav--mobile-overlay';
    document.body.appendChild(overlay);

    function openMenu() {
        nav.classList.add('nav--open');
        menuBtn.classList.add('is-active');
        overlay.classList.add('is-open');
        body.style.overflow = 'hidden';
    }

    function closeMenu() {
        nav.classList.remove('nav--open');
        menuBtn.classList.remove('is-active');
        overlay.classList.remove('is-open');
        body.style.overflow = '';
    }

    if (menuBtn && nav) {
        menuBtn.addEventListener('click', function () {
            if (nav.classList.contains('nav--open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // Close on overlay click
        overlay.addEventListener('click', closeMenu);

        // Close on nav link click (mobile)
        nav.querySelectorAll('.nav__link').forEach(function (link) {
            link.addEventListener('click', closeMenu);
        });

        // Close on Escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeMenu();
        });
    }


    // ======================
    // 5. SLIDER NAVIGATION
    // ======================
    var sliderSections = document.querySelectorAll('.offers__btns');
    sliderSections.forEach(function (btns) {
        var section = btns.closest('section') || btns.closest('.block');
        if (!section) return;

        var row = section.querySelector('.offers__row');
        if (!row) return;

        var prevBtn = btns.querySelector('.offers__btn:not(.offers__btn--next)');
        var nextBtn = btns.querySelector('.offers__btn--next');

        if (prevBtn) {
            prevBtn.addEventListener('click', function () {
                row.scrollBy({ left: -400, behavior: 'smooth' });
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', function () {
                row.scrollBy({ left: 400, behavior: 'smooth' });
            });
        }
    });


    // ======================
    // 6. ACCORDION
    // ======================
    var accordionLabels = document.querySelectorAll('.accordion__label');
    accordionLabels.forEach(function (label) {
        label.addEventListener('click', function (e) {
            e.preventDefault();
            var item = this.closest('.accordion__item');
            if (item) {
                item.classList.toggle('accordion--open');
            }
        });
    });


    // ======================
    // 7. YANDEX MAP
    // ======================
    var mapContainer = document.getElementById('map');
    if (mapContainer && typeof ymaps !== 'undefined') {
        ymaps.ready(function () {
            var myMap = new ymaps.Map('map', {
                center: [55.6777, 37.2833],
                zoom: 14,
                controls: ['zoomControl', 'fullscreenControl']
            });

            myMap.geoObjects.add(new ymaps.Placemark([55.6777, 37.2833], {
                balloonContent: 'СНТ Демо'
            }, {
                preset: 'islands#greenDotIcon'
            }));
        });
    }


    // ======================
    // 8. SMOOTH ANCHOR LINKS
    // ======================
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        if (anchor.closest('#tabs-nav')) return; // skip tabs

        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href').substring(1);
            if (!targetId) return;

            var target = document.getElementById(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });


    // ======================
    // 9. RESPONSIVE: Close menu on resize to desktop
    // ======================
    var mql = window.matchMedia('(min-width: 992px)');
    mql.addEventListener('change', function (e) {
        if (e.matches) closeMenu();
    });

});
