/**
 * SensoTek A.Ş. — Navigasyon ve Mobil Hamburger Menü Modülü
 * Modüler Yapı: Bağımsız dosya, izole kapsam (IIFE).
 * Sorumluluk: Üst menü etkileşimleri, mobil açılır menü (hamburger) ve pürüzsüz kaydırma (smooth scroll).
 */

(function () {
    'use strict';

    function initNavbar() {
        const hamburgerBtn = document.getElementById('hamburger-btn');
        const navMenu = document.getElementById('nav-menu');
        const navBackdrop = document.getElementById('nav-backdrop');
        const navLinks = document.querySelectorAll('.nav-link');
        const header = document.querySelector('header');

        if (!hamburgerBtn || !navMenu) {
            return;
        }

        // Menü Açma/Kapatma
        function toggleMenu(forceState = null) {
            const isOpen = forceState !== null ? forceState : !navMenu.classList.contains('is-open');

            hamburgerBtn.classList.toggle('is-active', isOpen);
            hamburgerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            navMenu.classList.toggle('is-open', isOpen);

            if (navBackdrop) {
                navBackdrop.classList.toggle('is-visible', isOpen);
            }

            // Menü açıkken arka plan kaydırmasını mobilde engelle
            document.body.style.overflow = isOpen ? 'hidden' : '';
        }

        // Hamburger butonuna tıklama
        hamburgerBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            toggleMenu();
        });

        // Arka plan karartmasına tıklanınca kapat
        if (navBackdrop) {
            navBackdrop.addEventListener('click', function () {
                toggleMenu(false);
            });
        }

        // ESC tuşuyla kapat
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
                toggleMenu(false);
            }
        });

        // Menü linklerine tıklandığında:
        // 1. Mobilde menüyü otomatik kapat
        // 2. İlgili bölüme header yüksekliği payı bırakarak pürüzsüz kaydır
        navLinks.forEach(function (link) {
            link.addEventListener('click', function (e) {
                const targetHref = this.getAttribute('href');

                if (targetHref && targetHref.startsWith('#')) {
                    e.preventDefault();
                    const targetSection = document.querySelector(targetHref);

                    // Menüyü kapat
                    toggleMenu(false);

                    if (targetSection) {
                        const headerHeight = header ? header.offsetHeight : 70;
                        const elementPosition = targetSection.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });

                        // Aktif link vurgusunu güncelle
                        navLinks.forEach(item => item.classList.remove('active'));
                        this.classList.add('active');
                    }
                }
            });
        });

        // Sayfa kaydırıldığında aktif linki takip et (Scroll Spy)
        window.addEventListener('scroll', function () {
            const scrollPosition = window.scrollY + 120;
            const sections = document.querySelectorAll('section[id]');

            sections.forEach(function (section) {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    navLinks.forEach(function (link) {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === '#' + sectionId) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, { passive: true });
    }

    // DOM yüklendiğinde otomatik başlat
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNavbar);
    } else {
        initNavbar();
    }
})();
